define(['knockout',
  'knockout.validation',
  'scripts/vendor/knockout-validation/localization/zh-CN',
  'scripts/utils/tool',
  'scripts/utils/helpers',
  'scripts/utils/router',
  'scripts/libs/bootstrap-modal',
  'scripts/ko-viewmodel/ko-pagination',
  'text!./customer-blacklist.html',
  'css!customer-blacklist'], function (ko,
                                       validation,
                                       locale,
                                       Tool,
                                       helpers,
                                       Router,
                                       modal,
                                       PaginationViewModel,
                                       templateString,
                                       css) {
  validation.locale('zh-CN');

  var tool = new Tool();

  /**
   * 功能限制构造函数
   * @param param
   * @returns {Constraint}
   * @constructor
   */
  var Constraint = function (param) {
    var constraint = param || {};
    var self = this;
    self.funcNo = ko.observable(constraint.funcNo || '')
      .extend({
        required: true,
        maxLength: 200
      }); // 功能编号
    self.custId = ko.observable(constraint.custId || ''); // 客户编号
    self.constraintType = ko.observable(constraint.constraintType || 0); // 限制类型 0-黑名单 1-白名单 ---必填
    self.mobile = ko.observable(constraint.mobile || ''); // 手机号,非必填
    // 有 ID 字段才传
    if (constraint.id || constraint.id === 0) {
      self.id = ko.observable(constraint.id);
    }

    /**
     * 使用 vlaidate 观察字段是否有效
     */
    self.inValid = ko.pureComputed(function () {
      return !self.validate(true);
    }, this);

    /**
     * 使用 ko validation 验证字段是否有效
     * @param showMessages
     * @returns {boolean}
     */
    self.validate = function (showMessages) {
      var errors = ko.validation.group([self.funcNo]);
      if (showMessages) {
        errors.showAllMessages();
      }
      return errors().length === 0;
    };

    /**
     * 提交数据时生成的 JSON
     * @returns {{funcNo: (T | *), custId: (*|any), constraintType: (*|any), mobile: (*|any)}}
     */
    this.toJSON = function () {
      var data = {
        funcNo: self.funcNo(),
        custId: self.custId(),
        constraintType: self.constraintType(),
        mobile: self.mobile()
      };
      if (self.id || self.id === 0) {
        data.id = self.id();
      }
      return data;
    };

    return self;
  };

  var ViewModel = function (params) {
    var self = this;

    // 限制相关
    //
    this.constraints = ko.observableArray([]); // 限制列表
    this.currentConstraint = ko.observable(); // 当前新增的限制对象
    this.availableConstraintTypes = [{
      id: 0,
      description: '黑名单'
    }, {
      id: 1,
      description: '白名单'
    }]; // 可选的限制类型
    this.chosenConstraintType = ko.observable(); // 查询条件: 选中的限制类型
    this.chosenMobile = ko.observable(); // 查询条件: 选中要进行查询的手机号
    this.chosenFuncNo = ko.observable(); // 查询条件: 选中要进行查询功能编号

    // 分页相关
    //
    this.pageNum = ko.observable(1);
    this.pageSize = ko.observable(10);
    this.showPaginationTemplate = ko.observable(false);
    this.nodata = ko.observable(true);

    PaginationViewModel.apply(self, [function (pageNum, pageHandler) {
      pageHandler.call(self, self.resultData());
      self.pageNum(pageNum);
      // self.search()
      self.getList(self.getQueryParams());
    }]);

    // Message 和 Alert 模态框
    //
    this.promptMessage = ko.observable(); // Ajax 请求提示消息
    this.confirmMessage = ko.observable(); // 危险操作确认消息
    this.init(params);
  };

  ViewModel.prototype = {
    /**
     * 页面初始化
     * @param params
     */
    init: function (params) {
      var self = this;
      document.title = '客户黑白名单'; // 设置页面标题
    },

    //
    // 功能限制管理
    //
    /**
     * 拼接查询列表的请求参数
     * @returns {{pageNum: *, pageSize: *, type: (*|any), funcNo: (*|any)}}
     */
    getQueryParams: function () {
      var query = {
        pageNum: this.pageNum(),
        pageSize: this.pageSize(),
        type: this.chosenConstraintType(),
        funcNo: this.chosenFuncNo()
      };
      if (this.chosenMobile()) {
        query.mobile = this.chosenMobile();
      }

      return query;
    },

    /**
     * 查询按钮点击处理
     */
    handleSearchClick: function () {
      this.isFirst(true);
      this.search();
    },

    /**
     * 分页查询第一页数据
     */
    search: function () {
      this.pageNum(1);
      this.pageSize(10);
      this.getList(this.getQueryParams());
    },

    /**
     * 搜索限制信息
     * 示例响应:
     * {
        "resultCode": "00000",
        "resultMsg": "成功",
        "resultData": {
          "pageSize": 10,
          "pageNum": 1,
          "totalPage": 1,
          "totalCount": 2,
          "data": [{
            "id": 1,
            "custId": "22",
            "mobile": null,
            "funcNo": "0001",
            "constraintType": 0,
            "state": 1,
            "createdDate": 1499939870000,
            "modifiedDate": 1499939870000
          }, {
            "id": 2,
            "custId": null,
            "mobile": null,
            "funcNo": "0002",
            "constraintType": 0,
            "state": 1,
            "createdDate": 1495083746000,
            "modifiedDate": 1495083746000
          }]
        }
      }
     * @param params
     */
    getList: function (params) {
      var self = this;
      tool.request({
        url: '/fstr/getFuncConstraints',
        data: params,
        success: function (data) {
          var resultData = data.resultData;
          if (resultData && resultData.length !== 0) {
            self.constraints(resultData.data);
            // 分页
            self.pageNum() === 1 && self.initFn(resultData);
            self.showPaginationTemplate(true);
            self.nodata(false);
          } else {
            self.constraints([]);
            self.nodata(true);
          }
        },
        error: function (data) {
          //console.log(data);
        }
      });
    },

    getValueById: function (arr, id) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return arr[i].description;
        }
      }
      return '--';
    },
    getConstraintTypeText: function (id) {
      return this.getValueById(this.availableConstraintTypes, id);
    },

    /**
     * 显示添加客户黑名单对话框
     */
    showConstraintDialog: function () {
      var self = this;
      self.currentConstraint(new Constraint());

      $('#constraintDialog').one('shown', function (e) {
      }).one('hidden', function (e, currentTarget) {
        if (currentTarget === 'save') {
          self.addConstraint(self.currentConstraint());
        }
      }).modal({
        show: true,
        backdrop: true
      });
    },

    /**
     * 添加限制, 成功后更新列表
     * @param data
     */
    addConstraint: function (data) {
      var self = this;
      this.addConstraintRemote(data, function () {
        // 更新限制列表
        self.search();
      }, function () {
        // 错误提示消息
        self.message('添加失败.');
      });
    },

    /**
     * 添加限制请求
     * @param data
     * @param resolveHandler
     * @param rejectHandler
     */
    addConstraintRemote: function (data, resolveHandler, rejectHandler) {
      var self = this;
      tool.request({
        url: '/fstr/addFuncConstraint',
        data: data,
        success: resolveHandler || function () {
          //console.log('remove successed.');
        },
        error: rejectHandler || function () {
          //console.log('remove failed.');
        }
      });
    },

    /**
     * 删除限制, 成功后更新列表
     * @param data
     */
    removeConstraint: function (data) {
      var self = this;
      this.removeRemote(data.id, function () {
        // 更新限制列表
        self.search();
      }, function (msg) {
        // 错误提示消息
        self.message('删除失败.');
      });
    },

    /**
     * 删除请求
     * @param id
     * @param resolveHandler
     * @param rejectHandler
     */
    removeRemote: function (id, resolveHandler, rejectHandler) {
      var self = this;
      tool.request({
        url: '/fstr/removeFuncConstraint',
        data: { id: id },
        success: resolveHandler || function () {
          //console.log('remove successed.');
        },
        error: rejectHandler || function () {
          //console.log('remove failed.');
        }
      });
    },

    /**
     * 删除的确认操作对话框
     * @param data
     * @param event
     */
    handleDeleteConstraint: function (data, event) {
      event.preventDefault();
      var self = this;
      self.confirmMessage('确定要删除该条限制吗?');
      $('#constraintConfirmDialog').one('shown', function (e) {
      }).one('hidden', function (e, currentTarget) {
        if (currentTarget === 'confirm') {
          self.removeConstraint(data);
        }
      }).modal({
        show: true,
        backdrop: true
      });
    },

    /**
     * Ajax 请求成功/失败的消息提示
     */
    message: function (promptMessage) {
      var self = this;
      self.promptMessage(promptMessage);
      $('#constraintMessageDialog').one('shown', function (e) {
      }).one('hidden', function (e, currentTarget) {
      }).modal({
        show: true,
        backdrop: true
      });
    }
  };

  return {
    viewModel: ViewModel,
    template: templateString
  };
});

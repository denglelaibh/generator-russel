define(['knockout',
  'knockout.validation',
  'scripts/vendor/knockout-validation/localization/zh-CN',
  'scripts/utils/tool',
  'scripts/utils/helpers',
  'scripts/utils/router',
  'scripts/libs/bootstrap-modal',
  'scripts/ko-viewmodel/ko-pagination',
  'text!./<%= moduleName %>.html',
  'css!<%= moduleName %>'], function (ko,
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
   * <%= modelName %>构造函数
   * @param param
   * @returns {<%= modelName %>}
   * @constructor
   */
  var <%= modelUpperFirstName %> = function (_param) {
    var param = _param || {};
    var self = this;
    <% for(var i=0; i<attrs.length; i++) { %>
      self.<%= attrs[i].name%> = ko.observable(param.<%= attrs[i].name%>
        <% if (attrs[i].type.toLowerCase() === 'string' || attrs[i].type.toLowerCase() === 'datetimerange' || attrs[i].type.toLowerCase() === 'daterange' ) { %>|| '');<% }%>
        <% if (attrs[i].type.toLowerCase() === 'integer') { %>|| 0); <% }%>
    <% } %>
    // 有 ID 字段才传
    if (param.id || param.id === 0) {
      self.id = ko.observable(param.id);
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
      var errors = ko.validation.group([]);
      if (showMessages) {
        errors.showAllMessages();
      }
      return errors().length === 0;
    };

    /**
     * 提交数据时生成的 JSON
     */
    this.toJSON = function () {
      var data = {
        <% for(var i=0; i<attrs.length; i++) { %>
          <%= attrs[i].name %>: self.<%= attrs[i].name %>()<% if (i !== attrs.length -1) { %>,<% } %>
        <% }%>
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

    // 列表数据
    //
    this.<%= modelPluralCamelName %> = ko.observableArray([]); // <%= modelUpperFirstName %>列表
    // this.constraints = ko.observableArray([]); // <%= modelUpperFirstName %>列表
    // 新增/编辑对话框数据
    //
    <% if (actionTypes.includeCreate || actionTypes.includeRetrieve || actionTypes.includeUpdate) {%>
    this.<%= modelCurrentName %> = ko.observable(); // 当前新增的<%= modelUpperFirstName %>对象
    <%}%>

    // 表单字段 - chosenXXX
    //
    <% for (let i = 0; i < formFields.length; i++) { %>
    this.<%= formFields[i].chosenAttrName %> = ko.observable(); // 查询条件: 选中的<%= formFields[i].name %>
    <% } %>
    // availableXXX
    //
    <% for (let i = 0; i < formFields.length; i++) { %>
    this.<%= formFields[i].availableAttrName %> = [{
      id: 0,
      description: 'foo'
    }, {
      id: 1,
      description: 'bar'
    }]; // 可选的 <%= formFields[i].name %>
    <% } %>

    //  TODO: 询问是否需要分页
    // 分页相关
    //
    this.pageNum = ko.observable(1);
    this.pageSize = ko.observable(10);
    this.showPaginationTemplate = ko.observable(false);
    this.nodata = ko.observable(true);

    PaginationViewModel.apply(self, [function (pageNum, pageHandler) {
      pageHandler.call(self, self.resultData());
      self.pageNum(pageNum);
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
      document.title = '<%= moduleTitle %>'; // 设置页面标题
    },

    //
    // <%= moduleName %>管理
    //
    /**
     * 拼接查询列表的请求参数
     * @returns {{pageNum: *, pageSize: *, type: (*|any), funcNo: (*|any)}}
     */
    getQueryParams: function () {
      // TODO: 增加是否是分页的判断, 增加分页参数
      var query = {
        pageNum: this.pageNum(),
        pageSize: this.pageSize()
      };
      <% for (let i = 0; i < formFields.length; i++) { %>
        if (this.<%= formFields[i].chosenAttrName %>()) {
          query.<%= formFields[i].name %> = this.<%= formFields[i].chosenAttrName %>();
        }
      <% } %>

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
     * 搜索 <%= modelName %> 信息
     * 示例响应:
     * @param params
     */
    getList: function (params) {
      var self = this;
      tool.request({
        url: '/<%= modelKebabName %>/get<%= modelPluralUpperFirstName %>',
        data: params,
        success: function (data) {
          var resultData = data.resultData;
          if (resultData && resultData.length !== 0) {
            self.<%= modelPluralCamelName %>(resultData.data);
            // self.constraints(resultData.data);
            // 分页
            self.pageNum() === 1 && self.initFn(resultData);
            self.showPaginationTemplate(true);
            self.nodata(false);
          } else {
            self.<%= modelPluralCamelName %>([]);
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
    <% for (let i = 0; i < attrs.length; i++) { %>
    get<%= attrs[i].upperFirstAttrName %>Text: function (id) {
      return this.getValueById(this.<%= attrs[i].availableAttrName %>, id);
    },
    <% }%>

  <% if (actionTypes.includeCreate) {%>
    /**
     * 显示添加 <%= modelName %>对话框
     */
    show<%= modelUpperFirstName %>Dialog: function () {
      var self = this;
      self.<%= modelCurrentName %>(new <%= modelUpperFirstName %>());

      $('#<%= modelKebabName %>Dialog').one('shown', function (e) {
      }).one('hidden', function (e, currentTarget) {
        if (currentTarget === 'save') {
          self.add<%= modelUpperFirstName %>(self.<%= modelCurrentName %>());
        }
      }).modal({
        show: true,
        backdrop: true
      });
    },

    /**
     * 添加 <%= modelName %>, 成功后更新列表
     * @param data
     */
    add<%= modelUpperFirstName %>: function (data) {
      var self = this;
      this.add<%= modelUpperFirstName %>Remote(data, function () {
        // 更新<%= modelName %>列表
        self.search();
      }, function () {
        // 错误提示消息
        self.message('添加失败.');
      });
    },

    /**
     * 添加<%= modelName %>请求
     * @param data
     * @param resolveHandler
     * @param rejectHandler
     */
    add<%= modelUpperFirstName %>Remote: function (data, resolveHandler, rejectHandler) {
      var self = this;
      tool.request({
        url: '/<%= modelKebabName %>/add<%= modelUpperFirstName %>',
        data: data,
        success: resolveHandler || function () {
        },
        error: rejectHandler || function () {
        }
      });
    },
  <%}%>

    <% if (actionTypes.includeDelete) {%>
    /**
     * 删除 <%= modelName %>, 成功后更新列表
     * @param data
     */
    remove<%= modelUpperFirstName%>: function (data) {
      var self = this;
      this.remove<%= modelUpperFirstName %>Remote(data.id, function () {
        // 更新<%= modelName %>列表
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
    remove<%= modelUpperFirstName %>Remote: function (id, resolveHandler, rejectHandler) {
      var self = this;
      tool.request({
        url: '/<%= modelKebabName%>/remove<%= modelUpperFirstName%>',
        data: { id: id },
        success: resolveHandler || function () {
        },
        error: rejectHandler || function () {
        }
      });
    },

    /**
     * 删除的确认操作对话框
     * @param data
     * @param event
     */
    handleDelete<%= modelUpperFirstName %>: function (data, event) {
      event.preventDefault();
      var self = this;
      self.confirmMessage('确定要删除该条记录吗?');
      $('#<%= modelKebabName %>ConfirmDialog').one('shown', function (e) {
      }).one('hidden', function (e, currentTarget) {
        if (currentTarget === 'confirm') {
          self.remove<%= modelUpperFirstName %>(data);
        }
      }).modal({
        show: true,
        backdrop: true
      });
    },
    <%}%>

    /**
     * Ajax 请求成功/失败的消息提示
     */
    message: function (promptMessage) {
      var self = this;
      self.promptMessage(promptMessage);
      $('#<%= modelKebabName %>MessageDialog').one('shown', function (e) {
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

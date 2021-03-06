const Generator = require('yeoman-generator')
const {camelCase, kebabCase, lowerCase, snakeCase, startCase, toLower, upperCase, upperFirst} = require('lodash')
const pluralize = require('pluralize')
const commandExists = require('command-exists')
const yosay = require('yosay')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    this.option('moduleName', {
      desc: '输入模块名称, 如 customer-blacklist',
      type: String,
      required: true
    })
  }

  /**
   * 初始化方法. 检查当前项目状态, 获取配置等.
   */
  initializing () {
  }

  /**
   * 提示用户生成器的配置可选项
   */
  prompting () {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('恶心自己, 成全别人.'))
    }

    const done = this.async()
    const prompts = [{
      type: 'input',
      name: 'moduleName',
      message: '功能模块名称:'
    }, {
      type: 'input',
      name: 'modelName',
      message: 'Model 名称:'
    }, {
      type: 'input',
      name: 'attrs',
      message: '模型字段[name:type:label]:'
    }, {
      type: 'checkbox',
      name: 'actionTypes',
      message: '选择要支持的模型操作类型:',
      choices: [{
        name: '添加',
        value: 'includeCreate',
        checked: false
      }, {
        name: '详情',
        value: 'includeRetrieve',
        checked: false
      }, {
        name: '编辑',
        value: 'includeUpdate',
        checked: false
      }, {
        name: '删除',
        value: 'includeDelete',
        checked: false
      }, {
        name: '列表',
        value: 'includeList',
        checked: false
      }]
    }, {
      type: 'confirm',
      name: 'needPagination',
      message: '是否需要分页?',
      default: true,
      when: answers => answers.queryResult === 'multiple'
    }]

    this.prompt(prompts).then(answers => {
      // 模块名称
      this.options.moduleName = (this.options.moduleName || answers.moduleName)
      // 模型名称
      this.options.modelName = (this.options.modelName || answers.modelName)
      // 模型字段 == 表格显示字段 == 新建对话框字段
      // TODO: 把两个相同的箭头函数提取一个共同方法
      this.options.attrs = (this.options.attrs || answers.attrs).trim().split(/\s/)
      console.log('this.options.attrs = ', this.options.attrs)
      this.attrs = this.options.attrs.map(attr => ({
        name: camelCase(attr.split(':')[0]), // 属性使用 camelCase, constraintType
        kebabAttrName: kebabCase(attr.split(':')[0]), // constraint-type
        upperFirstAttrName: upperFirst(camelCase(attr.split(':')[0])), // ConstraintType
        chosenAttrName: `chosen${upperFirst(camelCase(attr.split(':')[0]))}`, // chosenConstraintType
        availableAttrName: `available${pluralize(upperFirst(camelCase(attr.split(':')[0])))}`, // availableConstraintTypes
        type: toLower(attr.split(':')[1]) || 'string', // 数据类型: string, integer, datetime, daterange etc.
        label: attr.split(':')[2] || camelCase(attr.split(':')[0])
      }))
      // 操作类型选项
      this.options.actionTypes = (this.options.actionTypes || answers.actionTypes)
      this.actionTypes = {
        includeCreate: this.options.actionTypes.includes('includeCreate'),
        includeRetrieve: this.options.actionTypes.includes('includeRetrieve'),
        includeUpdate: this.options.actionTypes.includes('includeUpdate'),
        includeDelete: this.options.actionTypes.includes('includeDelete'),
        includeList: this.options.actionTypes.includes('includeList')
      }
      console.log('actionTypes = ', this.actionTypes)
      // 是否需要分页
      this.options.needPagination = (this.options.needPagination || answers.needPagination)

      done()
    })
  }

  /**
   * 保存配置项同时配置项目(比如创建 .editorconfig 文件以及其他元数据文件)
   */
  configuring () {
    this.config.set('moduleName', this.options.moduleName)
    this.config.set('modelName', this.options.modelName)
    this.config.set('attrs', this.options.attrs)
    this.config.set('actionTypes', this.options.actionTypes)
    this.config.set('needPagination', this.options.needPagination)
  }

  /**
   * 写入 generator 相关的文件(routes, controllers 等)
   */
  writing () {
    this.tplOptions = {
      moduleName: kebabCase(this.options.moduleName),
      modelName: this.options.modelName,
      modelKebabName: kebabCase(this.options.modelName),
      modelPluralCamelName: pluralize(camelCase(this.options.modelName)),
      modelPluralUpperFirstName: upperFirst(pluralize(camelCase(this.options.modelName))),
      modelCurrentName: `current${upperFirst(camelCase(this.options.modelName))}`,
      modelUpperFirstName: upperFirst(camelCase(this.options.modelName)),
      attrs: this.attrs,
      actionTypes: this.actionTypes,
      needPagination: this.options.needPagination
    }

    this._writeTestSpecFiles()
  }

  /**
   * 写入自动化测试脚本文件
   */
  _writeTestSpecFiles () {
    // JSON Schema
    if (this.actionTypes.includeCreate) {
      // 拷贝 create 脚本
      this.fs.copyTpl(
        this.templatePath('specs/create-request.json'),
        this.destinationPath(`${this.options.moduleName}/create-request.json`),
        this.tplOptions
      )
      this.fs.copyTpl(
        this.templatePath('specs/create-response.json'),
        this.destinationPath(`${this.options.moduleName}/create-response.json`),
        this.tplOptions
      )
    }
    if (this.actionTypes.includeRetrieve) {
      // 拷贝 retrieve 相关 JSON Schema
      this.fs.copyTpl(
        this.templatePath('specs/retrieve-request.json'),
        this.destinationPath(`${this.options.moduleName}/retrieve-request.json`),
        this.tplOptions
      )
      this.fs.copyTpl(
        this.templatePath('specs/retrieve-response.json'),
        this.destinationPath(`${this.options.moduleName}/retrieve-response.json`),
        this.tplOptions
      )
    }
    if (this.actionTypes.includeUpdate) {
      // 拷贝 update 相关 JSON Schema
      this.fs.copyTpl(
        this.templatePath('specs/update-request.json'),
        this.destinationPath(`${this.options.moduleName}/update-request.json`),
        this.tplOptions
      )
      this.fs.copyTpl(
        this.templatePath('specs/update-response.json'),
        this.destinationPath(`${this.options.moduleName}/update-response.json`),
        this.tplOptions
      )
    }
    if (this.actionTypes.includeDelete) {
      // 拷贝 delete 相关 JSON Schema
      this.fs.copyTpl(
        this.templatePath('specs/delete-request.json'),
        this.destinationPath(`${this.options.moduleName}/delete-request.json`),
        this.tplOptions
      )
      this.fs.copyTpl(
        this.templatePath('specs/delete-response.json'),
        this.destinationPath(`${this.options.moduleName}/delete-response.json`),
        this.tplOptions
      )
    }
    if (this.actionTypes.includeList) {
      // 拷贝 list 相关 JSON Schema
      this.fs.copyTpl(
        this.templatePath('specs/list-request.json'),
        this.destinationPath(`${this.options.moduleName}/list-request.json`),
        this.tplOptions
      )
      this.fs.copyTpl(
        this.templatePath('specs/list-response.json'),
        this.destinationPath(`${this.options.moduleName}/list-response.json`),
        this.tplOptions
      )
    }
    // 测试脚本
    this.fs.copyTpl(
      this.templatePath('specs/api.spec.js'),
      this.destinationPath(`${this.options.moduleName}/api.spec.js`),
      this.tplOptions
    )
    this.fs.copyTpl(
      this.templatePath('specs/service.js'),
      this.destinationPath(`${this.options.moduleName}/service.js`),
      this.tplOptions
    )
  }

  /**
   * 运行安装工作(比如 npm, bower)
   */
  install () {
    // 只有在生成测试脚本的情况下才安装测试相关的开发依赖包
    // TODO: 把测试脚本的安装做成一个单独的 go, 供各个模块共享使用, 后面就可以使用 composeWith 组合进来
    if (this.options.needTest && !this.options['skip-install-test']) {
      const dependencies = []
      dependencies.push('colors', 'chai-json-schema', 'ava', '@ava/babel-preset-stage-4', 'tap-nyan', 'axios', 'chai', 'moment', 'faker', 'lodash', 'debug', 'form-data')
      commandExists('yarn')
        .then(command => {
          this.yarnInstall(dependencies, {dev: true})
        })
        .catch(() => {
          this.npmInstall(dependencies, {saveDev: true})
        })
    }
  }

  /**
   * 最后调用, 清理工作
   */
  end () {
  }
}

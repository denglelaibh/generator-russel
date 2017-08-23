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

    this.option('moduleTitle', {
      desc: '输入页面标题, 如 客户黑名单管理',
      type: String,
      required: true
    })

    // this.argument('attributes', {
    //   type: Array,
    //   defaults: [],
    //   banner: 'field[:type] field[:type]',
    //   required: true
    // })
    //
    // this.attrs = this.options['attributes'].map(attr => ({
    //   name: camelCase(attr.split(':')[0]), // 属性使用 camelCase, constraintType
    //   kebabAttrName: kebabCase(attr.split(':')[0]), // constraint-type
    //   upperFirstAttrName: upperFirst(camelCase(attr.split(':')[0])), // ConstraintType
    //   chosenAttrName: `chosen${upperFirst(camelCase(attr.split(':')[0]))}`, // chosenConstraintType
    //   availableAttrName: `available${pluralize(upperFirst(camelCase(attr.split(':')[0])))}`, // availableConstraintTypes
    //   type: toLower(attr.split(':')[1]) || 'string', // 数据类型: string, integer, datetime, daterange etc.
    //   label: attr.split(':')[2] || camelCase(attr.split(':')[0])
    // }))
    // console.log('attrs = ', this.attrs)
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
      message: '模块名称:'
    }, {
      type: 'input',
      name: 'modelName',
      message: 'Model 名称:'
    }, {
      type: 'input',
      name: 'moduleTitle',
      message: '页面和面包屑标题:'
    }, {
      type: 'input',
      name: 'attrs',
      message: '输入表格显示字段:'
    }, {
      type: 'input',
      name: 'formFields',
      message: '输入表单查询字段:'
    }, {
      type: 'checkbox',
      name: 'actionTypes',
      message: '选择要支持的模型操作类型:',
      choices: [{
        name: '添加',
        value: 'includeCreate',
        checked: true
      }, {
        name: '详情',
        value: 'includeRetrieve',
        checked: true
      }, {
        name: '编辑',
        value: 'includeUpdate',
        checked: true
      }, {
        name: '删除',
        value: 'includeDelete',
        checked: true
      }]
    }, {
      type: 'confirm',
      name: 'needTest',
      message: '是否生成测试脚本?',
      default: true
    }]

    this.prompt(prompts).then(answers => {
      // 模块名称
      this.options.moduleName = (this.options.moduleName || answers.moduleName)
      // 模块标题
      this.options.moduleTitle = (this.options.moduleTitle || answers.moduleTitle)
      // 模型名称
      this.options.modelName = (this.options.modelName || answers.modelName)
      // 生成测试文件
      this.options.needTest = (this.options.needTest || answers.needTest)
      // 表单字段
      this.options.formFields = (this.options.formFields || answers.formFields).trim().split(/\s/)
      console.log('this.options.formFields = ' + this.options.formFields)
      // TODO: 增加 validate, 可以考虑使用 inquirer.js 提供的 validate 方法
      this.formFields = this.options.formFields.map(attr => ({
        name: camelCase(attr.split(':')[0]), // 属性使用 camelCase, constraintType
        kebabAttrName: kebabCase(attr.split(':')[0]), // constraint-type
        upperFirstAttrName: upperFirst(camelCase(attr.split(':')[0])), // ConstraintType
        chosenAttrName: `chosen${upperFirst(camelCase(attr.split(':')[0]))}`, // chosenConstraintType
        availableAttrName: `available${pluralize(upperFirst(camelCase(attr.split(':')[0])))}`, // availableConstraintTypes
        type: toLower(attr.split(':')[1]) || 'string', // 数据类型: string, integer, datetime, daterange etc.
        label: attr.split(':')[2] || camelCase(attr.split(':')[0])
      }))
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
        includeDelete: this.options.actionTypes.includes('includeDelete')
      }
      console.log('actionTypes = ', this.actionTypes)

      done()
    })
  }

  /**
   * 保存配置项同时配置项目(比如创建 .editorconfig 文件以及其他元数据文件)
   */
  configuring () {
    this.config.set('moduleName', this.options.moduleName)
    this.config.set('moduleTitle', this.options.moduleTitle)
    this.config.set('modelName', this.options.modelName)
    this.config.set('needTest', this.options.needTest)
    this.config.set('formFields', this.options.formFields)
    this.config.set('attrs', this.options.attrs)
    this.config.set('actionTypes', this.options.actionTypes)
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
      moduleTitle: this.options.moduleTitle,
      formFields: this.formFields,
      attrs: this.attrs,
      actionTypes: this.actionTypes
    }

    this._writeComponentFiles()
    if (this.options.needTest) {
      this._writeTestSpecFiles()
    }
  }

  _writeComponentFiles () {
// Copy js file
    //
    this.fs.copyTpl(
      this.templatePath('ko-component/ko-script.js'),
      this.destinationPath(`app/scripts/ko-pages/${kebabCase(this.options.moduleName)}.js`),
      this.tplOptions
    )

    // Copy scss file
    //
    this.fs.copyTpl(
      this.templatePath('ko-component/ko-style.scss'),
      this.destinationPath(`app/scss/${this.options.moduleName}.scss`),
      this.tplOptions
    )

    // Copy html file
    this.fs.copyTpl(
      this.templatePath('ko-component/ko-layout.ejs'),
      this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.html`),
      this.tplOptions
    )
  }

  /**
   * 写入自动化测试脚本文件
   */
  _writeTestSpecFiles () {
    // jsonschema - list
    this.fs.copyTpl(
      this.templatePath('specs/list.json'),
      this.destinationPath(`test/${this.options.moduleName}/list.json`),
      this.tplOptions
    )
    // 测试脚本
    this.fs.copyTpl(
      this.templatePath('specs/api.spec.js'),
      this.destinationPath(`test/${this.options.moduleName}/api.spec.js`),
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
      // 安装 colors, chai-json-schema, ava, @ava/babel-preset-stage-4, tap-nyan, axios, chai, moment, faker, lodash, debug, form-data
      dependencies.push('colors', 'chai-json-schema', 'ava', '@ava/babel-preset-stage-4', 'tap-nyan', 'axios', 'chai', 'moment', 'faker', 'lodash', 'debug', 'form-data')
      commandExists('yarn')
        .then(command => {
          this.yarnInstall(dependencies, {dev: true})
        })
        .catch(() => {
          this.npmInstall(dependencies, {saveDev: true})
        })
      // this.installDependencies({
      //   npm: !hasYarn,
      //   bower: false,
      //   yarn: hasYarn
      // })
    }
  }

  /**
   * 最后调用, 清理工作
   */
  end () {

  }
}

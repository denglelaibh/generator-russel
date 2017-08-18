const Generator = require('yeoman-generator')
const {camelCase, kebabCase, lowerCase, snakeCase, startCase, toLower, upperCase, upperFirst} = require('lodash')
const pluralize = require('pluralize')
const commandExists = require('command-exists')

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

    this.argument('attributes', {
      type: Array,
      defaults: [],
      banner: 'field[:type] field[:type]',
      required: true
    })

    this.attrs = this.options['attributes'].map(attr => ({
      name: camelCase(attr.split(':')[0]), // 属性使用 camelCase, constraintType
      kebabAttrName: kebabCase(attr.split(':')[0]), // constraint-type
      upperFirstAttrName: upperFirst(camelCase(attr.split(':')[0])), // ConstraintType
      chosenAttrName: `chosen${upperFirst(camelCase(attr.split(':')[0]))}`, // chosenConstraintType
      availableAttrName: `available${pluralize(upperFirst(camelCase(attr.split(':')[0])))}`, // availableConstraintTypes
      type: toLower(attr.split(':')[1]) || 'string'
    }))
    console.log('attrs = ', this.attrs)
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
    const done = this.async()
    const prompts = [{
      type: 'input',
      name: 'moduleName',
      message: '模块名称: '
    }, {
      type: 'input',
      name: 'modelName',
      message: 'Model 名称: '
    }, {
      type: 'input',
      name: 'moduleTitle',
      message: '页面和面包屑标题: '
    }, {
      type: 'confirm',
      name: 'needTest',
      message: '是否生成测试脚本?',
      default: true
    }]

    this.prompt(prompts).then(answers => {
      this.options.moduleName = (this.options.moduleName || answers.moduleName)
      this.options.moduleTitle = (this.options.moduleTitle || answers.moduleTitle)
      this.options.modelName = (this.options.modelName || answers.modelName)
      this.options.needTest = (this.options.needTest || answers.needTest)
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
  }

  /**
   * 写入 generator 相关的文件(routes, controllers 等)
   */
  writing () {
    this._writeComponentFiles()
    if (this.options.needTest) {
      this._writeTestSpecFiles()
    }
  }

  _writeComponentFiles () {
// Copy js file
    //
    this.fs.copyTpl(
      this.templatePath('ko-component/ko-page.js'),
      this.destinationPath(`app/scripts/ko-pages/${kebabCase(this.options.moduleName)}.js`),
      {
        moduleName: kebabCase(this.options.moduleName),
        modelName: this.options.modelName,
        modelKebabName: kebabCase(this.options.modelName),
        modelPluralCamelName: pluralize(camelCase(this.options.modelName)),
        modelPluralUpperFirstName: upperFirst(pluralize(camelCase(this.options.modelName))),
        modelCurrentName: `current${upperFirst(camelCase(this.options.modelName))}`,
        modelUpperFirstName: upperFirst(camelCase(this.options.modelName)),
        moduleTitle: this.options.moduleTitle,
        attrs: this.attrs
      }
    )

    // Copy scss file
    //
    this.fs.copyTpl(
      this.templatePath('ko-component/ko-page.scss'),
      this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.scss`),
      {
        moduleName: this.options.moduleName
      })

    // Copy html file
    this.fs.copyTpl(
      this.templatePath('ko-component/ko-page.html'),
      this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.html`),
      {
        moduleName: kebabCase(this.options.moduleName),
        modelName: this.options.modelName,
        modelKebabName: kebabCase(this.options.modelName),
        modelPluralCamelName: pluralize(camelCase(this.options.modelName)),
        modelPluralUpperFirstName: upperFirst(pluralize(camelCase(this.options.modelName))),
        modelCurrentName: `current${upperFirst(camelCase(this.options.modelName))}`,
        modelUpperFirstName: upperFirst(camelCase(this.options.modelName)),
        moduleTitle: this.options.moduleTitle,
        attrs: this.attrs
      }
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
      {
        moduleName: kebabCase(this.options.moduleName),
        modelName: this.options.modelName,
        modelKebabName: kebabCase(this.options.modelName),
        modelPluralCamelName: pluralize(camelCase(this.options.modelName)),
        modelPluralUpperFirstName: upperFirst(pluralize(camelCase(this.options.modelName))),
        modelCurrentName: `current${upperFirst(camelCase(this.options.modelName))}`,
        modelUpperFirstName: upperFirst(camelCase(this.options.modelName)),
        moduleTitle: this.options.moduleTitle,
        attrs: this.attrs
      }
    )
    // 测试脚本
    this.fs.copyTpl(
      this.templatePath('specs/api.spec.js'),
      this.destinationPath(`test/${this.options.moduleName}/api.spec.js`),
      {
        moduleName: kebabCase(this.options.moduleName),
        modelName: this.options.modelName,
        modelKebabName: kebabCase(this.options.modelName),
        modelPluralCamelName: pluralize(camelCase(this.options.modelName)),
        modelPluralUpperFirstName: upperFirst(pluralize(camelCase(this.options.modelName))),
        modelCurrentName: `current${upperFirst(camelCase(this.options.modelName))}`,
        modelUpperFirstName: upperFirst(camelCase(this.options.modelName)),
        moduleTitle: this.options.moduleTitle,
        attrs: this.attrs
      }
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

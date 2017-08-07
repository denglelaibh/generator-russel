const Generator = require('yeoman-generator')

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

    this.attrs = this.options['attributes'].map(attr => ({ name: attr.split(':')[0], type: attr.split(':')[1] || 'string' }))
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
    }]

    this.prompt(prompts).then(answers => {
      this.options.moduleName = (this.options.moduleName || answers.moduleName)
      this.options.moduleTitle = (this.options.moduleTitle || answers.moduleTitle)
      this.options.modelName = (this.options.modelName || answers.modelName)
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
  }

  /**
   * 写入 generator 相关的文件(routes, controllers 等)
   */
  writing () {
    // Copy js file
    //
    this.fs.copyTpl(
      this.templatePath('ko-page.js'),
      this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.js`),
      {
        moduleName: this.options.moduleName,
        modelName: this.options.modelName,
        moduleTitle: this.options.moduleTitle,
        attrs: this.attrs
      }
    )

    // Copy scss file
    //
    this.fs.copyTpl(
      this.templatePath('ko-page.scss'),
      this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.scss`),
      {
        moduleName: this.options.moduleName
      })

    // Copy html file
    this.fs.copyTpl(
      this.templatePath('ko-page.html'),
      this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.html`),
      {
        moduleName: this.options.moduleName,
        modelName: this.options.modelName,
        moduleTitle: this.options.moduleTitle
      })
  }

  /**
   * 运行安装工作(比如 npm, bower)
   */
  install () {
  }

  /**
   * 最后调用, 清理工作
   */
  end () {

  }
}

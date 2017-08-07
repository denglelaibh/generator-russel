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
      banner: 'field[:type] field[:type]'
    })

    this.attrs = this['attributes'].map(attr => ({ name: attr.split(':')[0], type: attr.split(':')[1] || 'string' }))
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
      message: '模块名称'
    }, {
      type: 'input',
      name: 'moduleTitle',
      message: '页面标题'
    }]

    this.prompt(prompts).then(answers => {
      this.options.moduleName = (this.options.moduleName || answers.moduleName)
      this.options.moduleTitle = (this.options.moduleTitle || answers.moduleTitle)
      done()
    })
  }

  configuring () {
    this.config.set('moduleName', this.options.moduleName)
    this.config.set('moduleTitle', this.options.moduleTitle)
  }

  writing () {
    // Copy js file
    this.fs.copy(this.templatePath('ko-page.js'), this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.js`))
    // Copy scss file
    this.fs.copy(this.templatePath('ko-page.scss'), this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.scss`))
    // Copy html file
    this.fs.copyTpl(this.templatePath('ko-page.html'), this.destinationPath(`app/scripts/ko-pages/${this.options.moduleName}.html`), { moduleName: this.options.moduleName, moduleTitle: this.options.moduleTitle })
  }

  install () {
  }
}

const Generator = require('yeoman-generator')
const {camelCase, kebabCase, lowerCase, snakeCase, startCase, toLower, upperCase, upperFirst} = require('lodash')
const pluralize = require('pluralize')
const mkdirp = require('mkdirp')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    this.option('appName', {
      desc: '输入应用名称',
      type: String,
      required: true
    })
    this.option('userName', {
      desc: '你的 github 用户名',
      type: String,
      required: true
    })
    this.option('email', {
      desc: '你的 email 地址',
      type: String,
      required: false
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
    const done = this.async()
    const prompts = [{
      type: 'input',
      name: 'appName',
      message: '输入应用名称:'
    }, {
      type: 'input',
      name: 'userName',
      message: '你的 github 用户名:'
    }, {
      type: 'input',
      name: 'email',
      message: '你的 email 地址:'
    }]

    this.prompt(prompts).then(answers => {
      this.options.appName = (this.options.appName || answers.appName)
      this.options.userName = (this.options.userName || answers.userName)
      this.options.email = (this.options.email || answers.email)
      done()
    })
  }

  /**
   * 保存配置项同时配置项目(比如创建 .editorconfig 文件以及其他元数据文件)
   */
  configuring () {
    this.config.set('appName', this.options.appName)
    this.config.set('userName', this.options.userName)
    this.config.set('email', this.options.email)
  }

  /**
   * 写入 generator 相关的文件(routes, controllers 等)
   */
  writing () {
    // 在目标目录建立新的文件夹
    mkdirp(this.destinationPath('test'))
    mkdirp(this.destinationPath('build'))
    // mkdirp(this.destinationPath('app/images'))
    // mkdirp(this.destinationPath('app/scripts'))
    // mkdirp(this.destinationPath('app/styles'))
    mkdirp(this.destinationPath('app'))

    // 拷贝文件到目标目录
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        appName: kebabCase(this.options.appName),
        userName: this.options.userName,
        email: this.options.email
      }
    )
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        appName: kebabCase(this.options.appName),
        userName: this.options.userName,
        email: this.options.email
      }
    )
    this.fs.copy(
      this.templatePath('.npmrc'),
      this.destinationPath('.npmrc')
    )
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('.eslintrc.js'),
      this.destinationPath('.eslintrc.js')
    )
    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig')
    )
    this.fs.copy(
      this.templatePath('app/index.js'),
      this.destinationPath('app/index.js')
    )
  }

  /**
   * 运行安装工作(比如 npm, bower)
   */
  install () {
    const shouldInstall = !this.options['skip-install']
    if (shouldInstall) {
      this.npmInstall() // 只装 npm 就好了
    }
  }

  /**
   * 最后调用, 清理工作
   */
  end () {

  }
}

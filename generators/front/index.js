const Generator = require('yeoman-generator')
const { camelCase, kebabCase, lowerCase, snakeCase, startCase, toLower, upperCase, upperFirst } = require('lodash');
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
    }]

    this.prompt(prompts).then(answers => {
      this.options.appName = (this.options.appName || answers.appName)
      done()
    })
  }

  /**
   * 保存配置项同时配置项目(比如创建 .editorconfig 文件以及其他元数据文件)
   */
  configuring () {
    this.config.set('appName', this.options.appName)
  }

  /**
   * 写入 generator 相关的文件(routes, controllers 等)
   */
  writing () {
    // 在目标目录建立新的文件夹
    mkdirp(this.destinationPath('test'))
    mkdirp(this.destinationPath('build'))
    mkdirp(this.destinationPath('src/img'))
    mkdirp(this.destinationPath('src/js'))
    mkdirp(this.destinationPath('src/style'))
    mkdirp(this.destinationPath('src/vendor'))

    // 拷贝文件到目标目录
    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath('README.md')
    )
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json')
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
    this.fs.copyTpl(
      this.templatePath('src/index.html'),
      this.destinationPath('src/index.html'),
      {
        appName: camelCase(this.options.appName)
      }
    )
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

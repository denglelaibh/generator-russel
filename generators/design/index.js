const Generator = require('yeoman-generator')
const {camelCase, kebabCase, lowerCase, snakeCase, startCase, toLower, upperCase, upperFirst} = require('lodash')
const pluralize = require('pluralize')
const mkdirp = require('mkdirp')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)
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
  }

  /**
   * 保存配置项同时配置项目(比如创建 .editorconfig 文件以及其他元数据文件)
   */
  configuring () {
  }

  /**
   * 写入 generator 相关的文件(routes, controllers 等)
   */
  writing () {
    // 在目标目录建立新的文件夹
    mkdirp(this.destinationPath('scripts'))
    mkdirp(this.destinationPath('styles'))

    // 拷贝文件到目标目录
    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath('README.md')
    )
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('index.html')
    )
    this.fs.copy(
      this.templatePath('styles/base.css'),
      this.destinationPath('styles/base.css')
    )
    this.fs.copy(
      this.templatePath('styles/main.css'),
      this.destinationPath('styles/main.css')
    )
    this.fs.copy(
      this.templatePath('styles/normalize.css'),
      this.destinationPath('styles/normalize.css')
    )
    this.fs.copy(
      this.templatePath('scripts/helpers.js'),
      this.destinationPath('scripts/helpers.js')
    )
    this.fs.copy(
      this.templatePath('scripts/main.js'),
      this.destinationPath('scripts/main.js')
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

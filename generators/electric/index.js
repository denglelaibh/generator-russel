const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting () {
    console.log('prompting - zap')
  }
  writing () {
    console.log('writing - zap')
  }
}

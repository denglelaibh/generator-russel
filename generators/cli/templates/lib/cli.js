/**
 * @fileoverview Main CLI object.
 * @author fanshenggang
 */

const resolve = require('path').resolve
const options = require('./options')
const CLIEngine = require('../index')
const log = require('./logging')

const cli = {

  /**
   * Executes the CLI based on an array of arguments that is passed in.
   * @param {string|Array|Object} args The arguments to process.
   * @returns {int} The exit code for the operation.
   */
  execute (args) {
    let currentOptions

    try {
      currentOptions = options.parse(args)
    } catch (error) {
      log.error(error.message)
      return 1
    }

    if (currentOptions.version) {
      log.info(`v${require('../package.json').version}`)
    } else if (currentOptions.help) {
      log.info(options.generateHelp())
    } else {
      CLIEngine.reverse(resolve(currentOptions.file || 'package.json'), {
        latest: currentOptions.latest || false,
        productionOnly: currentOptions.productionOnly || false,
        devOnly: currentOptions.devOnly || false
      })
      return 1
    }
    return 0
  }
}

module.exports = cli

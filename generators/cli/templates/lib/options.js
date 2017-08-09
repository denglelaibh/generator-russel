/**
 * @fileoverview Options configuration for optionator.
 * @author fanshenggang
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const optionator = require('optionator')

//------------------------------------------------------------------------------
// Initialization and Public Interface
//------------------------------------------------------------------------------

// exports "parse(args)", "generateHelp()", and "generateHelpForOption(optionName)"
module.exports = optionator({
  prepend: '<%=appName%> [options]',
  defaults: {
    file: 'package.json'
  },
  options: [
    {
      heading: 'Basic configuration'
    },
    {
      option: 'file',
      alias: 'f',
      type: 'String',
      default: 'package.json',
      description: 'package.json file to be reversed'
    },
    {
      option: 'latest',
      alias: 'l',
      type: 'Boolean',
      default: 'false',
      description: 'Install latest version of the npm package'
    },
    {
      option: 'productionOnly',
      alias: 'p',
      type: 'Boolean',
      default: 'false',
      description: 'Only generate packages under dependencies'
    },
    {
      option: 'devOnly',
      alias: 'd',
      type: 'Boolean',
      default: 'false',
      description: 'Generate install command form packages under devDenpendencies only'
    },
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Show help'
    },
    {
      option: 'version',
      alias: 'v',
      type: 'Boolean',
      description: 'Output the version number'
    }
  ]
})

const inspect = require('util').inspect
const semver = require('semver')
const debug = require('debug')('<%=appName%>')

/**
 * package.json reversing
 * @param packageJson full path of package.json file
 * @param options
 * @returns {string}
 */
const reverse = function (packageJson, options) {
  const config = require(packageJson)
  if (!options) {
    options = {}
  }
  const scripts = []
  const getPackages = dependencies => {
    const packages = []
    debug(inspect(dependencies, false, null))
    for (const item of Object.keys(dependencies)) {
      const packageWithVersion = options.latest ? `${item}` : `${item}@"${semver.Range(dependencies[item]).range}"`
      packages.push(packageWithVersion)
    }
    return packages
  }

  if (options.productionOnly) {
    if (config.dependencies) {
      scripts.push(`npm i -S ${getPackages(config.dependencies).join(' ')}`)
    }
  } else if (options.devOnly) {
    if (config.devDependencies) {
      scripts.push(`npm i -D ${getPackages(config.devDependencies).join(' ')}`)
    }
  } else {
    if (config.dependencies) {
      scripts.push(`npm i -S ${getPackages(config.dependencies).join(' ')}`)
    }
    if (config.devDependencies) {
      scripts.push(`npm i -D ${getPackages(config.devDependencies).join(' ')}`)
    }
  }

  console.log(scripts.join('\r\n'))
  return scripts
}

module.exports = {reverse}

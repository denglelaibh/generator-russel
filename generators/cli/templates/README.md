# frege
Reverse a package.json file to `npm install` script.

[![NPM](https://nodei.co/npm/frege.png)](https://nodei.co/npm/frege/)

[![Build Status](https://travis-ci.org/princetoad/Frege.svg?branch=master&style=flat)](https://travis-ci.org/princetoad/Frege)
[![Build status](https://ci.appveyor.com/api/projects/status/22mjbk59kvd55m9y/branch/master)](https://ci.appveyor.com/project/princetoad/frege/branch/master)
[![npm version](https://badge.fury.io/js/frege.svg)](http://badge.fury.io/js/frege)
[![Dependency Status](https://david-dm.org/princetoad/frege.svg?theme=shields.io)](https://david-dm.org/princetoad/frege)
[![devDependency Status](https://david-dm.org/princetoad/frege/dev-status.svg?theme=shields.io)](https://david-dm.org/princetoad/frege#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/princetoad/Frege/badge.svg?branch=master)](https://coveralls.io/github/princetoad/Frege?branch=master)
[![Inline docs](http://inch-ci.org/github/princetoad/frege.svg?branch=master)](http://inch-ci.org/github/princetoad/frege)

## Install
```npm
npm install frege -g
```

## Usage
### Parameter instruction
```text
frege [options]

Basic configuration:
  -f, --file String     package.json file to be reversed - default: package.json
  -l, --latest          Install latest version of the npm package - default: false
  -p, --productionOnly  Only generate packages under dependencies - default: false
  -d, --devOnly         Generate install command form packages under devDenpendencies only - default: false
  -h, --help            Show help
  -v, --version         Output the version number
```

## Examples
### frege
```text
frege
```
Run `frege` without any parameter will try to parse `package.json` file in the current directory. Output contains both dependencies and devDependencis(if have), like:
```text
npm i -S debug@">=2.6.8 <3.0.0" optionator@">=0.8.2 <0.9.0" semver@">=5.3.0 <6.0.0"
npm i -D ava@">=0.19.1 <0.20.0" chai@">=4.0.1 <5.0.0" eslint@">=3.19.0 <4.0.0" tap-nyan@">=1.1.0 <2.0.0"
```

### frege -p
is the shorthand of
```text
frege --productionOnly
```
Only generate installation scripts for `dependencis`.
```text
npm i -S debug@">=2.6.8 <3.0.0" optionator@">=0.8.2 <0.9.0" semver@">=5.3.0 <6.0.0"
```

### frege -d
is the shorthand of
```text
frege --devOnly
```
Only generate installation scripts for `devDependencis`.
```text
npm i -D ava@">=0.19.1 <0.20.0" chai@">=4.0.1 <5.0.0" eslint@">=3.19.0 <4.0.0" tap-nyan@">=1.1.0 <2.0.0"
```

### frege -l
is the shorthand of
```text
frege --latest
```
Inspite of version specified in packages.json, will generate scripts to install the latest version of each package.
```text
npm i -S debug optionator semver
npm i -D ava chai eslint tap-nyan
```

### frege -f ../augustine/package.json
Specify the full path of package.json


Enjoy it!

or feedback!

by fanshenggang <tom@tfan.org>

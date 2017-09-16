const chalk = require('chalk');
const {sample} = require('lodash');

/**
 * 以不同的颜色显示不同组的日志信息(使用 chalk, https://www.npmjs.com/package/chalk)
 * @returns {*}
 */
const randomColor = () => {
  const colorRange = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'redBright',
    'greenBright',
    'yellowBright',
    'blueBright',
    'magentaBright',
    'cyanBright',
    'whiteBright',
    'bgBlack',
    'bgRed',
    'bgGreen',
    'bgYellow',
    'bgBlue',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'bgBlackBright',
    'bgRedBright',
    'bgGreenBright',
    'bgYellowBright',
    'bgBlueBright',
    'bgMagentaBright',
    'bgCyanBright',
    'bgWhiteBright'
  ];
  return chalk.keyword(sample(colorRange));
};

/**
 * 显示接口应答的概要信息
 * @param response
 */
const distillInfo = response => {
  // const selectedColor = randomColor();
  console.info(`status=${response.status}|statusText=${response.statusText}|method=${response.config.method}|url=${response.config.url}`);
  // console.info(selectedColor(`status=${response.status}|statusText=${response.statusText}|method=${response.config.method}|url=${response.config.url}`));
  // debug(inspect(response.data, false, null));
};

module.exports = {
  randomColor,
  distillInfo
};

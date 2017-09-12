const moment = require('moment');

const dateTimeLong = 'YYYY-MM-DD HH:mm:ss';
const dateTimeShort = 'YYYY-MM-DD';
const getDateTimeLong = (datetime = (new Date()).getTime()) => (moment().format('YYYY-MM-DD hh:mm:ss')); // 日期时间
const getDateTimeShort = (datetime = (new Date()).getTime()) => (moment().format('YYYY-MM-DD'));  // 日期

module.exports = {
  dateTimeLong,
  dateTimeShort,
  getDateTimeLong,
  getDateTimeShort
};

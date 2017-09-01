const axios = require('axios');

const { baseURL, timeout } = require('./global-config');

// const baseURL = 'http://172.25.50.51:8090/manage/';
const axiosConfig = {
  baseURL,
  timeout,
};
const request = axios.create(axiosConfig);

module.exports = request;

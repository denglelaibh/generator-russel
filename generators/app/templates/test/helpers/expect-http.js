const {expect} = require('chai');

/**
 * 校验HTTP 层面是否 OK(status === 200, statusText === 'OK')
 * @param response
 */
const expectOK = response => {
  expect(response.status).to.equal(200);
  expect(response.statusText).to.equal('OK');
};

/**
 * 校验应用协议正确返回了 resultCode 和 resultMsg 字段(resultData 不一定返回, 比如 update 操作)
 * @param response
 */
const expectStatusAndMessage = (response) => {
  expect(response.data).to.have.property('resultCode');
  expect(response.data).to.have.property('resultMsg');
};

/**
 * 校验应用协议层面返回了正确的应答
 * @param response
 */
const expectStatusOK = (response) => {
  const resultCode = response.data.resultCode;
  if (resultCode !== '00000') {
    console.log('resultMsg = ', response.data.resultMsg);
  }
  expect(resultCode).to.equal('00000');
};

/**
 * 校验应用协议层面应该返回错误的应答
 * @param response
 */
const expectStatusNotOK = (response) => {
  expect(response.data.resultCode).to.not.equal('00000');
};

module.exports = {
  expectOK,
  expectStatusAndMessage,
  expectStatusOK,
  expectStatusNotOK
}

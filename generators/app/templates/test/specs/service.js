const {expect} = require('chai'); // BDD 断言库
const chai = require('chai');
chai.use(require('chai-json-schema')); // json schema 的 chai.js 插件

// 测试辅助库和方法
//
const {cloneDeep} = require('lodash'); // 深度克隆测试请求数据
const moment = require('moment'); // 日期时间操作辅助库
const faker = require('faker/locale/zh_CN'); // fake 数据

const request = require('../helpers/request'); // 使用 axios 发起 RESTful 请求
const {expectOK, expectStatusAndMessage, expectStatusOK, expectStatusNotOK} = require('../helpers/expect-http'); // 封装的 http 层面的断言方法
const {distillInfo, randomColor} = require('../helpers/distill'); // 通用信息控制台打印方法
const {accountNo, userName, password, newPassword, setting} = require('../helpers/global-config'); // 在全局配置里面配置的测试数据
const {login} = require('../helpers/login'); // 登录接口
const {dateTimeLong, dateTimeShort} = require('../helpers/datetime'); // 日期时间格式配置

// institution JSON Schema
const CreateRequestSchema = require('./create-request.json');
const CreateResponseSchema = require('./create-response.json');
const RetrieveRequestSchema = require('./retrieve-request.json');
const RetrieveResponseSchema = require('./retrieve-response.json');
const UpdateRequestSchema = require('./update-request.json');
const UpdateResponseSchema = require('./update-response.json');
const DeleteRequestSchema = require('./delete-request.json');
const DeleteResponseSchema = require('./delete-response.json');
const ListRequestSchema = require('./list-request.json');
const ListResponseSchema = require('./list-response.json');

//
// <%=modelUpperFirstName%>
//
/**
 * 查询<%=modelUpperFirstName%>列表
 */
const get<%=modelPluralUpperFirstName%> = async () => {
  try {
    // 没有请求数据, 就不需要校验. 如果支持分页的话, 起码需要校验分页字段, 如果还有查询条件的话, 同时写到 request 的 schema 里面
    const response = await request.post('/<%=moduleName%>/query<%=modelPluralUpperFirstName%>');
    distillInfo(response);
    expect(response.data).to.be.jsonSchema(ListResponseSchema);
    expectStatusOK(response);

    return Promise.resolve(response);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
};

/**
 * 查询<%=modelUpperFirstName%>详情
 */
const get<%=modelUpperFirstName%> = async (id) => {
  try {
    const data = {id};
    expect(data).to.be.jsonSchema(RetrieveRequestSchema);
    const response = await request.post('/<%=moduleName%>/query<%=modelUpperFirstName%>', data);
    distillInfo(response);
    expect(response.data).to.be.jsonSchema(RetrieveResponseSchema);
    expectStatusOK(response);

    return Promise.resolve(response);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
};

/**
 * 构造<%=modelUpperFirstName%>实例
 */
const make<%=modelUpperFirstName%> = ({id, parentId, insCode, insName}) => {
  const data = {
    insCode: insCode || `${faker.lorem.words(2)} ${faker.random.number(1000)}`,
    insName: insName || `ins-${faker.commerce.department()}-${faker.commerce.department()}`,
    isTrading: faker.random.arrayElement([0, 1]),
    parentId,
    contacts: `${faker.name.firstName()}${faker.name.lastName()}`,
    telephone: faker.phone.phoneNumber('139########'),
    zipCode: faker.address.zipCode(),
    fax: faker.phone.phoneNumber('010-########'),
    address: `${faker.address.state()}${faker.address.city()}${faker.address.streetAddress()}`
  };
  if (id || id === 0) {
    data.id = id;
  }
  return data;
};

/**
 * 保存<%=modelUpperFirstName%>实例
 * 发送请求前校验请求数据,收到应答后校验应答数据.
 * @param entity
 * @returns {Promise.<*>}
 */
const post<%=modelUpperFirstName%> = async (entity) => {
  try {
    expect(entity).to.be.jsonSchema(CreateRequestSchema);
    const response = await request.post('/<%=moduleName%>/save<%=modelUpperFirstName%>', entity);
    distillInfo(response);
    expect(response.data).to.be.jsonSchema(CreateResponseSchema);
    expectStatusOK(response);

    return Promise.resolve(response);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * 更新<%=modelUpperFirstName%>实例
 * @param entity
 * @returns {Promise.<*>}
 */
const put<%=modelUpperFirstName%> = async (entity) => {
  try {
    expect(entity).to.be.jsonSchema(UpdateRequestSchema);
    const response = await request.post('/<%=moduleName%>/modify<%=modelUpperFirstName%>', entity);
    distillInfo(response);
    expect(response.data).to.be.jsonSchema(UpdateResponseSchema);
    expectStatusOK(response);

    return Promise.resolve(response);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

/**
 * 删除<%=modelUpperFirstName%>实例
 * @param id
 * @returns {Promise.<*>}
 */
const delete<%=modelUpperFirstName%> = async (id) => {
  try {
    const data = {id};
    expect(data).to.be.jsonSchema(DeleteRequestSchema);
    const response = await request.post('/<%=moduleName%>/delete<%=modelUpperFirstName%>', data);
    distillInfo(response);
    expect(response.data).to.be.jsonSchema(DeleteResponseSchema);
    expectStatusOK(response);

    return Promise.resolve(response);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports = {
  get<%=modelPluralUpperFirstName%>,
  get<%=modelUpperFirstName%>,
  make<%=modelUpperFirstName%>,
  post<%=modelUpperFirstName%>,
  put<%=modelUpperFirstName%>,
  delete<%=modelUpperFirstName%>
};

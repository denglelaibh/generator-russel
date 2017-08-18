/**
 * npm install --save-dev ava axios chai faker lodash colors chai-json-schema @ava/babel-preset-stage-4 nyc
 */
const fs = require('fs')
import { inspect } from 'util'

const http = require('http')
const crypto = require('crypto')
import test from 'ava'
import axios from 'axios'
import { expect } from 'chai'
import chai from 'chai'
import moment from 'moment'
import faker from 'faker/locale/zh_CN'
import {
  concat,
  cloneDeep,
  difference,
  differenceWith,
  filter,
  find,
  forEach,
  intersection,
  get,
  head,
  pick,
  remove,
  sample,
  shuffle,
  upperCase
} from 'lodash'

const colors = require('colors/safe')
const debug = require('debug')('api_test')
const FormData = require('form-data')

chai.use(require('chai-json-schema'))

//
// schema
//
// <%=modelUpperFirstName%>
const List<%=modelPluralUpperFirstName%>Schema = require('./list.json')
const Create<%=modelUpperFirstName%>Schema = require('./create.json')
const Remove<%=modelUpperFirstName%>Schema = require('./remove.json')
const Update<%=modelUpperFirstName%>Schema = require('./update.json')
const Delete<%=modelUpperFirstName%>Schema = require('./delete.json')
const Detail<%=modelUpperFirstName%>Schema = require('./detail.json')

// request 默认值
const baseURL = 'http://x.x.x.x:8090/manage/'

const axiosConfig = {
  baseURL,
  timeout: 5000,
}
const request = axios.create(axiosConfig)

//
// 测试脚本配置信息
//
const setting = {
  clearAuto: false // 自动删除添加的测试数据
}

//-------------------------------------helper methods------------------------------------//
const dateTimeLong = 'YYYY-MM-DD HH:mm:ss'
const dateTimeShort = 'YYYY-MM-DD'
const getDateTimeLong = (datetime = (new Date()).getTime()) => (moment().format('YYYY-MM-DD hh:mm:ss')) // 日期时间
const getDateTimeShort = (datetime = (new Date()).getTime()) => (moment().format('YYYY-MM-DD'))  // 日期

/**
 * 以不同的颜色显示不同组的日志信息
 * @returns {*}
 */
const randomColor = () => {
  const colorRange = [
    colors.black,
    colors.red,
    colors.green,
    colors.yellow,
    colors.blue,
    colors.magenta,
    colors.cyan,
    colors.white,
    colors.gray,
    colors.grey,
    colors.bgBlack,
    colors.bgRed,
    colors.bgGreen,
    colors.bgYellow,
    colors.bgBlue,
    colors.bgMagenta,
    colors.bgCyan,
    colors.bgWhite
  ]
  return sample(colorRange)
}

/**
 * 显示接口应答的概要信息
 * @param response
 */
const distillInfo = response => {
  const selectedColor = randomColor()
  console.info(selectedColor(`status=${response.status}|statusText=${response.statusText}|method=${response.config.method}|url=${response.config.url}`))
  // debug(inspect(response.data, false, null));
}

/**
 * 校验HTTP 层面是否 OK
 * @param response
 */
const expectOK = response => {
  expect(response.status).to.equal(200)
  expect(response.statusText).to.equal('OK')
}

/**
 * 校验应用协议正确返回了 status 和 message 字段
 * @param response
 */
const expectStatusAndMessage = (response) => {
  expect(response.data).to.have.property('resultCode')
  expect(response.data).to.have.property('resultMsg')
}

const expectStatusOK = (response) => {
  const resultCode = response.data.resultCode
  if (resultCode !== '00000') {
    console.log('resultMsg = ', response.data.resultMsg)
  }
  expect(resultCode).to.equal('00000')
}

const expectStatusNotOK = (response) => {
  expect(response.data.resultCode).to.not.equal('00000')
}

//-------------------------------------帮助方法-----------------------------------------------//
//-------------------------------------登录------------------------------------------------//

const encode = () => {
  const cipher = crypto.createCipheriv('aes-128-ecb', 'ABCKSLDKSISKDJSH', '')
  let encrypted = cipher.update('1490111628126ABCD', 'utf8', 'base64')
  encrypted += cipher.final('base64')
  console.log(encrypted)
}

const decode = encrypted => {
  const decipher = crypto.createDecipheriv('aes-128-ecb', 'ABCKSLDKSISKDJSH', '')

  let decrypted = decipher.update(encrypted, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  console.log(decrypted)
  return decrypted
}

// 获取验证码
const getVerifyCode = async () => {
  const response = await request.post('auth/getVerifyCode')
  const {token, image} = response.data && response.data.resultData
  const verificationCode = decode(token).slice(13, 17)
  console.log(`verificationCode = ${verificationCode}`)
  return {verificationCode, verificationCodeHash: token}
}

// 登录信息
const userName = '8888'
const password = '111111q'
const oldPassword = '111111q'
const newPassword = 'A1a#$Bc#d'

// getVerifyCode 拿到 token 和 image； image 用来显示图片，token 用于 login 时的 validateCodeHash；image 中的文本信息用于 validateCode 字段
// login 返回值中的 JSESSIONID 用作 cookie 验证
const login = async ({userName, password}) => {
  const {verificationCode, verificationCodeHash} = await getVerifyCode()
  console.log('verficationCode = ', verificationCode, ', verificationCodeHash = ', verificationCodeHash)
  const data = {
    userName,
    password,
    verificationCode, // 验证码
    // validateCode: 'AYNS', // 验证码
    verificationCodeHash  // 验证码的 hash/token
    // validateCodeHash: '5122EE25895E99B0EB23ED870E5A8A6FC8649DBBBE40C47EEA25316CAB805D93'  // 验证码的 hash/token
  }
  const response = await request.post('auth/login', data)
  distillInfo(response)
  // expectOK(response);
  // expect(response.data).to.be.jsonSchema(LoginSchema);
  console.log('resultData = ', response.data.resultData)
  return response.data.resultCode
}

test.before('登录', async t => {
  try {
    const resultCode = await login({userName, password})
    if (resultCode !== '00000') {
      await login({userName, password: newPassword})
    }

    t.pass()
  } catch (err) {
    console.error(err)
    t.fail(err)
  }
})

//
// <%=modelUpperFirstName%>
//
/**
 * 查询<%=modelUpperFirstName%>列表
 */
const query<%=modelPluralUpperFirstName%> = async () => {
  try {
    const response = await request.post('/<%=moduleName%>/query<%=modelPluralUpperFirstName%>')
    distillInfo(response)

    return Promise.resolve(response)
  } catch (err) {
    console.error(err)
    return Promise.reject(err)
  }
}

/**
 * 查询<%=modelUpperFirstName%>详细信息
 */
const query<%=modelUpperFirstName%>ById = async (id) => {
  try {
    const response = await request.post('/<%=moduleName%>/query<%=modelUpperFirstName%>Info', {<%=modelName%>Id: id})
    distillInfo(response)

    return Promise.resolve(response)
  } catch (err) {
    console.error(err)
    return Promise.reject(err)
  }
}

/**
 * 添加<%=modelUpperFirstName%>
 */
const create<%=modelUpperFirstName%> = ({id...}) => {
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
  }
  if (id || id === 0) {
    data.id = id
  }
  return data
}

const insert<%=modelUpperFirstName%> = async (entity) => {
  try {
    const response = await request.post('/<%=moduleName%>/save<%=modelUpperFirstName%>', entity)
    distillInfo(response)

    return Promise.resolve(response)
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

/**
 * 修改<%=modelUpperFirstName%>
 * @param ins
 * @returns {Promise.<*>}
 */
const modify<%=modelUpperFirstName%> = async (entity) => {
  try {
    const response = await request.post('/<%=moduleName%>/modify<%=modelUpperFirstName%>', entity)
    distillInfo(response)

    return Promise.resolve(response)
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

/**
 * 删除<%=modelUpperFirstName%>
 * @param id
 * @returns {Promise.<*>}
 */
const delete<%=modelUpperFirstName%> = async (id) => {
  try {
    const response = await request.post('/<%=moduleName%>/delete<%=modelUpperFirstName%>', {<%=modelUpperFirstName%>Id: id})
    distillInfo(response)

    return Promise.resolve(response)
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
// 测试用例
//
//-------------------------------------<%=modelUpperFirstName%>-----------------------------------------------//
test('查询全部<%=modelUpperFirstName%>信息', async t => {
  try {
    const response = await query<%=modelPluralUpperFirstName%>()

    expect(response.data).to.be.jsonSchema(List<%=modelUpperFirstName%>Schema)
    expectStatusOK(response)

    const <%=modelPluralCamelName%> = response.data.resultData
    expect(<%=modelPluralCamelName%>).to.be.not.empty

    t.pass()
  } catch (err) {
    console.error(err)
    t.fail(err)
  }
})

test('查询<%=moduleName%>详细信息', async t => {
  try {
    let response = await query<%=modelPluralUpperFirstName%>()

    const <%=modelPluralCamelName%> = response.data.resultData
    if (<%=modelPluralCamelName%> && <%=modelPluralCamelName%>.length) {
      const entityId = faker.random.arrayElement(<%=modelPluralCamelName%>.map(item => item.id))
      response = await query<%=modelUpperFirstName%>ById(entityId)

      expect(response.data).to.be.jsonSchema(Detail<%=modelUpperFirstName%>Schema)
      expectStatusOK(response)
    }

    t.pass()
  } catch (err) {
    console.error(err)
    t.fail(err)
  }
})

/**
 * 添加<%=modelUpperFirstName%>
 */
test('添加<%=modelUpperFirstName%>信息', async t => {
  try {
    const <%=modelName%> = create<%=modelUpperFirstName%>()

    response = await insert<%=modelUpperFirstName%>(<%=modelName%>)
    expect(response.data).to.be.jsonSchema(Create<%=modelUpperFirstName%>Schema)
    expectStatusOK(response)

    const id = response.data.resultData
    response = await query<%=modelUpperFirstName%>ById(id)
    expectStatusOK(response)
    expect(response.data).to.be.jsonSchema(Detail<%=modelUpperFirstName%>Schema)

    expect(response.data.resultData).to.deep.equal(<%=modelName%>)

    // 插完记得删除
    if (setting.clearAuto) {
      response = await delete<%=modelUpperFirstName%>(id)
      expect(response.data).to.be.jsonSchema(Delete<%=modelUpperFirstName%>Schema)
      expectStatusOK(response)
    }

    t.pass()
  } catch (err) {
    console.error(err)
    t.fail(err)
  }
})

test('修改<%=moduleName%>信息', async t => {
  try {
    let response = await query<%=modelPluralUpperFirstName%>()
    expect(response.data).to.be.jsonSchema(List<%=modelPluralUpperFirstName%>Schema)
    expectStatusOK(response)

    const <%=modelPluralCamelName%> = response.data.resultData
    let iCount = 0
    while (iCount < <%=modelPluralCamelName%>.length) {
      const <%=modelName%> = <%=modelPluralCamelName%>[iCount]

      const entity = create<%=modelUpperFirstName%>({
      })

      response = await modify<%=modelUpperFirstName%>(entity)
      expect(response.data).to.be.jsonSchema(Update<%=modelUpperFirstName%>Schema)
      expectStatusOK(response)

      response = await query<%=modelUpperFirstName%>ById(<%=modelName%>.id)
      expectStatusOK(response)
      expect(response.data).to.be.jsonSchema(Detail<%=modelUpperFirstName%>Schema)

      expect(response.data.resultData).to.deep.equal(entity)

      iCount += 1
    }

    t.pass()
  } catch (err) {
    console.error(err)
    t.fail(err)
  }
})

test.skip('删除<%=modelUpperFirstName%>信息', async t => {
  try {
    let response = await query<%=modelPluralUpperFirstName%>()
    expect(response.data).to.be.jsonSchema(List<%=modelPluralUpperFirstName%>Schema)
    expectStatusOK(response)
    const <%=modelPluralCamelName%> = response.data.resultData
    if (<%=modelPluralCamelName%>.length === 0) {
      return Promise.reject(new Error('没有<%=modelUpperFirstName%>!'))
    }

    const <%=modelName%> = faker.random.arrayElement(<%=modelPluralCamelName%>)

    await remove<%=modelUpperFirstName%>(<%=modelName%>)

    response = await query<%=modelPluralUpperFirstName%>()
    expectStatusOK(response)
    expect(response.data).to.be.jsonSchema(List<%=modelPluralUpperFirstName%>Schema)

    const <%=modelName%>Ids = response.data.resultData.map(item => item.id)
    expect(<%=modelName%>.id).to.not.be.oneOf(<%=modelName%>Ids)

    t.pass()
  } catch (err) {
    console.error(err)
    t.fail(err)
  }
})

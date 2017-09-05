// 测试框架
//
const { test } = require('ava'); // 测试用例对象
const { expect } = require('chai'); // BDD 断言库

// 测试辅助
//
const faker = require('faker/locale/zh_CN'); // fake 数据
const { login } = require('../helpers/login'); // 登录接口

// 读取配置
//
const { accountNo, userName, password, newPassword, setting } = require('../helpers/global-config'); // 在全局配置里面配置的测试数据

// 引入 service 方法
//
const {
  get<%=modelPluralUpperFirstName%>,
<% if (actionTypes.includeRetrieve) { %>
  get<%=modelUpperFirstName%>,
<% } %>
<% if (actionTypes.includeCreate) { %>
  make<%=modelUpperFirstName%>,
  post<%=modelUpperFirstName%>,
<% } %>
<% if (actionTypes.includeUpdate) { %>
  put<%=modelUpperFirstName%>,
<% } %>
<% if (actionTypes.includeDelete) { %>
  delete<%=modelUpperFirstName%>
<% } %>
} = require('./service');

// 需要用到的其他模块的方法
//
// const { thawTellers, cancelTellers, queryInsTellersByPage } = require('../teller-admin/service.js');

/**
 * 接口测试之前需要先登录
 */
test.before('登录', async t => {
  try {
    const resultCode = await login({ userName, password });
    if (resultCode !== '00000') {
      await login({ userName, password: newPassword });
    }

    t.pass();
  } catch (err) {
    t.fail(err);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////
// 测试用例
//
//-------------------------------------<%=modelUpperFirstName%>-----------------------------------------------//
test('查询全部<%=modelUpperFirstName%>信息', async t => {
  try {
    const response = await get<%=modelPluralUpperFirstName%>();
    const <%=modelPluralCamelName%> = response.data.resultData;
    expect(<%=modelPluralCamelName%>).to.be.not.empty;

    t.pass();
  } catch (err) {
    t.fail(err);
  }
});

<% if (actionTypes.includeRetrieve) { %>
test('查询<%=modelUpperFirstName%>详细信息', async t => {
  try {
    let response = await get<%=modelPluralUpperFirstName%>();
    const <%=modelPluralCamelName%> = response.data.resultData;
    if (<%=modelPluralCamelName%> && <%=modelPluralCamelName%>.length) {
      const entityId = faker.random.arrayElement(<%=modelPluralCamelName%>.map(item => item.id));
      response = await get<%=modelUpperFirstName%>(entityId);
    }

    t.pass();
  } catch (err) {
    t.fail(err);
  }
});
<% } %>
<% if (actionTypes.includeCreate) { %>
/**
 * 添加<%=modelUpperFirstName%>
 */
test('添加<%=modelUpperFirstName%>信息', async t => {
  try {
    const <%=modelName%> = make<%=modelUpperFirstName%>();
    response = await post<%=modelUpperFirstName%>(<%=modelName%>);
    const id = response.data.resultData;
    response = await get<%=modelUpperFirstName%>(id);
    expect(response.data.resultData).to.deep.equal(<%=modelName%>);

    // 插完记得删除
    if (setting.clearAuto) {
      response = await delete<%=modelUpperFirstName%>(id);
    }

    t.pass();
  } catch (err) {
    t.fail(err);
  }
});
<% } %>
<% if (actionTypes.includeUpdate) { %>
test('修改<%=modelUpperFirstName%>信息', async t => {
  try {
    let response = await get<%=modelPluralUpperFirstName%>();
    const <%=modelPluralCamelName%> = response.data.resultData;
    let iCount = 0;
    while (iCount < <%=modelPluralCamelName%>.length) {
      const <%=modelName%> = <%=modelPluralCamelName%>[iCount];
      const entity = make<%=modelUpperFirstName%>({
      });
      response = await put<%=modelUpperFirstName%>(entity);
      response = await get<%=modelUpperFirstName%>(<%=modelName%>.id);

      expect(response.data.resultData).to.deep.equal(entity);

      iCount += 1
    }

    t.pass();
  } catch (err) {
    t.fail(err);
  }
});
<% } %>
<% if (actionTypes.includeDelete) { %>
test('删除<%=modelUpperFirstName%>信息', async t => {
  try {
    let response = await get<%=modelPluralUpperFirstName%>();
    const <%=modelPluralCamelName%> = response.data.resultData;
    if (<%=modelPluralCamelName%>.length === 0) {
      return Promise.reject(new Error('没有<%=modelUpperFirstName%>!'));
    }

    const <%=modelName%> = faker.random.arrayElement(<%=modelPluralCamelName%>);
    await delete<%=modelUpperFirstName%>(<%=modelName%>);
    response = await get<%=modelPluralUpperFirstName%>();
    const <%=modelName%>Ids = response.data.resultData.map(item => item.id);
    expect(<%=modelName%>.id).to.not.be.oneOf(<%=modelName%>Ids);

    t.pass();
  } catch (err) {
    t.fail(err);
  }
});
<% } %>

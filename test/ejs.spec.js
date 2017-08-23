// 用 ejs 测试确保所有的模板( html,js) 都是可以编译过的
const {test} = require('ava')
const template = require('ejs')
const fs = require('fs')
const {resolve} = require('path')
const {camelCase, kebabCase, upperFirst, toLower} = require('lodash')
const pluralize = require('pluralize')
const {expect} = require('chai')

test('ko-script.js', t => {
  try {
    const script = fs.readFileSync(resolve(__dirname, '../generators/app/templates/ko-component/ko-script.js'), {encoding: 'utf8'})
    const options = {
      moduleName: 'user-image',
      modelName: 'userImg',
      moduleTitle: '查询影像平台',
      formFields: 'mobile:string:手机号 idNo:string:身份证号 uploadDateTimeRange:datetimerange:上传时间范围'.trim().split(/\s/),
      attrs: 'imgNo:string:图像编号 custName:string:客户姓名 idNo:string:身份证号 mobile:string:手机号 uploadTime:string:上传时间'.trim().split(/\s/),
      actionTypes: ['includeCreate', 'includeRetrieve', 'includeUpdate', 'includeDelete']
    }
    const attrMapping = attr => ({
      name: camelCase(attr.split(':')[0]), // 属性使用 camelCase, constraintType
      kebabAttrName: kebabCase(attr.split(':')[0]), // constraint-type
      upperFirstAttrName: upperFirst(camelCase(attr.split(':')[0])), // ConstraintType
      chosenAttrName: `chosen${upperFirst(camelCase(attr.split(':')[0]))}`, // chosenConstraintType
      availableAttrName: `available${pluralize(upperFirst(camelCase(attr.split(':')[0])))}`, // availableConstraintTypes
      type: toLower(attr.split(':')[1]) || 'string', // 数据类型: string, integer, datetime, daterange etc.
      label: attr.split(':')[2] || camelCase(attr.split(':')[0])
    })
    const formFields = options.formFields.map(attrMapping)
    const attrs = options.attrs.map(attrMapping)
    const model = {
      moduleName: kebabCase(options.moduleName),
      modelName: options.modelName,
      modelKebabName: kebabCase(options.modelName),
      modelPluralCamelName: pluralize(camelCase(options.modelName)),
      modelPluralUpperFirstName: upperFirst(pluralize(camelCase(options.modelName))),
      modelCurrentName: `current${upperFirst(camelCase(options.modelName))}`,
      modelUpperFirstName: upperFirst(camelCase(options.modelName)),
      moduleTitle: options.moduleTitle,
      actionTypes: options.actionTypes,
      formFields,
      attrs
    }
    console.log('model = ', model)
    const renderText = template.render(script, model)
    expect(renderText).to.exist

    t.pass()
  } catch (err) {
    console.error(err)
  }
})

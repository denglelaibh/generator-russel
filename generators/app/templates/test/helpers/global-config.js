module.exports = {
  baseURL: 'http://172.25.50.51:8090/manage/',
  timeout: 5000,
  userName: '8888',
  password: '111111a',
  oldPassword: '111111a',
  newPassword: 'A1a#$Bc#d',
  setting: {
    institution: {
      clearAuto: false // 是否自动删除添加的测试机构
    },
    teller: {
      clearAuto: false // 自动删除添加的测试柜员
    },
    role: {
      clearAuto: false // 自动删除添加的测试岗位
    },
    menu: {
      clearAuto: false // 自动删除添加的测试菜单
    }
  },
  accountNo: '6230700000000000216', // 二类户号
  mobile: '', // 手机号
  certNo: '', // 身份证号
  custNo: '', // 客户号
};

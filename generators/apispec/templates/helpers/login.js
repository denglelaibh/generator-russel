const crypto = require('crypto');

const LoginSchema = require('./login.json');
const request = require('./request');
const { distillInfo, randomColor } = require('./distill');
const { expectOK } = require('./expect-http');
const { userName, password, oldPassword, newPassword } = require('./global-config');

//-------------------------------------登录------------------------------------------------//
/**
 * 加密方法. 使用 aes-128-ecb
 */
const encode = () => {
  const cipher = crypto.createCipheriv('aes-128-ecb', 'ABCKSLDKSISKDJSH', '');
  let encrypted = cipher.update('1490111628126ABCD', 'utf8', 'base64');
  encrypted += cipher.final('base64');
  console.log(encrypted);
};

/**
 * 解密方法.
 * @param encrypted
 */
const decode = encrypted => {
  const decipher = crypto.createDecipheriv('aes-128-ecb', 'ABCKSLDKSISKDJSH', '');

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  console.log(decrypted);
  return decrypted;
};

/**
 * 获取验证码
 * @returns {Promise.<{verificationCode, verificationCodeHash: *}>}
 */
const getVerifyCode = async () => {
  try {
    const response = await request.post('auth/getVerifyCode');
    const { token, image } = response.data && response.data.resultData;
    const verificationCode = decode(token).slice(13, 17);
    console.log(`verificationCode = ${verificationCode}`);
    return { verificationCode, verificationCodeHash: token };
  } catch (error) {
    console.error('getVerifyCode error: ', error)
  }
};

// 登录信息
// const userName = '8888';
// const password = '111111q';
// const oldPassword = '111111q';
// const newPassword = 'A1a#$Bc#d';

// getVerifyCode 拿到 token 和 image； image 用来显示图片，token 用于 login 时的 validateCodeHash；image 中的文本信息用于 validateCode 字段
// login 返回值中的 JSESSIONID 用作 cookie 验证
const login = async ({ userName, password }) => {
  try {
    const { verificationCode, verificationCodeHash } = await getVerifyCode();
    console.log('verficationCode = ', verificationCode, ', verificationCodeHash = ', verificationCodeHash);
    const data = {
      userName,
      password,
      verificationCode, // 验证码
      // validateCode: 'AYNS', // 验证码
      verificationCodeHash  // 验证码的 hash/token
      // validateCodeHash: '5122EE25895E99B0EB23ED870E5A8A6FC8649DBBBE40C47EEA25316CAB805D93'  // 验证码的 hash/token
    };
    const response = await request.post('auth/login', data);
    distillInfo(response);
    // expectOK(response);
    // expect(response.data).to.be.jsonSchema(LoginSchema);
    console.log('resultData = ', response.data.resultData);
    const { JSESSIONID } = response.data && response.data.resultData || {};
    request.defaults.headers.cookie = `JSESSIONID=${encodeURIComponent(JSESSIONID)}`;
    if (response.data.resultCode === '00002') {
      await modifyPwd({ oldPassword, newPassword });
    }
    return response.data.resultCode;
  } catch (error) {
    console.error('login error: ', error)
  }
};

/**
 * 修改密码. NOTE: 初次登陆需要修改密码
 * @param oldPassword
 * @param newPassword
 * @returns {Promise<AxiosInstance>}
 */
const modifyPwd = async ({ oldPassword, newPassword }) => {
  try {
    const response = await request.post('/auth/modifyPwd', { oldPassword, newPassword });
    expectOK(response);

    return request;
  } catch (error) {
    console.error('modifyPwd error: ', error);
  }
};

module.exports = {
  login,
  modifyPwd
};

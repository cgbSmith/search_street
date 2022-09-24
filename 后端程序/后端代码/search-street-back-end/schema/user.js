// 导入定义验证规则的包
const Joi = require('joi')

// const username = Joi.string().alphanum().min(4).max(20).required()
const password = Joi.string()
  .pattern(/^[\S]{6,20}$/)
  .required()
const phone = Joi.string()
  .pattern(/^[1][3,4,5,7,8][0-9]{9}$/)
  .required()
const sex = Joi.number().integer().min(0).max(1).required()
const nickname = Joi.string().min(4).max(20).required()
const avatar = Joi.string().dataUri().required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_schema = {
  body: {
    nickname,
    password,
    phone,
  },
}
exports.login_schema = {
  body: {
    phone,
    password,
  },
}
// 定义更新用户信息的规则对象
exports.update_userinfo_schema = {
  body: {
    sex,
    nickname,
  },
}
// 定义更改密码的规则对象
exports.update_password_schema = {
  body: {
    oldPwd: password,
    // Joi.not(Joi.ref('oldPwd'))表示oldPwd和newPwd的值必须不同
    newPwd: Joi.not(Joi.ref('oldPwd')).concat(password),
  },
}
// 定义更新头像的规则对象
exports.update_avatar_schema = {
  body: {
    avatar,
  },
}


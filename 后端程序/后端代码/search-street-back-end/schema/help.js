// 导入定义验证规则的包
const Joi = require('joi')

const title = Joi.string().min(1).max(20).required()
const content = Joi.string().min(1).max(200).required()
const phone = Joi.string()
  .pattern(/^[1][3,4,5,7,8][0-9]{9}$/)
  .required()
const coin = Joi.number().integer().min(1).required()
const latitude = Joi.number().required()
const longitude = Joi.number().required()
const province = Joi.string().required()
const city = Joi.string().required()
const district = Joi.string().required()
const address = Joi.string().required()
const extra = Joi.string().required()
const datetime = Joi.date().required()
const scope = Joi.string().required()
const appeal_id = Joi.number().integer().required()
const status = Joi.number().min(0).max(4).integer().required()

exports.ask_for_help_schema = {
  body: {
    title,
    content,
    phone,
    coin,
    datetime,
    latitude,
    longitude,
    province,
    city,
    district,
    address,
    extra,
  },
}

exports.help_others_schema = {
  query: {
    latitude,
    longitude,
    scope,
  },
}

exports.change_status_schema = {
  body: {
    appeal_id,
    status,
  },
}

exports.delete_appeal_schema = {
  body: {
    appeal_id,
  },
}

exports.modify_appeal_schema = {
  body: {
    appeal_id,
    title,
    content,
    phone,
    coin,
    datetime,
    latitude,
    longitude,
    address,
  },
}

exports.add_help_info_schema = {
  body: {
    appeal_id,
    title,
    status,
    datetime,
  },
}

exports.get_help_order_schema = {
  query: {
    appeal_id,
  },
}

exports.finish_help_schema = {
  body: {
    appeal_id,
  },
}

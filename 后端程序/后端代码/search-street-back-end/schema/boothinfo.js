const Joi = require('joi')

const boothName = Joi.string().required()
const bussinessScope = Joi.string().required()
const cost = Joi.number().required()
const labelPosition = Joi.string().required()
const license = Joi.number().required()
const shop_id = Joi.number().required()
const district = Joi.string().required()
const city = Joi.string().required()
const province = Joi.string().required()
const address = Joi.string().required()
const latitude = Joi.number().required()
const longitude = Joi.number().required()
const business_license_img = Joi.string().required()




//定义地毯注册的规则对象
exports.boothRegister_schema = {
    body: {
      boothName,
      bussinessScope,
      cost,
      labelPosition,
      license,
      district,
      city,
      province,
      address,
      latitude,
      longitude,
      business_license_img,
    },
  }
  
  //定义删除注册地毯的规则对象
  exports.boothDelete = {
    body: {
      shop_id,
    },
  }
  
  //定义编辑地摊信息的规则对象
  exports.boothHandle = {
    body: {
      shop_id,
    },
  }
  
const express=require('express')

const router = express.Router()

const expressJoi = require('@escook/express-joi')

const {
    boothRegister_schema,
    boothDelete,
    boothHandle,
  } = require('../schema/boothinfo')


//注册地毯
const boothinfo_handler=require('../router_handler/boothinfo')
router.post('/boothRegister', expressJoi(boothRegister_schema), boothinfo_handler.boothRegister)
//获取数据库中已经注册的商铺信息,无验证的信息
router.post('/boothManage', boothinfo_handler.boothManage)
//删除每一条注册的商铺信息,
router.post('/boothDelete', expressJoi(boothDelete), boothinfo_handler.boothDelete)
//编辑每一条商铺信息
router.post('/boothHandle', expressJoi(boothHandle), boothinfo_handler.boothHandle)
//修改注册地摊的信息
router.post('/boothModify', boothinfo_handler.boothModify)
//上传图片
router.post('/getpic',boothinfo_handler.getpic)

module.exports = router
const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

// 查询注册的地摊信息
const findbooth_handler = require('../router_handler/findbooth')
router.get('/findBooth', findbooth_handler.findBooth)

module.exports = router
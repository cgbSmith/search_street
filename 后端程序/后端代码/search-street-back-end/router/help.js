const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')

const {
  ask_for_help_schema,
  help_others_schema,
  change_status_schema,
  delete_appeal_schema,
  modify_appeal_schema,
  add_help_info_schema,
  get_help_order_schema,
  finish_help_schema,
} = require('../schema/help')

const help_handler = require('../router_handler/help')
// 提交求助表单
router.post('/forhelp', expressJoi(ask_for_help_schema), help_handler.askForHelp)
// 某经纬度一定范围内发布求助订单
router.get('/helpothers', expressJoi(help_others_schema), help_handler.toHelpOthers)

// 根据appeal_id的修改求助状态
router.post('/help/changestatus', expressJoi(change_status_schema), help_handler.changeStatus)
// 查询注册的地摊信息
// router.get('/findBooth', help_handler.findBooth)
// 根据appeal_id删除订单
router.post('/delByAppealid', expressJoi(delete_appeal_schema), help_handler.delByAppealId)

// 添加帮助信息
router.post('/help/addHelpInfo', expressJoi(add_help_info_schema), help_handler.addHelpInfo)

// 根据appeal_id修改求助信息
router.post('/modifyAppeal', expressJoi(modify_appeal_schema), help_handler.modifyByAppealId)

// 根据user_id获取帮助信息
router.get('/getHelpByUId', help_handler.getHelpByUId)

// 根据help_id获取帮助订单信息
router.get(
  '/getHelpOrderByHelpId',
  expressJoi(get_help_order_schema),
  help_handler.getHelpOrderByHelpId
)

// 求助已完成的路由
router.post('/finishHelp', expressJoi(finish_help_schema), help_handler.finishHelp)

module.exports = router

// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

var multiparty = require('multiparty')
var fs = require('fs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  const sql = `select user_id, nickname, phone, sou_coin, sex from tb_person_info where user_id=?`
  //
  db.query(sql, req.user.user_id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取用户信息失败！')

    // 用户信息获取成功
    res.send({
      status: 0,
      message: '获取用户信息成功',
      data: results[0],
    })
  })
}

// 根据user_id获取我的求助的处理函数
exports.getMyHelp = (req, res) => {
  const sql = `select * from tb_appeal where user_id=? order by appeal_id DESC`
  //
  db.query(sql, req.user.user_id, (err, results) => {
    if (err) return res.cc(err)

    // 用户信息获取成功
    res.send({
      status: 0,
      message: '获取成功',
      data: results,
    })
  })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  const sql = `update tb_person_info set ? where user_id=?`
  db.query(sql, [req.body, req.user.user_id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新用户基本信息失败！')
    // 成功
    res.cc('更新用户基本信息成功！', 0)
  })
}
// 更改密码的处理函数
exports.updatePassword = (req, res) => {
  const sql = `select * from tb_person_info where user_id=?`
  db.query(sql, req.user.user_id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户不存在！')
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!compareResult) return res.cc('旧密码错误！')

    const sql1 = `update tb_person_info set password=? where user_id=?`
    // 对新密码进行hash处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(sql1, [newPwd, req.user.user_id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新密码失败！')
      res.cc('更新密码成功！', 0)
    })
  })
}

// 更新头像的处理函数
exports.updateAvatar = (req, res) => {
  const sql = `update web_user set user_pic=? where id=?`
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更换头像失败！')
    res.cc('更换头像成功！', 0)
  })
}


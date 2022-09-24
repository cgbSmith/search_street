// 导入数据库操作模块
const { query } = require('express')
const Connection = require('mysql/lib/Connection')
const db = require('../db/index')

const { getNowTime } = require('../utils/datetime')

exports.askForHelp = (req, res) => {
  const helpInfo = req.body
  const sql = `insert into tb_appeal set ?`
  db.query(
    sql,
    {
      user_id: req.user.user_id,
      appeal_title: helpInfo.title,
      appeal_content: helpInfo.content,
      phone: helpInfo.phone,
      sou_coin: helpInfo.coin,
      province: helpInfo.province,
      city: helpInfo.city,
      district: helpInfo.district,
      full_address: helpInfo.address,
      appeal_more_info: helpInfo.extra,
      start_time: getNowTime(),
      end_time: helpInfo.datetime,
      latitude: helpInfo.latitude,
      longitude: helpInfo.longitude,
    },
    (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('提交求助失败！请稍后重试')
      return res.cc('提交成功！', 0)
    }
  )
}

exports.toHelpOthers = (req, res) => {
  const info = req.query
  const lat_change = info.scope / 111
  const lng_change = -info.scope / (111 * Math.cos(info.latitude))
  // 计算范围内左下角经纬度坐标
  const lat1 = info.latitude - lat_change
  const lng1 = info.longitude - lng_change
  // 计算范围内右上角经纬度坐标
  const lat2 = info.latitude + lat_change
  const lng2 = info.longitude + lng_change
  const sql = `SELECT * FROM tb_appeal where (longitude between ? and ?) and (latitude between ? and ?) and appeal_status=0 and user_id!=?;`
  db.query(sql, [lng1, lng2, lat1, lat2, req.user.user_id], (err, results) => {
    if (err) return res.cc(err)
    if (!results.length) {
      return res.cc('该范围内暂无求助订单，建议加大范围')
    }
    res.send({
      status: 0,
      message: '查询成功',
      data: results,
    })
  })
}

exports.changeStatus = (req, res) => {
  const info = req.body
  const sql = `update tb_appeal set appeal_status=? where appeal_id=?`
  db.query(sql, [info.status, info.appeal_id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('请稍后重试！')
    return res.cc('申请成功！请等待客户同意申请', 0)
  })
}

exports.delByAppealId = (req, res) => {
  const body = req.body
  const sql = `delete from tb_appeal where appeal_id=?`
  db.query(sql, body.appeal_id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('请稍后重试！')
    return res.cc('求助订单删除成功！', 0)
  })
}

exports.modifyByAppealId = (req, res) => {
  const body = req.body
  const sql = `update tb_appeal set ? where appeal_id=?`
  db.query(
    sql,
    [
      {
        appeal_title: body.title,
        appeal_content: body.content,
        phone: body.phone,
        sou_coin: body.coin,
        full_address: body.address,
        end_time: body.datetime,
        latitude: body.latitude,
        longitude: body.longitude,
      },
      body.appeal_id,
    ],
    (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('请稍后重试！')
      return res.cc('修改成功！', 0)
    }
  )
}

exports.addHelpInfo = (req, res) => {
  const body = req.body
  const sql1 = `update tb_appeal set appeal_status=? where appeal_id=?`
  const sql2 = `insert into tb_help set ?`
  db.getConnection((err, connection) => {
    if (err) return res.cc(err)
    connection.beginTransaction((err) => {
      if (err) return res.cc(err)

      connection.query(sql1, [body.status, body.appeal_id], (err, results) => {
        if (err || results.affectedRows !== 1) {
          connection.rollback()
          return res.cc(err || '请稍后重试！')
        }
        connection.query(
          sql2,
          {
            appeal_id: body.appeal_id,
            appeal_title: body.title,
            help_status: body.status,
            user_id: req.user.user_id,
            end_time: body.datetime,
          },
          (err, results) => {
            if (err || results.affectedRows !== 1) {
              connection.rollback()
              return res.cc(err || '请稍后重试！')
            }
            connection.commit((err) => {
              if (err) return res.cc(err)
              return res.cc('操作成功！', 0)
            })
          }
        )
      })
    })
  })
}

exports.getHelpByUId = (req, res) => {
  const sql = `select * from tb_help where user_id=?`
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

exports.getHelpOrderByHelpId = (req, res) => {
  const id = req.query.appeal_id
  const sql = `select * from tb_appeal where appeal_id=?`
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) {
      return res.cc('请稍后重试!')
    }
    res.send({
      status: 0,
      message: '获取成功',
      data: results[0],
    })
  })
}

exports.finishHelp = (req, res) => {
  const id = req.body.appeal_id
  const sql = `update tb_appeal set appeal_status=2 where appeal_id=?`
  db.query(sql, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('请稍后重试！')
    return res.cc('操作成功！', 0)
  })
}

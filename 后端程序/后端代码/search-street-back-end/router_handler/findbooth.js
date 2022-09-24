const db = require('../db/index')

//寻找和搜索结果相关的已注册的商铺
exports.findBooth = (req, res) => {
    const info = req.query
    console.log('info', info)
  
    const lat_change = info.scope / 111
    const lng_change = -info.scope / (111 * Math.cos(info.latitude))
    // 计算范围内左下角经纬度坐标
    const lat1 = info.latitude - lat_change
    const lng1 = info.longitude - lng_change
    // 计算范围内右上角经纬度坐标
    const lat2 = info.latitude + lat_change
    const lng2 = info.longitude + lng_change
    console.log('lng1, lng2, lat1, lat2,', lng1, lng2, lat1, lat2)
  
    const sql = `SELECT * FROM tb_shop where (longitude between ? and ?) and (latitude between ? and ?) and (enable_status=?)`
    db.query(sql, [lng1, lng2, lat1, lat2, '1'], (err, results) => {
      if (err) return res.cc(err)
      if (!results.length) {
        return res.cc('该范围内暂无求助订单，建议加大范围')
      }
      console.log('结果', results)
      res.send({
        status: 0,
        message: '查询成功',
        data: results,
      })
    })
  }
  
// 导入数据库操作模块
const db = require('../db/index')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

var multiparty = require('multiparty')
var fs = require('fs')


//地毯注册处理
exports.boothRegister = (req, res) => {
    const boothInfo = req.body
    //查询商铺名字是否被占用
    console.log(boothInfo)
    console.log('req.user', req.user)
  
    const sql_1 = 'select * from tb_shop where shop_name=?'
    db.query(sql_1, boothInfo.boothName, (err, results) => {
      if (err) return res.cc(err)
      if (results.length > 0) {
        return res.cc('商铺名已被占用')
      }
      const sql = 'insert into tb_shop set?'
      db.query(
        sql,
        {
          shop_name: boothInfo.boothName,
          business_scope: boothInfo.bussinessScope,
          per_cost: boothInfo.cost,
          is_mobile: boothInfo.labelPosition, //移动或者固定选择
          business_license_code: boothInfo.license, //营业执照
          district: boothInfo.district,
          city: boothInfo.city,
          province: boothInfo.province,
          full_address: boothInfo.address,
          latitude: boothInfo.latitude,
          longitude: boothInfo.longitude,
          user_id: req.user.user_id,
          phone: 0,
          business_license_img: boothInfo.business_license_img,
          create_time: '2021-09-29 20:03:09',
        },
        (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows != 1) return res.cc('用户注册失败，请稍后重试')
          res.send({
            status: 0,
            duration:5000,
            message: '注册成功！',
          })
        }
      )
    })
  }
  
  //注册地毯信息读取
  exports.boothManage = (req, res) => {
    const user_id=req.user.user_id
    console.log("绑定的用户id：",user_id);
    
    const sql_1 = 'select * from tb_shop where user_id=?'
    db.query(sql_1, user_id,(err, results) => {
      if (err) return res.cc(err)
      results = JSON.stringify(results)
      results = JSON.parse(results)
      // console.log(results)
      res.send({
        status: 0,
        results,
      })
    })
  }
  
  //地毯信息的删除
  exports.boothDelete = (req, res) => {
    boothInfo = req.body
  
    sql_1 = 'delete from tb_shop where shop_id =?'
    console.log(boothInfo)
    db.query(sql_1, boothInfo.shop_id, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('删除数据失败，请稍后重试')
      res.send({
        status: 0,
        duration:5000,
        message: '删除成功',
      })
    })
  }
  
  //查看每一条地摊信息
  exports.boothHandle = (req, res) => {
    console.log('handle接口')
    boothInfo = req.body
    console.log(boothInfo)
    const sql_1 = 'select * from tb_shop where shop_id=?'
    db.query(sql_1, boothInfo.shop_id, (err, results) => {
      if (err) return res.cc(err)
      if (results.length !== 1) return res.cc('请求数据失败，请稍后重试')
      results = JSON.stringify(results)
      results = JSON.parse(results)
      console.log(results)
      res.send({
        status: 0,
        results,
      })
    })
  }
  
  //注册地摊信息修改
  exports.boothModify = (req, res) => {
    console.log('clog', req.body)
    info = req.body
    const sql_1 =
      'update tb_shop set shop_name = ?, business_scope = ?, per_cost = ?, is_mobile=?,business_license_code=?,city=?,province=?,district=?,full_address=?,latitude=?,longitude=?,business_license_img=? WHERE shop_id = ?'
    db.query(
      sql_1,
      [
        info.shop_name,
        info.business_scope,
        info.per_cost,
        info.is_mobile,
        info.business_license_code,
        info.city,
        info.province,
        info.district,
        info.full_address,
        info.latitude,
        info.longitude,
        info.business_license_img,
        info.shop_id,
      ],
      (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) res.cc('修改失败')
        res.send({
          status: 0,
          duration:5000,
          message: '修改成功',
        })
      }
    )
  }
  
  //上传图片到pictures中
  exports.getpic = (req, res) => {
    let uploadDir = './'
    let form = new multiparty.Form()
    form.uploadDir = uploadDir
    form.keepExtensions = true
    form.parse(req, function (err, fields, files) {
      let save_path = fields.path
      let pic_path = ''
      console.log('fields', fields)
      console.log('fields', files)
      console.log('save-path', save_path)
  
      if (err) {
        res.cc('上传失败')
      } else {
        // let file_list = []
        if (!files.file) res.cc('上传失败')
        else {
          files.file.forEach((file) => {
            console.log('file', file)
            fs.rename(file.path, save_path + file.originalFilename, function (err) {
              pic_path = save_path + file.originalFilename
              if (err) {
                console.log(err)
                res.cc('上传失败')
              } else {
                //返回所有上传的文件信息
                res.send({
                status: 0,
                 message: '上传成功',
                 path: pic_path,
                })
              }
            })
          })
      
        }
      }
    })
  }
  
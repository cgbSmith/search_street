// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs包
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userInfo = req.body
  // 定义sql语句，查询手机号是否被占用
  const sql1 = `select * from tb_person_info where phone=?`
  db.query(sql1, userInfo.phone, (err, results) => {
    if (err) return res.cc(err)
    // 调用bcrypt.hashSync对密码进行处理
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)
    if (results.length > 0) {
      const tmp = results[0].port
      if (tmp === 2 || tmp === 3) return res.cc('该手机号已在网页端注册！')
      // 手机号已经在小程序绑定，自动同步数据
      if (tmp === 1) {
        const sql2 = `update tb_person_info set ? where phone=?`
        db.query(
          sql2,
          [
            {
              nickname: userInfo.nickname,
              password: userInfo.password,
              port: 3,
            },
            userInfo.phone,
          ],
          (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试')
            return res.cc('注册成功,该手机号曾在小程序绑定,自动同步信息', 0)
          }
        )
      }
    } else {
      // 定义插入新用户的sql语句
      const sql3 = `insert into tb_person_info set ?`
      db.query(
        sql3,
        {
          nickname: userInfo.nickname,
          password: userInfo.password,
          phone: userInfo.phone,
          port: 2,
        },
        (err, results) => {
          if (err) return res.cc(err)
          if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试')
          return res.cc('注册成功', 0)
        }
      )
    }
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  const userInfo = req.body
  // 定义sql语句
  const sql = `select * from tb_person_info where phone=?`
  // 执行sql语句
  db.query(sql, userInfo.phone, (err, results) => {
    // 执行sql语句失败
    if (err) return res.cc(err)
    // 成功，但是获取到的数据条数不等于1
    if (results.length !== 1) return res.cc('用户名或者密码错误！')
    // 判断密码是否正确,bcrypt.compareSync(用户提交的密码，数据库存储的密码)
    const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
    if (!compareResult) return res.cc('用户名或者密码错误！')
    // 在服务器生成Token字符串
    const user = { ...results[0], phone: '', password: '', user_pic: '' }
    // 对用户的信息进行加密，生成Token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    // 将Token响应给客户端
    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
    })
  })
}

//地毯注册处理
// exports.boothRegister = (req,res)=>{

//     const boothInfo = req.body
//     //查询商铺名字是否被占用
//     console.log(boothInfo);
//     console.log('req.user',req.user);
    
//     const sql_1 = 'select * from tb_shop where shop_name=?'
//     db.query(sql_1,boothInfo.boothName,(err,results)=>{
//       if(err) return res.cc(err)
//       if(results.length>0){
//         return res.cc('商铺名已被占用')
//       }
//       const sql = 'insert into tb_shop set?'
//       db.query(
//         sql,
//         {
//           shop_name:boothInfo.boothName,
//           business_scope:boothInfo.bussinessScope,
//           per_cost:boothInfo.cost,
//           is_mobile:boothInfo.labelPosition,//移动或者固定选择
//           business_license_code:boothInfo.license,//营业执照
//           district:boothInfo.district,
//           city:boothInfo.city,
//           province:boothInfo.province,
//           full_address:boothInfo.address,
//           latitude:boothInfo.latitude,
//           longitude:boothInfo.longitude 
//         },
//         (err,results)=>{
//           if(err) return res.cc(err)
//           if(results.affectedRows != 1)return res.cc('用户注册失败，请稍后重试')
//           res.send({
//             status:0,
//             message:'注册成功！'
//           })
//         }
//       )
//     })
    
// }

// //注册地毯信息读取
// exports.boothManage =(req,res)=>{
//   const sql_1= 'select * from booth_register'
//   db.query(sql_1,(err,results)=>{
//     if(err) return res.cc(err)
//     results = JSON.stringify(results);
//     results=JSON.parse(results)
//    // console.log(results)
//     res.send({
//       status:0,
//       results
//     })
//   })
// }

// //地毯信息的删除
// exports.boothDelete =(req,res)=>{
//   boothInfo=req.body;
//   sql_1='delete from booth_register where id =?'
//   console.log(boothInfo);
//   db.query(sql_1,boothInfo.booth_id,(err,results)=>{
//     if(err)return res.cc(err);
//     if(results.affectedRows!==1)return res.cc('删除数据失败，请稍后重试')
//     res.send({
//       status:0,
//       message:"删除成功"
//     }) 
//   })
  
// }

// //查看每一条地摊信息
// exports.boothHandle=(req,res)=>{
//   console.log('handle接口');
//   boothInfo=req.body
//   console.log(boothInfo);
//   const sql_1='select * from booth_register where id=?'
//   db.query(sql_1,boothInfo.booth_id,(err,results)=>{
//     if(err)return res.cc(err)
//     if(results.length!==1)return res.cc('请求数据失败，请稍后重试')
//     results=JSON.stringify(results)
//     results=JSON.parse(results)
//     console.log(results);
//     res.send({
//       status:0,
//       results
//     })
    
//   })
// }
// //注册地摊信息修改
// exports.boothModify=(req,res)=>{
//   console.log("clog",req.body)
//   info=req.body
//   const sql_1='update booth_register set boothName = ?, bussinessScope = ?, cost = ?, labelPosition=?,license=?,city=?,province=?,district=?,address=?,latitude=?,longitude=? WHERE id = ?'
//   db.query(sql_1,[info.boothName,info.bussinessScope,info.cost,info.labelPosition,info.license,info.city,info.province,info.district,info.address,info.latitude,info.longitude,info.id],(err,results)=>{
//     if(err)return res.cc(err)
//     if(results.affectedRows!==1)res.cc('修改失败')
//     res.send({
//       status:0,
//       message:"修改成功",
//     })
//   })
  
// }
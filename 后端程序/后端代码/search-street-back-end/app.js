const express = require('express')

const app = express()

const Joi = require('joi')

// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())

//配置解析图片中间件


var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
//设置图片文件的路径的中间件
app.use('/pictures',express.static('pictures'))
// app.get('/pictures/*',function(req,res){
//   res.sendFile(__dirname+"/"+req.url)
//   console.log('req.url',req.url);
  
// })
// app.get('/pictures/*',function(req,res){
//   console.log('req');
//   res.send('helloworld')
  
// })


// 配置解析表单数据的中间件，只能解析application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({
  extended: false
}))

// 响应数据的中间件
app.use((req, res, next) => {
  // status默认1，代表失败
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({
  secret: config.jwtSecretKey
}).unless({
  path: [/^\/api/]
}))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/ss', userinfoRouter)
// 导入并使用帮把手路由模块
const helpRouter = require('./router/help')
app.use('/ss', helpRouter)
//导入商铺注册组件
const boothinfoRouter = require('./router/boothinfo')
app.use('/ss', boothinfoRouter)
//搜索地摊
const findboothRouter = require('./router/findbooth')
app.use('/ss',findboothRouter)


// 定义错误级别的中间件
app.use((err, req, res, next) => {
  if (err instanceof Joi.ValidationError) return res.cc(err)
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  res.cc(err)
})

// 启动服务器
app.listen(3007,'0.0.0.0' ,() => {
  console.log('服务器启动于0.0.0.0:3007')
})
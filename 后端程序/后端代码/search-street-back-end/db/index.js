const mysql = require('mysql')
// 本地数据库
// const db = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '123456',
//   database: 'sou_street',
// })
// 云数据库
const db = mysql.createPool({
  host: '120.25.121.9',
  user: 'computer',
  password: 'computer2021',
  database: 'street',
})
 
module.exports = db

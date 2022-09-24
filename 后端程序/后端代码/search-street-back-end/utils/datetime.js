// 日期时间相关辅助函数

exports.UTC2BJ = (datetime) => {
  datetime = datetime.replace('Z', ' UTC')
  console.log(datetime)
}

// 获取当前时间yyyy-mm-dd hh:mm:ss
exports.getNowTime = () => {
  let date = new Date()
  date =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getDate() +
    ' ' +
    date.getHours() +
    ':' +
    date.getMinutes() +
    ':' +
    date.getSeconds()
  return date
}

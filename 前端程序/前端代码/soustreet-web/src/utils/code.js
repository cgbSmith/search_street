const vcot = 'vcode_obtaining_time';
const code = 'vcode';
const vt = 1 * 30 * 1000;

function getCode() {
  let info = JSON.parse(localStorage.getItem(code));
  console.log(info);
  if (info) {
    const time = localStorage.getItem(vcot);
    if (time) {
      const ftime = Number(vt) + Number(time);
      const ntime = Date.parse(new Date());
      console.log(`${ftime},${ntime}`);
      if (ftime > ntime) {
        console.log('验证码未过期');
        return info;
      }
      console.log('验证码已过期');
      info = '';
      localStorage.setItem(code, JSON.stringify(''));
    }
  }
  return info;
}

function setCode(payload) {
  localStorage.setItem(code, JSON.stringify(payload));
  const startTime = Date.parse(new Date());
  localStorage.setItem(vcot, startTime);
}

export {
  setCode,
  getCode,
};

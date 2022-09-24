<template>
  <div class="bgc">
    <div class="box">
      <el-form>
        <h3>注册账号</h3>
        <el-divider></el-divider>
        <el-form-item>
          <label style="color: #606266">昵称</label>
          <el-input
            v-model="nickname"
            :class="{ rborder: !userTips.isHide }"
            placeholder="请输入昵称"
            @blur="uBlur"
            clearable
          ></el-input>
        </el-form-item>
        <p :class="{ isShow: userTips.isHide }">{{ userTips.val }}</p>
        <el-form-item>
          <label style="color: #606266">密码</label>
          <el-input
            v-model="password"
            :class="{ rborder: !passwordTips.isHide }"
            placeholder="请输入密码"
            @blur="pBlur"
            show-password
          ></el-input>
        </el-form-item>
        <p :class="{ isShow: passwordTips.isHide }">{{ passwordTips.val }}</p>
        <el-form-item>
          <label style="color: #606266">确认密码</label>
          <el-input
            v-model="confirmPassword"
            :class="{ rborder: !confirmTips.isHide }"
            placeholder="请确认密码"
            @blur="cBlur"
            show-password
          ></el-input>
        </el-form-item>
        <p :class="{ isShow: confirmTips.isHide }">{{ confirmTips.val }}</p>

        <el-form-item>
          <label style="color: #606266">手机</label>
          <el-row>
            <el-col :span="16">
              <el-input
                v-model="phone"
                :class="{ rborder: !phoneTips.isHide }"
                placeholder="请输入手机"
                @blur="eBlur"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="8"
              ><el-button :disabled="isEmit" @click="emitcode" style="width: 112px">{{
                getec
              }}</el-button></el-col
            >
          </el-row>
        </el-form-item>
        <p :class="{ isShow: phoneTips.isHide }">{{ phoneTips.val }}</p>
        <el-form-item>
          <label style="color: #606266">验证码</label>
          <el-input v-model="code" placeholder="请输入验证码" @blur="vBlur" clearable></el-input>
        </el-form-item>
        <p :class="{ isShow: verificationTips.isHide }">{{ verificationTips.val }}</p>
        <el-form-item>
          <el-button class="btnSize" @click="btnClick">注册</el-button>
          <a href="" @click="aClick">已有账号,去登录</a>
        </el-form-item>
        <el-form-item>
          <span class="size"
            >注册即代表同意 <a href="">《注册协议》</a>和<a href="">《隐私政策》</a>
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setCode, getCode } from '../utils/code'

export default {
  name: 'register',
  data() {
    return {
      nickname: '',
      password: '',
      confirmPassword: '',
      phone: '',
      code: '',
      userTips: { val: '必填字段', isHide: true },
      passwordTips: { val: '必填字段', isHide: true },
      confirmTips: { val: '必填字段', isHide: true },
      phoneTips: { val: '必填字段', isHide: true },
      verificationTips: { val: '必填字段', isHide: true },
      time: 60,
      ec: '发送验证码',
      isEmit: false,
      randomCode: '',
    }
  },
  methods: {
    isPhone(str) {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      return reg.test(str)
    },
    aClick() {
      this.$router.push('/login').catch(() => {})
    },
    uBlur() {
      const len = this.nickname.length
      if (!this.userTips.isHide && len >= 4 && len <= 20) {
        this.userTips.isHide = true
      } else if (!len) {
        this.userTips.val = '必填字段'
        this.userTips.isHide = false
      } else if (len < 4 || len > 20) {
        this.userTips.val = '昵称要求在4-20个字符之间'
        this.userTips.isHide = false
      }
    },
    pBlur() {
      const len = this.password.length
      if (!this.passwordTips.isHide && len >= 6 && len <= 20) {
        this.passwordTips.isHide = true
      } else if (!len) {
        this.passwordTips.val = '必填字段'
        this.passwordTips.isHide = false
      } else if (len < 6 || len > 20) {
        this.passwordTips.val = '密码要求在6-20个字符之间哦'
        this.passwordTips.isHide = false
      }
    },
    cBlur() {
      const len = this.confirmPassword.length
      if (!this.confirmTips.isHide && this.password === this.confirmPassword) {
        this.confirmTips.isHide = true
      } else if (!len) {
        this.confirmTips.val = '必填字段'
        this.confirmTips.isHide = false
      } else if (this.password !== this.confirmPassword) {
        this.confirmTips.val = '两次密码不一致'
        this.confirmTips.isHide = false
      }
    },
    eBlur() {
      const len = this.phone.length
      if (!this.phoneTips.isHide && this.isPhone(this.phone)) {
        this.phoneTips.isHide = true
      } else if (!len) {
        this.phoneTips.val = '必填字段'
        this.phoneTips.isHide = false
      } else if (!this.isPhone(this.phone)) {
        this.phoneTips.val = '手机格式错误'
        this.phoneTips.isHide = false
      }
    },
    vBlur() {
      const len = this.code.length
      if (!len) {
        this.verificationTips.val = '必填字段'
        this.verificationTips.isHide = false
      } else {
        this.verificationTips.isHide = true
      }
    },
    emitcode() {
      this.generate()
      this.ec = '已发送'
      this.isEmit = true
      const timer = setInterval(() => {
        this.time -= 1
        if (this.time <= 0) {
          this.time = 60
          this.ec = '发送验证码'
          this.isEmit = false
          clearInterval(timer)
        }
      }, 1000)
    },
    generate() {
      this.randomCode = ''
      let tmp
      for (let i = 0; i < 6; i += 1) {
        tmp = Math.floor(Math.random() * 9)
        this.randomCode += tmp
      }
      // this.$store.commit('setCode', this.randomCode);
      setCode(this.randomCode)
      console.log(`【搜街网页版】验证码:${this.randomCode}。本验证码5分钟内有效。`)
    },
    btnClick() {
      const a = getCode()
      if (this.code !== a) {
        this.$message({
          message: '验证码错误或已过期',
          type: 'warning',
          offset: 400,
          center: true,
          duration: 1000,
        })
      } else {
        const qs = require('qs')
        this.$axios
          .post(
            '/api/reguser',
            qs.stringify({
              nickname: this.nickname,
              password: this.password,
              phone: this.phone,
            })
          )
          .then((res) => {
            console.log(res)
            if (res.data.status === 0) {
              this.$message({
                message: res.data.message,
                type: 'success',
                offset: 400,
                center: true,
                duration: 1000,
              })
            }
          })
      }
    },
  },
  computed: {
    getec() {
      if (!this.isEmit) {
        return this.ec
      }
      return `${this.ec}(${this.time})`
      // return this.ec + '(' + this.time + ')';
    },
  },
}
</script>

<style scoped>
.bgc {
  /* position: relative; */
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.box {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
}
.btnSize {
  width: 150px;
  border-radius: 10px;
  background-color: #eee;
  margin: 20px 20px 20px 0;
}
p {
  /* margin: 0; */
  margin: -20px 0 -10px 5px;
  font-size: 10px;
  color: red;
}
.isShow {
  visibility: hidden;
}
.rborder >>> input {
  border-color: red;
}
.size {
  font-size: 10px;
  margin-left: 10px;
}
</style>

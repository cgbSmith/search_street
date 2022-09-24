<template>
  <div class="box">
    <div class="login-box">
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <div class="radio">
          <el-radio-group v-model="radio" fill="#26BB9C" @change="change">
            <!-- <el-radio-button label="用户登录"></el-radio-button> -->
            <el-radio-button label="手机登录"></el-radio-button>
          </el-radio-group>
        </div>
        <el-form-item class="input" prop="phone">
          <el-input :placeholder="pu" v-model="loginForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item class="input" prop="password">
          <el-input placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
        </el-form-item>

        <div class="text">
          <a href="" @click="rClick">还未注册?去注册</a>
          <a href="/forget">忘记密码</a>
        </div>
        <el-form-item class="loginBtn">
          <el-button class="btn" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
        <el-form-item class="loginBtn">
          <el-button style="width: 240px" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        phone: '',
        password: '',
        code: '',
        token: '',
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 5, max: 5, message: '长度在 5 个字符', trigger: 'blur' },
        ],
      },
      radio: '手机登录',
      pu: '请输入手机号',
      captchaImg: null,
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const form = this.loginForm
          const qs = require('qs')
          this.$axios.post('/api/login', qs.stringify(form)).then((res) => {
            const jwt = res.data.token
            console.log('jwt:', jwt)
            this.$store.commit('setToken', jwt)

            this.$router.push('/index')
            this.$message({
              message: '登录成功！',
              type: 'success',
              duration: 1500,
              offset: 400,
              center: true,
            })
            this.$axios.get('/ss/userinfo').then((res) => {
              const userInfo = res.data.data
              console.log('userInfo:', userInfo)
              this.$store.commit('login', userInfo)
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    rClick() {
      this.$router.push('/register').catch(() => {})
    },
    change() {
      this.pu = this.pu === '请输入用户名' ? '请输入手机号' : '请输入用户名'
    },
    getCaptcha() {
      this.$axios.get('/captcha').then((res) => {
        console.log(res.data)
        this.loginForm.token = res.data.data.token
        this.captchaImg = res.data.data.captchaImg
      })
    },
  },
  created() {
    // this.getCaptcha()
  },
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
  position: relative;
}
.login-box {
  position: absolute;
  width: 600px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  background-color: #fff;
  border-radius: 10px;
}
.text {
  text-align: center;
}
.input {
  margin-left: 180px;
  margin-right: 180px;
  text-align: center;
}
a {
  font-size: 10px;
  margin: 0 15px;
}
.radio {
  text-align: center;
  padding: 40px;
}
.loginBtn {
  margin: 10px;
  padding: 10px;
  text-align: center;
}
.btn {
  width: 240px;
  border-radius: 5px;
  background-color: #26bb9c;
  color: #fff;
}
.captchaImg {
  float: left;
  margin-left: 8px;
}
</style>

//地摊登录组件
<template>
  <el-scrollbar class="scrollbar">
    <div class="box">
      <div class="login-box">
        <h3><div class="hstyle">地摊登陆</div></h3>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="formbox"
        >
          <el-form-item class="input" label="手机号码" prop="number">
            <el-input
              v-model="ruleForm.number"
              autocomplete="off"
              placeholder="请输入手机号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="input" label="密码" prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              show-password
              autocomplete="off"
              clearable
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="input" label="再次确认密码" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              show-password
              autocomplete="off"
              placeholder="请输入密码"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="input" prop="code">
            <el-input
              placeholder="请输入验证码"
              style="width: 160px; float: left"
              v-model="ruleForm.code"
              clearable
            ></el-input>
            <el-image :src="captchaImg" class="captchaImg"></el-image>
          </el-form-item>

          <div class="text">
            <a href="" @click="rClick">还未注册?去注册</a>
            <a href="/forget">忘记密码</a>
          </div>

          <el-form-item class="loginBtn">
            <el-button class="btn" @click="submitForm('ruleForm')"
              >登陆</el-button
            >
          </el-form-item>
          <el-form-item class="loginBtn">
            <el-button style="width: 240px" @click="resetForm('ruleForm')"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        number: "",
        pass: "",
        checkPass: "",
        code: "",
      },
      rules: {
        number: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "手机号格式错误", trigger: "blur" },
        ],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 5, max: 5, message: "长度在 5 个字符", trigger: "blur" },
        ],
      },
      captchaImg:null,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          //调用axios.post向服务器拿数据和传数据
          this.$axios.post('/login',this.ruleForm).then((res)=>{
            //传数据和拿数据
          })
          alert("submit!");
          console.log(this.ruleForm); //这里可以获得ruleform中的数据
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    getCaptcha(){//拿到验证码图片
      this.$axios.get('/captcha').then((res)=>{
        // res为服务器返回的响应报文 体
        // this.captchaImg = 响应报文体中对应的图片资源
      })
    }
  },
  created() {
    this.getCaptcha()//钩子函数中调用getCaotcha
  },
};
</script>

<style>
.hstyle {
  text-align: center;
  color: rgb(74, 184, 178);
  font-size: 30px;
  border-style: initial;
  border-width: 1px;
  border-color: #26bb9c;
}

.formbox {
  border: solid;
  border-width: 3px;
  border-color: rgb(78, 163, 138);
}
.scrollbar {
  width: 100%;
  height: 100%;
  justify-content: right;
  overflow-y: auto;
}
/* .loginbox {
  padding-top: 5%;
} */
.box {
  width: 100%;
  height: 100%;

  /* position: relative; */
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
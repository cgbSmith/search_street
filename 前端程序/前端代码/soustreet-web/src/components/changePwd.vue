<template>
  <div class="box">
    <div class="change">
      <h3>修改密码</h3>
      <div>
        <label style="color: #606266; margin: 0 18px">原密码</label>
        <el-input
          style="width: 200px"
          type="password"
          v-model="oldPwd"
          @blur="oblur"
          show-password
        ></el-input>
      </div>
      <p :class="{ isShow: !otip }">{{ otip || 1 }}</p>
      <div>
        <label style="color: #606266; margin: 0 18px; width: 200px">新密码</label>
        <el-input
          style="width: 200px"
          type="password"
          v-model="newPwd"
          @blur="nBlur"
          show-password
        ></el-input>
      </div>
      <p :class="{ isShow: !ntip }">{{ ntip || 1 }}</p>
      <div>
        <label style="color: #606266; margin: 0 10px; width: 200px">确认密码</label>
        <el-input
          style="width: 200px"
          type="password"
          v-model="confirmPwd"
          @blur="cBlur"
          show-password
        ></el-input>
      </div>
      <p :class="{ isShow: !ctip }">{{ ctip || 1 }}</p>
      <div style="width: 100%; margin-top: 20px">
        <el-button
          style="position: absolute; left: 50%; transform: translate(-50%); width: 100px"
          type="primary"
          @click="submit"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script scoped>
export default {
  data() {
    return {
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
      otip: '',
      ntip: '',
      ctip: '',
    }
  },
  methods: {
    submit() {
      const qs = require('qs')
      this.$axios
        .post(
          '/ss/updatepwd',
          qs.stringify({
            oldPwd: this.oldPwd,
            newPwd: this.newPwd,
          })
        )
        .then((res) => {
          if (res.data.status === 0) {
            this.$message({
              message: res.data.message,
              type: 'success',
              duration: 1500,
              offset: 400,
              center: true,
            })
          }
        })
    },
    oblur() {
      const len = this.oldPwd.length
      if (len < 6 || len > 20) {
        this.otip = '密码长度在6-20之间！'
      } else {
        this.otip = ''
      }
    },
    nBlur() {
      const len = this.newPwd.length
      if (len < 6 || len > 20) {
        this.ntip = '密码长度在6-20之间！'
      } else {
        this.ntip = ''
      }
    },
    cBlur() {
      if (this.newPwd !== this.confirmPwd) {
        this.ctip = '与新密码不一致！'
      } else {
        this.ctip = ''
      }
    },
  },
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
}
.change {
  position: absolute;
  left: 50%;
  top: 12%;
  transform: translate(-50%);
}
p {
  margin: 0 0 0 100px;
  font-size: 10px;
  color: red;
}
.isShow {
  visibility: hidden;
}
</style>

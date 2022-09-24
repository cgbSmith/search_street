<template>
  <div class="box">
    <div class="info">
      <h3>个人信息</h3>
      <div class="mt-10">
        <label style="color: #606266; margin: 0 18px">昵称</label>
        <el-input v-model="info.nickname" :disabled="isModify" style="width: 200px"></el-input>
      </div>

      <div class="mt-10">
        <label style="color: #606266; margin: 0 18px">性别</label>
        <el-select
          v-model="info.sex"
          placeholder="请选择性别"
          :disabled="isModify"
          style="width: 200px"
        >
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="1"></el-option>
        </el-select>
      </div>
      <div class="mt-10">
        <label style="color: #606266; margin: 0 18px">电话</label>
        <el-input v-model="info.phone" disabled style="width: 200px"></el-input>
      </div>
      <div class="mt-10">
        <label style="color: #606266; margin: 0 18px">搜币</label>
        <el-input v-model="info.sou_coin" disabled style="width: 200px"></el-input>
      </div>
      <div class="mt-10" style="width: 100%">
        <el-button
          type="primary"
          v-if="isModify"
          @click="modify"
          style="width: 100px; position: absolute; left: 50%; transform: translate(-50%)"
          >修改信息</el-button
        >
        <el-button
          type="primary"
          v-if="!isModify"
          @click="confirm"
          style="width: 100px; position: absolute; left: 50%; transform: translate(-50%)"
          >确定修改</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isModify: true,
      info: { nickname: '', phone: '', sou_coin: '', sex: '' },
    }
  },
  methods: {
    modify() {
      this.isModify = false
    },
    confirm() {
      this.isModify = true
      const qs = require('qs')
      this.$axios
        .post('/ss/userinfo', qs.stringify({ nickname: this.info.nickname, sex: this.info.sex }))
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
  },
  mounted() {
    this.$axios.get('/ss/userinfo').then((res) => {
      const data = res.data.data
      this.info.nickname = data.nickname
      this.info.phone = data.phone
      this.info.sou_coin = data.sou_coin
      this.info.sex = data.sex
    })
  },
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
}
.info {
  position: absolute;
  left: 50%;
  top: 12%;
  transform: translate(-50%);
}
.mt-10 {
  margin-top: 10px;
}
</style>

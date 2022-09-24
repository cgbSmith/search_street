<template>
  <div class="box">
    <div class="logo-box">
      <img src="../assets/icon.jpg" alt="logo" style="height: 25px" />
      <h3 style="margin-left: 8px">i搜街</h3>
    </div>
    <div class="text-box">
      <el-menu
        :default-active="barIndex"
        router
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#fff"
        style="height: 60px"
      >
        <el-menu-item index="/index">首页</el-menu-item>
        <el-submenu index="/team">
          <template slot="title">团队</template>
          <el-menu-item index="/company">公司介绍</el-menu-item>
          <el-menu-item index="/teamintroduction">团队介绍</el-menu-item>
        </el-submenu>
        <el-menu-item index="/findbooth">搜索地摊</el-menu-item>
        <el-submenu index="/vendor">
          <template slot="title">成为摊主</template>
          <el-menu-item index="/boothRegister">地摊注册</el-menu-item>
          <el-menu-item index="/boothManage">地摊信息管理</el-menu-item>
        </el-submenu>
        <el-submenu index="/help">
          <template slot="title">帮把手</template>
          <el-menu-item index="/askforhelp">发布求助</el-menu-item>
          <el-menu-item index="/tohelpothers">助人为乐</el-menu-item>
        </el-submenu>
        <el-menu-item index="/login" v-if="!isLogin">登录</el-menu-item>
        <el-menu-item index="/register" v-if="!isLogin">注册</el-menu-item>
        <!-- <el-menu-item class="user" v-if="isLogin">{{$store.state.userName}}<img src="../assets/logined.png" @mouseenter="enter" @mouseleave="leave"></el-menu-item> -->
        <img src="../assets/logined.png" v-if="isLogin" />
        <el-submenu index="/user" v-if="isLogin" style="margin-left: -2px">
          <template slot="title">{{ nickName }}</template>
          <el-menu-item index="/personalcenter">个人中心</el-menu-item>
          <el-menu-item @click="logout">退出登录</el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- <div class="dropdown" v-if="isLogin">
        <el-button style="height:35px">账号设置</el-button>
        <el-button style="height:35px">退出登录</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'navibar',
  data() {
    return {
      textList: [
        { name: '首页', innertext: [] },
        { name: '公司', innertext: ['公司介绍', '团队介绍'] },
        { name: '功能', innertext: ['搜街', '帮把手'] },
        { name: '登录', innertext: [] },
        { name: '注册', innertext: [] },
      ],
      currentText: 0,
    }
  },
  computed: {
    barIndex() {
      if (this.$route.path === '/') {
        return '/index'
      }
      return this.$route.path
    },
    isLogin() {
      // window.localStorage.clear()
      // const bool = this.$store.state.isLogin || localStorage.getItem('isLogin') ? true : false
      // console.log(bool)
      return this.$store.state.isLogin
    },
    nickName() {
      let nickname = this.$store.state.userInfo.nickname

      if (!nickname) nickname = JSON.parse(localStorage.getItem('userInfo')).nickname
      return nickname
    },
  },
  methods: {
    clickText(index) {
      this.currentText = index
    },
    logout() {
      this.$store.commit('logout')
      this.$message({
        type: 'success',
        message: '已退出登录',
        offset: 400,
        duration: 1500,
        center: true,
      })
      this.$router.replace('/index').catch(() => {})
    },
    handleSelect(item) {
      console.log(item)
    },
  },
  created() {
    if (!this.$store.state.isLogin) {
      const isLogin = localStorage.getItem('isLogin') ? true : false
      this.$store.commit('setLogin', isLogin)
    }
  },
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 61px;
  background-color: #fff;
  opacity: 0.9;
  display: flex;
}
.height {
  height: 44px;
}
.logo-box {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-box {
  width: 60%;
  height: 44px;
}
.dropdown {
  display: flex;
  position: fixed;
  right: 30px;
  width: 210px;
  height: 100px;
  background-color: #eee;
}
.el-menu-item {
  display: block !important;
  margin: 0 !important;
}
ul {
  line-height: 44px;
  list-style: none;
  margin: 0;
}
li {
  display: inline-block;
  margin-left: 20px;
  margin-right: 20px;
}
a {
  text-decoration: none;
  color: inherit;
  display: block;
}
.user {
  line-height: 60px;
}
img {
  float: left;
  width: 40px;
  height: 40px;
  margin-top: 10px;
}
</style>

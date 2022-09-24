<template>
  <div id="box">
    <el-col :span="4" style="height: 100vh; background-color: #999">
      <h5>个人中心</h5>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>个人</span>
          </template>
          <el-menu-item-group>
            <router-link to="/info">
              <el-menu-item index="1-1">个人信息</el-menu-item>
            </router-link>
            <router-link to="/changePwd">
              <el-menu-item index="1-2">修改密码</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">帮把手</span>
          </template>
          <el-menu-item-group>
            <router-link to="/myhelp">
              <el-menu-item index="2-1">我的求助</el-menu-item>
            </router-link>
            <router-link to="/helpOrder">
              <el-menu-item index="2-2">帮助订单</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
  },
  mounted() {},
}
</script>

<style>
#box {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
a {
  text-decoration: none;
}
</style>

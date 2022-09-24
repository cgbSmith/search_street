import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './vuex'
import axios from './axios'

Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)

// require('./mock')

router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    if (localStorage.getItem('isLogin') === 'true') {
      next()
    } else {
      alert('请先登录')
      next({
        path: '/login', //如果为假，则重定向到这个路由路劲
        // query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})

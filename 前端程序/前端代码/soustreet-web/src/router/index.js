import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '@/components/login'
import register from '@/components/register'
import index from '@/components/index'
import findbooth from '@/components/findbooth'
import askforhelp from '@/components/askforhelp'
import tohelpothers from '@/components/tohelpothers'
import personalcenter from '@/components/personalcenter'
//######引入注册地摊和登录地摊组件
import boothRegister from '@/components/boothRegister'
import boothLogin from '@/components/boothLogin'
import boothHandle from '@/components/boothHandle'
import boothManage from '@/components/boothManage'

import info from '@/components/info'
import changePwd from '@/components/changePwd'
import myhelp from '@/components/userHelp/myhelp'
import helpOrder from '@/components/userHelp/helpOrder'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/register',
    name: 'register',
    component: register,
  },
  {
    path: '',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'index',
    component: index,
  },
  {
    path: '/findbooth',
    name: 'findbooth',
    component: findbooth,
    meta: { requireAuth: true },

  },
  {
    path: '/askforhelp',
    name: 'askforhelp',
    component: askforhelp,
    meta: { requireAuth: true },
  },
  {
    path: '/tohelpothers',
    name: 'tohelpothers',
    component: tohelpothers,
    meta: { requireAuth: true },
  },
  {
    path: '/personalcenter',
    name: 'personalcenter',
    component: personalcenter,
    children: [
      {
        path: '/info',
        name: 'info',
        component: info,
      },
      {
        path: '/changePwd',
        name: 'changePwd',
        component: changePwd,
      },
      {
        path: '/myhelp',
        name: 'myhelp',
        component: myhelp,
      },
      {
        path: '/helpOrder',
        name: 'helpOrder',
        component: helpOrder,
      },
    ],
  },
  //地摊注册路由####
  {
    path: '/boothRegister',
    name: 'boothRegister',
    component: boothRegister,
    meta: { requireAuth: true },
  },
  //地摊登录路由####
  {
    path: '/boothLogin',
    name: 'boothLogin',
    component: boothLogin,
  },
  //地毯信息显示路由
  {
    path: '/boothManage',
    name: 'boothMange',
    component: boothManage,
    meta: { requireAuth: true },
  },
  {
    path: '/boothHandle/:shop_id',
    name: 'boothHandle',
    component: boothHandle,
  },
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/shop' : '/',
  routes,
})
export default router

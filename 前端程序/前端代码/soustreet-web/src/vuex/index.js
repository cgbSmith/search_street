import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultInfo = {
  nickname: '',
}
const store = new Vuex.Store({
  state: {
    isLogin: false,
    userInfo: defaultInfo,
    token: '',
  },
  getters: {},
  mutations: {
    setLogin(state, bool) {
      state.isLogin = bool
    },
    login(state, userInfo) {
      state.isLogin = true
      state.userInfo = userInfo
      localStorage.setItem('isLogin', 'true')
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    logout(state) {
      state.token = ''
      state.isLogin = false
      localStorage.setItem('isLogin', '')
      localStorage.setItem('userInfo', defaultInfo)
    },
  },
  actions: {},
})
export default store

import axios from 'axios'
import router from './router'
import Element from 'element-ui'
// axios.defaults.baseURL = 'http://127.0.0.1:3007'
const request = axios.create({
  timeout: 5000,
  baseURL: 'http://127.0.0.1:3007',
  // headers: {
  //   'Content-Type': 'application/json;charset=UTF-8',
  // },
})

request.interceptors.request.use((config) => {
  config.headers['Authorization'] = localStorage.getItem('token')
  return config
})

request.interceptors.response.use(
  (response) => {
    console.log('response ->' + response)

    let res = response.data
    console.log(response.data)
    if (res.status === 0) {
      return response
    } else {
      Element.Message.error(!res.message ? '系统异常' : res.message)
      return Promise.reject(response.data.message)
    }
  },
  (error) => {
    console.log(error)

    if (error.response.data) {
      error.massage = error.response.data.message
    }

    // if (error.response.status === 401) {
    //   router.push('/login')
    // }

    Element.Message.error(error.massage, { duration: 2000 })
    return Promise.reject(error)
  }
)

export default request

import axios from 'axios';
import store from '../vuex/index';

//环境的切换
// if (process.env.NODE_ENV == 'development') {    
//   axios.defaults.baseURL = 'https://mock.presstime.cn/mock/61a6de7dab2fd300162cca58/api';} 
// else if (process.env.NODE_ENV == 'debug') {    
//   axios.defaults.baseURL = 'https://mock.presstime.cn/mock/61a6de7dab2fd300162cca58/api';
// } 
// else if (process.env.NODE_ENV == 'production') {    
//   axios.defaults.baseURL = 'https://mock.presstime.cn/mock/61a6de7dab2fd300162cca58/api';
// }

// 请求超时时间
axios.defaults.timeout = 5000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// //请求拦截器
// axios.interceptors.request.use(
//   config => {
//     const token = store.state.token;
//     token && (config.headers.Authorization = token);
//     return config;
//   },
//   error => {
//     return Promise.error(error);
//   }
// )

// //响应拦截器
// axios.interceptors.response.use(
//   response => {
//     if(response.status === 200) {
//       return Promise.resolve(response);
//     } else {
//       return Promise.reject(response);
//     }
//   },
//   error => {
//     if(error.response.status) {
//       switch(error.response.status) {
//         //401未登录
//         case 401:
//           break;
//       }
//     }
//   }
// )
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params){    
  return new Promise((resolve, reject) =>{        
    axios.get(url, {            
      params: params        
    })        
    .then(res => {            
      resolve(res.data);        
    })        
    .catch(err => {            
      reject(err.data)        
    })    
  });
}
/** 
* post方法，对应post请求 
* @param {String} url [请求的url地址] 
* @param {Object} params [请求时携带的参数] 
*/
export function post(url, params) {    
  return new Promise((resolve, reject) => {         
    axios.post(url, QS.stringify(params))        
    .then(res => {            
      resolve(res.data);        
    })        
    .catch(err => {            
      reject(err.data)        
    })    
  });
}


import {Message} from 'iview'
var axios = require('axios')

axios.interceptors.response.use(
  res => {
    debugger
    return res
  },
  err => {
    debugger
    // console.log(err.code)
    // console.log(err.message)
    // console.log(err.config)
    if (err.response.status === 400) {
      localStorage.clear()
      Message.info({
        content: '用户名或者密码错误！',
        duration: 10,
        closable: true
      })
      this.$router.replace({
        path: '/login'
      })
    } else if (err.response.status === 401) {
      localStorage.clear()
      Message.info({
        content: '登录信息失效，请重新登录！',
        duration: 10,
        closable: true
      })
      this.$router.replace({
        path: '/login'
      })
    }
    return Promise.reject(err)
  }
)

// 本地
var root = 'http://127.0.0.1:8082/supervision'
// 服务器
// var root = 'http://241514e6c9.wicp.vip:33846/supervision'
export default{
  get: function (url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: url,
        headers: {
          'JWTToken': localStorage.getItem('jwtToken')
        },
        params: params,
        baseURL: root,
        withCredentials: true
      }).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  put: function (url, params) {
    return new Promise((resolve, reject) => {
      // 设置超时时间
      // axios.defaults.retry = 4
      // axios.defaults.retryDelay = 1000
      // axios.defaults.timeout = 20000
      // 添加请求拦截器
      axios({
        method: 'PUT',
        url: url,
        headers: {
          'JWTToken': localStorage.getItem('jwtToken'),
          'Content-Type': 'application/json; charset=utf-8'
        },
        data: params,
        baseURL: root,
        withCredentials: true
      }).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  delete: function (url, params) {
    return new Promise((resolve, reject) => {
      // 设置超时时间
      // axios.defaults.retry = 4
      // axios.defaults.retryDelay = 1000
      // axios.defaults.timeout = 20000
      // 添加请求拦截器
      axios({
        method: 'DELETE',
        url: url,
        headers: {
          'JWTToken': localStorage.getItem('jwtToken'),
          'Content-Type': 'application/json; charset=utf-8'
        },
        params: params,
        baseURL: root,
        withCredentials: true
      }).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  post: function (url, params) {
    return new Promise((resolve, reject) => {
      debugger
      // 设置超时时间
      // axios.defaults.retry = 4
      // axios.defaults.retryDelay = 1000
      // axios.defaults.timeout = 20000
      // 添加请求拦截器
      axios({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: params,
        transformRequest: [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        baseURL: root,
        withCredentials: true
      }).then((res) => {
        if (this.setToken(res)) {
          resolve(res)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  postForm: function (url, params) {
    return new Promise((resolve, reject) => {
      debugger
      // 设置超时时间
      // axios.defaults.retry = 4
      // axios.defaults.retryDelay = 1000
      // axios.defaults.timeout = 20000
      // 添加请求拦截器
      axios({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        data: params,
        baseURL: root,
        withCredentials: true
      }).then((res) => {
        if (this.setToken(res)) {
          resolve(res)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  setToken (res) {
    if (res.status === 200) {
      var token = res.data
      if (token.access_token !== '' && token.access_token !== undefined) {
        localStorage.setItem('jwtToken', token.access_token)
        localStorage.setItem('refreshToken', token.refresh_token)
      }
      return true
    } else {
      return false
    }
  }
}

var axios = require('axios')

axios.interceptors.response.use((res) => {
  debugger
  console.log(res)
  // token 已过期，重定向到登录页面
  if (res.date.code === 401) {
    localStorage.clear()
    this.$router.replace({
      path: '/login'
    })
  }
  return res
}, function (err) {
  return Promise.reject(err)
})

// 本地
// var root = 'https://localhost:8080/auth'
// 服务器
var root = 'http://241514e6c9.wicp.vip:33846/supervision'
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
        debugger
        if (this.setToken(res)) {
          resolve(res)
          alert('接口返回成功')
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  setToken (res) {
    console.log(res)
    if (res.status === 200) {
      var token = res.data
      if (token !== null && token !== '' && token !== undefined) {
        localStorage.setItem('jwtToken', token.access_token)
        return true
      }
    } else {
      return false
    }
  }
}

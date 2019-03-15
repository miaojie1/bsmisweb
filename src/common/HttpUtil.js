var axios = require('axios')
// 本地
var root = 'http://localhost:8080'
// var root = 'http://192.168.0.103:8080'
// 服务器
// var root = 'http://192.168.248.156:8199/aprilcode-selfhelp/'
// 外网
// var root = 'http://hcm.pansoft.com/snape-mobile/'
function httpApi (method, url, params, that) {
  return new Promise((resolve, reject) => {
    // 设置超时时间
    axios.defaults.retry = 4
    axios.defaults.retryDelay = 1000
    axios.defaults.timeout = 20000
    // 添加请求拦截器
    axios.interceptors.request.use(config => {
      // 在发送请求之前做些什么
      return config
    }, error => {
      // this.$Message.warning('请求超时！')
      // 对请求错误做些什么
      return Promise.reject(error)
    })
    axios.interceptors.response.use(data => {
      if (data.status !== 200) {
        // MessageBox({
        //   title: '错误',
        //   message: data.data.msg,
        //   showCancelButton: true
        // })
      }
      return data
    }, error => {
      if (error.response.status === 504 || error.response.status === 404) {
        // this.$Message.warning('服务器被吃了⊙﹏⊙∥ ')
      }
      // 对请求错误做些什么
      return error
    })
    axios({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      baseURL: root,
      withCredentials: true
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
        // that.$message('请求超时！')
      } else {
        // that.$message('请求出错了！')
      }
      reject(err)
    })
  })
}
export default{
  get: function (url, params) {
    return httpApi('GET', url, params)
  },
  post: function (url, params) {
    return httpApi('POST', url, params)
  },
  put: function (url, params) {
    return httpApi('PUT', url, params)
  },
  delete: function (url, params) {
    return httpApi('DELETE', url, params)
  }
}

import axios from 'axios'
var SM = {
  serverUrl: '127.0.0.1', // ...接口地址
  userName: null, // 用户名
  passWord: null, // 密码
  JWTToken: null,
  userId: null,
  sessionId: null,
  token: null,
  setuserName: function () {
    this.userName = localStorage.getItem('userName')
  },
  setpassWord: function () {
    this.passWord = localStorage.getItem('passWord')
  },
  setToken: function () {
    this.JWTToken = localStorage.getItem('jwtToken')
  },
  setSessionId: function () {
    this.sessionId = localStorage.getItem('sessionId')
  },
  vCode: function (res) { // 检验code是否成功
    console.log(res)
    if (res.data.code === 200) {
      var token = res.data.token
      if (token !== null && token !== undefined && token !== '') {
        localStorage.setItem('jwtToken', token.jwtToken)
      }
      return true
    } else {
      token = res.data.token
      if (token !== null && token !== undefined && token !== '') {
        localStorage.setItem('jwtToken', token.jwtToken)
      }
      return false
    }
  },
  post: function (url, data, success, errors) {
    axios({
      method: 'POST',
      // url: this.serverUrl + url,
      url: 'https://127.0.0.1:8080/auto/oauth/token',
      headers: {
        'JWTToken': localStorage.getItem('jwtToken')
      },
      withCredentials: true,
      data: {
        'requestBody': data
      }
    }).then(function (res) { // 接口返回成功
      if (SM.vCode(res)) { // 接口成功
        if (success) {
          success.call(this, res, true)
        }
      } else { // 接口报错
        if (errors) errors.call(this, res, true)
      }
    }).catch(function (e) { // 网络出错
      if (errors) errors.call(this, e)
    })
  },
  get: function (url, success, error) {
    axios({
      method: 'GET',
      url: url,
      // url: 'http://127.0.0.1:8080/auto/oauth/token',
      // url: this.serverUrl + url,
      headers: {
        'JWTToken': localStorage.getItem('jwtToken')
      },
      withCredentials: true
    }).then(function (res) { // 接口返回成功
      if (SM.vCode(res)) { // 接口成功
        if (success) success.call(this, res, true)
      } else { // 接口报错
        if (error) error.call(this, res, true)
      }
    }).catch(function (e) { // 网络出错
      if (error) error.call(this, e)
    })
  },
  test () {
    alert('这是测试！')
  }
}
SM.setuserName()
SM.setpassWord()
SM.setToken()
export default SM

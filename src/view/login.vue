<template>
  <div class="container">
    <Form ref="loginForm" class="loginForm" :model="loginForm" :rules="rules">
      <span class="loginText">用户登录</span>
      <FormItem prop="username">
        <Input type="text" prefix="ios-contact" v-model="loginForm.username" placeholder="用户名" />
      </FormItem>
      <FormItem prop="password">
        <Input type="password" prefix="ios-lock-outline" v-model="loginForm.password" placeholder="密码" />
      </FormItem>
      <FormItem>
        <Button @click="handleCancel('loginForm')" style="margin-right: 20px">取消</Button>
        <Button type="primary" @click="handleSubmit('loginForm')">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // var data = {
          //   username: this.loginForm.username,
          //   password: this.loginForm.password,
          //   grant_type: 'password',
          //   scope: 'all',
          //   client_id: 'xinguan',
          //   client_secret: 'admin123'
          // }
          var url = '/oauth/token?username=' + this.loginForm.username + '&password=' + this.loginForm.password + '&grant_type=password&client_id=xinguan&client_secret=admin123'
          this.$http.post(url).then(res => {
            if (this.$http.setToken(res)) {
              this.$Message.success('登录成功!')
              this.$router.push('/home')
            }
          })
        } else {
          this.$Message.error('登录失败!')
        }
      })
    },
    handleCancel (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
<style>
.container {
  width: 100% !important;
  height: 100% !important;
  /* background-image: url('../assets/loginbg.png'); */
}
.loginForm .ivu-form .ivu-form-label-right {
  background-image: url('../assets/loginbg.png');
}
.loginForm {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 20px 30px 20px 30px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  text-align: center;
}
.loginText {
  display: block;
  font: 16px bolder;
  margin-bottom: 20px
}
</style>

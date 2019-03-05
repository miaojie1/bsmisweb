<template>
  <i-form ref="loginForm" class="loginForm" :model="loginForm" :rules="rules">
    <span class="loginText">用户登录</span>
    <i-form-item prop="username">
      <i-input type="text" prefix="ios-contact" v-model="username" placeholder="用户名" />
    </i-form-item>
    <i-form-item prop="password">
      <i-input type="password" prefix="ios-lock-outline" v-model="password" placeholder="密码" />
    </i-form-item>
    <i-form-item>
      <i-button @click="handleCancel('loginForm')" style="margin-right: 20px">取消</i-button>
      <i-button type="primary" @click="handleSubmit('loginForm')">登录</i-button>
    </i-form-item>
  </i-form>
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
          this.$Message.success('登录成功!')
        } else {
          this.$Message.error('登录失败!')
        }
      })
    }
  }
}
</script>
<style scoped>
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
}
.ivu-input-wrapper {
  margin-bottom: 1rem
}
.loginText {
  display: block;
  font: 16px bold;
  margin-bottom: 1rem
}
</style>

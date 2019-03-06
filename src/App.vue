<template>
  <div id="app" ref="container">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
  // data () {
  //   return {
  //     clientHeight: ''
  //   }
  // },
  // mounted () {
  //   this.initHeight()
  // },
  // watch: {
  //   // 如果 `clientHeight` 发生改变，这个函数就会运行
  //   clientHeight: function () {
  //     this.changeFixed(this.clientHeight)
  //   }
  // },
  // methods: {
  //   // 动态修改样式
  //   changeFixed (clientHeight) {
  //     this.$refs.container.style.height = clientHeight + 'px'
  //     console.log(this.$refs.container.style.height)
  //   },
  //   initHeight () {
  //     // 获取浏览器可视区域高度
  //     this.clientHeight = document.body.clientHeight
  //     window.onresize = () => {
  //       // 当窗口或框架发生改变时触发
  //       this.clientHeight = document.body.clientHeight
  //     }
  //   }
  // }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>

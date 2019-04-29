<template>
  <div>
    <btn-manage :buttonList="buttonList"></btn-manage>
  </div>
</template>

<script>
import btnManage from '../../components/btnManage'
export default {
  data () {
    return {
      buttonList: []
    }
  },
  created () {
    console.log('用户管理')
    // console.log(this.$route.params.operation)
    localStorage.setItem('operation', JSON.stringify(this.$route.params.operation))
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
  },
  components: {
    btnManage
  }
}
</script>

<style>

</style>

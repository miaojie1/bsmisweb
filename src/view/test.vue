<template>
  <div>
    <btn-manage :buttonList="btnlist"></btn-manage>
  </div>
</template>
<script>
import btnManage from '@/components/btnManage'
export default {
  data () {
    return {
      btnlist: [
        {
          buttonid: 'editbtn'
        }, {
          buttonid: 'deletebtn'
        }
      ]
    }
  },
  components: {
    btnManage
  }
}
</script>

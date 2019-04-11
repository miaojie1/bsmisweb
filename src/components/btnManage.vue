<template>
  <div class="btnContainer">
    <Button type="primary" id="addbtn" v-show="addbtn">增加</Button>
    <Button type="primary" id="editbtn" v-show="editbtn">修改</Button>
    <Button type="primary" id="deletebtn" v-show="deletebtn">删除</Button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addbtn: false,
      editbtn: false,
      deletebtn: false
    }
  },
  props: ['buttonList'],
  created () {
    this.showBtn(this.buttonList)
  },
  methods: {
    showBtn (buttonList) {
      buttonList.forEach(element => {
        if (element.buttonid === 'addbtn') {
          this.addbtn = true
        } else if (element.buttonid === 'editbtn') {
          this.editbtn = true
        } else if (element.buttonid === 'deletebtn') {
          this.deletebtn = true
        }
      })
    }
  },
  watch: {
    buttonList (value) {
      this.showBtn(value)
    }
  }
}
</script>

<style>

</style>

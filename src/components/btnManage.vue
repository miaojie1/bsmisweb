<template>
  <div class="btnContainer">
    <Button type="primary" id="addBtn" v-show="addBtn" @click="add">增加</Button>
    <Button type="primary" id="editBtn" v-show="editBtn" @click="edit">修改</Button>
    <Button type="primary" id="deleteBtn" v-show="deleteBtn" @click="remove">删除</Button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addBtn: false,
      editBtn: false,
      deleteBtn: false
    }
  },
  props: ['buttonList'],
  created () {
    this.showBtn(this.buttonList)
  },
  methods: {
    // 根据父组件的传值来确定用户的按钮权限
    showBtn (buttonList) {
      buttonList.forEach(element => {
        var str = element.buttonId
        if (str.toUpperCase().indexOf('AddBtn'.toUpperCase()) >= 0) {
          this.addBtn = true
        } else if (str.toUpperCase().indexOf('EditBtn'.toUpperCase()) >= 0) {
          this.editBtn = true
        } else if (str.toUpperCase().indexOf('DelBtn'.toUpperCase()) >= 0 || str.toUpperCase().indexOf('BatchDel'.toUpperCase()) >= 0) {
          this.deleteBtn = true
        }
      })
    },
    /**
     * 调用父子间的增加，修改，删除方法
     */
    add () {
      this.$parent.add()
    },
    edit () {
      this.$parent.edit()
    },
    remove () {
      this.$parent.remove()
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

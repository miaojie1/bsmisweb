<template>
  <div class="btnContainer">
    <Button type="primary" size="small" id="addBtn" v-show="addBtn" @click="add">增加</Button>
    <Button type="primary" size="small" id="editBtn" v-show="editBtn" @click="edit">修改</Button>
    <Button type="error" size="small" id="deleteBtn" v-show="deleteBtn" @click="remove">删除</Button>
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
        if (element.buttonId === 'addBtn') {
          this.addBtn = true
        } else if (element.buttonId === 'editBtn') {
          this.editBtn = true
        } else if (element.buttonId === 'deleteBtn' || element.buttonId === 'batchDel' || element.buttonId === 'delBtn') {
          this.deleteBtn = true
        }
      })
    },
    /**
     * 调用父子间的增加，修改，删除方法
     */
    add () {
      this.$parent.add()
      // this.$emit('add')
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

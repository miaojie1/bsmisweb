<template>
  <div>
    <btn-manage :buttonList="buttonList"></btn-manage>
    <Table border :columns="columns" :data="studentLists" style="margin-top: 30px" size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="update(index)">编辑</Button>
        <Button type="error" size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
  </div>
</template>

<script>
import btnManage from '../../components/btnManage'
export default {
  data () {
    return {
      buttonList: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '密码',
          key: 'passWord'
        },
        {
          title: '学号',
          key: 'stuNum'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ]
    }
  },
  created () {
    console.log('菜单管理')
    // console.log(this.$route.query.operation)
    console.log(this.$route.params.operation)
    localStorage.setItem('operation', JSON.stringify(this.$route.params.operation))
    // console.log(JSON.parse(localStorage.getItem('operation')))
    // this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    // this.getMenuPage()
  },
  methods: {
    add () {
      alert('zengjia')
    },
    getMenuPage () {
      let url = '/menu/listMenuPage'
      let data = {
        pageNo: '1',
        pageSize: '10',
        access_token: localStorage.getItem('jwtToken')
      }
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          // this.menuData = res.data
          // this.$Spin.hide()
        }
      })
    }
  },
  components: {
    btnManage
  }
}
</script>

<style>
</style>

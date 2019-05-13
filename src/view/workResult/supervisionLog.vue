<template>
  <div>
    <Row>
      <Select v-model="selectedName" style="width:200px">
        <Option v-for="item in employeeList" :value="item.username" placeholder="选择用户" :key="item.value">{{ item.username }}</Option>
      </Select>
      <Button type="primary" @click="addSupLog">测试监理日志</Button>
    </Row>
    <Table
      border
      highlight-row
      ref="supLogTable"
      :columns="columns"
      :data="supLogData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <!-- <Button type="primary" size="small" style="margin-right: 1px" @click="edit(row, index)">编辑</Button> -->
        <Button type="error" size="small" @click="remove(row, index)">删除</Button>
        <Button type="success" size="small" @click="showDetails(row,index)">详情</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          show-sizer
          :total="dataTotal"
          :current="pageNo+1"
          :page-size="pageSize"
          :page-size-opts=[5,10,15]
          @on-change="changePageNo"
          @on-page-size-change="changePageSize"
          ></Page>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      supLogData: [],
      employeeList: [],
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      fileName: '',
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 50
        },
        {
          title: '日期',
          key: 'date',
          width: 130
        },
        {
          title: '监理工程师',
          key: 'supervisionEngineer',
          render: (h, params) => {
            const employee = params.row.supervisionEngineer
            return h('span', employee.username)
          }
        },
        {
          title: '职位',
          key: 'position'
        },
        {
          title: '操作',
          slot: 'action',
          width: 220,
          fixed: 'right'
        }
      ],
      selectedName: ''
    }
  },
  created: function () {
    this.getsupLogDataList()
  },
  methods: {
    addSupLog () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/superLogJob/addSupLogForTest'
      this.$http.post(url, data).then(res => {
        if (res.data.status === true) {
          this.getsupLogDataList()
        }
      })
    },
    getsupLogDataList () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      let url = '/superLogJob/listSupervisionLogByPage'
      // let url = '/superLogJob/listSupervisionLogByPage?access_token=' + localStorage.getItem('jwtToken') + '&pageSize=' + this.pageSize + '&pageNo=' + this.pageNo + '&name=' + this.fileName
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.supLogData = res.data.content
          this.dataTotal = res.data.totalElements
        }
      })
    },
    getEmployeeList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/employee/listAllEmployees'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.employeeList = res.data.data
        }
      })
    },
    // 分页
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    }
  },
  watch: {
    pageNo: function () {
      this.getsupLogDataList()
    },
    pageSize: function () {
      this.getsupLogDataList()
    }
  }
}
</script>

<style>

</style>

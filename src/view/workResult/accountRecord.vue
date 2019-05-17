<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" clearable placeholder="输入标题名称查询" v-model="title"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="accountRecordTable"
      :columns="columns"
      :data="accountRecordData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px" @click="showDetails(row, index)">查看</Button>
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
      accountRecordData: [],
      employeeList: [],
      projectList: [],
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      title: '',
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 50
        },
        {
          title: '所属类别',
          key: 'accountCategory',
          render: (h, params) => {
            const category = params.row.accountCategory
            return h('span', category.name)
          }
        },
        {
          title: '记录标题',
          key: 'recordName'
        },
        {
          title: '所属部门',
          key: 'department',
          render: (h, params) => {
            const department = params.row.department
            return h('span', department.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 100,
          fixed: 'right'
        }
      ],
      formData: {},
      // 校验规则
      ruleValidate: {
        title: [
          {
            required: true, message: '不可以为空', trigger: 'blur'
          }
        ],
        quantity: [
          {required: true, message: '不可以为空', trigger: 'blur'}
        ],
        standard: [
          {required: true, message: '不可以为空', trigger: 'blur'}
        ]
      },
      selectedName: '',
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false,
      currentProjectName: '',
      currentRank: 0,
      currentEmplId: 0
    }
  },
  created: function () {
    this.getAccountRecordDataList()
    const departmentPosition = JSON.parse(localStorage.getItem('currentUser')).departmentPosition
    this.currentEmplId = JSON.parse(localStorage.getItem('currentUser')).id
    this.currentRank = departmentPosition.rank
    // this.getEmployeeList()
  },
  methods: {
    search () {
      this.pageNo = 0
      this.pageSize = 5
      this.getAccountRecordDataList()
    },
    getAccountRecordDataList () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        title: this.title
      }
      let url = '/accountRecord/listAccRecordsByTitle'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.accountRecordData = res.data.content
          this.dataTotal = res.data.totalElements
        }
      })
    },
    showDetails (row, index) {
      debugger
      let category = row.accountCategory
      this.$router.push({
        name: category.name
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
      this.getAccountRecordDataList()
    },
    pageSize: function () {
      this.getAccountRecordDataList()
    },
    selectedName: function () {
      this.getAccountRecordDataList()
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <Row>
      <center>
        <h2>监理日志信息</h2>
      </center>
      <div style="margin-top:20px">
        <Row :gutter="16">
          <i-col span="8">
            日志日期：
            {{logDate}}
          </i-col>
          <i-col span="8">
            监理工程师：
            {{logName}}
          </i-col>
          <i-col span="6">
            职位:
            {{logPositoin}}
          </i-col>
          <i-col span="2">
            <div @click="goBack" id="backBtn">
              <Icon type="md-arrow-round-up" size="25"/>
              <font>Back</font>
            </div>
          </i-col>
        </Row>
      </div>
    </Row>
    <Table
      border
      highlight-row
      ref="supLogTable"
      :columns="columns"
      :data="supLogRecordData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="error" size="small" @click="remove(row, index)">删除</Button>
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
      <Modal
      v-model="showDeleteModal"
      width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提醒</span>
      </p>
      <div style="text-align:center">
        <p>删除后将不可恢复</p>
        <p>您确认删除?</p>
      </div>
      <div slot="footer">
        <Button type="error" @click="confirmDelete()">删除</Button>
        <Button @click="cancelDelete()" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      supLogData: [],
      supLogRecordData: [],
      logDate: '',
      logName: '',
      logPositoin: '',
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 50
        },
        {
          title: '发生时间',
          key: 'recordDate',
          width: 130
        },
        {
          title: '对应项目',
          key: 'project',
          render: (h, params) => {
            return h('span', params.row.project.name)
          }
        },
        {
          title: '记录内容',
          key: 'recordContent'
        },
        {
          title: '操作',
          slot: 'action',
          width: 100,
          fixed: 'right'
        }
      ],
      showDeleteModal: false
    }
  },
  created: function () {
    debugger
    this.supLogData = JSON.parse(localStorage.getItem('supLog'))
    const engineer = this.supLogData.supervisionEngineer
    const position = this.supLogData.position
    if (position === null) {
      this.logPositoin = '暂无信息'
    } else {
      this.logPositoin = position.name
    }
    this.logName = engineer.username
    this.logDate = this.supLogData.date
    this.logDate = this.logDate.substring(0, 10)
    debugger
    this.getsupLogRecordDataList()
  },
  methods: {
    getsupLogRecordDataList () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      let url = '/superLogJob/listSuperLogRecordByPage'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.supLogRecordData = res.data.content
          this.dataTotal = res.data.totalElements
        }
      })
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        logRecordId: this.currentRowId
      }
      let url = '/superLogJob/deleteSupLogRecordById'
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getsupLogRecordDataList()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$Message.info('您已取消删除！')
    },
    goBack () {
      this.$router.push({
        name: '监理日志'
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
      this.getsupLogRecordDataList()
    },
    pageSize: function () {
      this.getsupLogRecordDataList()
    }
  }
}
</script>

<style>
#backBtn :hover {
  cursor: pointer;
  color: rgb(30, 138, 210);
  font-size: 15px;
}
</style>

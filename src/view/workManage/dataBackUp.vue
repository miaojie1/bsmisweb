<template>
  <div>
    <Button type="primary" @click="goBackupData">开始备份</Button>
    <Table
      border
      highlight-row
      ref="backupDataTable"
      :columns="columns"
      :data="backupData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
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
      backupData: [],
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
          title: '备份类型',
          key: 'backUpType',
          width: 110
        },
        {
          title: '备份时间',
          key: 'date',
          width: 130
        },
        {
          title: '文件路径',
          key: 'filePath'
        },
        {
          title: '文件大小',
          key: 'fileSize'
        }
      ]
    }
  },
  created: function () {
    this.getBackupDataList()
  },
  methods: {
    goBackupData () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/dataBackup'
      this.$http.post(url, data).then(res => {
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getBackupDataList()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    getBackupDataList () {
      let url = '/getDataBackupList?access_token=' + localStorage.getItem('jwtToken') + '&pageSize=' + this.pageSize + '&pageNo=' + this.pageNo + '&name=' + this.fileName
      this.$http.post(url).then(res => {
        if (res.status === 200) {
          this.backupData = res.data.content
          this.dataTotal = res.data.totalElements
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
      this.getBackupDataList()
    },
    pageSize: function () {
      this.getBackupDataList()
    }
  }
}
</script>

<style>

</style>

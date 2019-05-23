<template>
  <div>
    <Row :gutter="18">
      <i-col span="5">
        <Select style="width:200px" v-model="searchTestPaper"  @change="changeTestPaper($event)" placeholder="请选择试卷">
          <Option v-for="(item,index) in testPaperItem" :value="item.id" :key="index">{{item.testPaperName}}
          </Option>
        </Select>
      </i-col>
      <i-col span="5">
        <Select style="width:200px" v-model="searchEmployee"  @change="changeEmployee($event)" placeholder="请选择考生">
          <Option v-for="(item,index) in employeeItem" :value="item.id" :key="index">{{item.name}}
          </Option>
        </Select>
      </i-col>
      <i-col span="5">
        <Button @click="search" type="primary">查询</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="examinationRecordData"
      style="margin-top: 15px"
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
          :total="examinationRecordDataTotal"
          :current="pageNo+1"
          :page-size="pageSize"
          :page-size-opts=[5,10,15]
          @on-change="changePageNo"
          @on-page-size-change="changePageSize">
        </Page>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '考试时间',
          key: 'testDate',
          render: (h, params) => {
            const testDate = params.row.testDate
            if (testDate === null || testDate === '') {
              return h('span', '')
            } else {
              return h('span', testDate.substring(0, 10))
            }
          }
        },
        {
          title: '考生',
          key: 'candidate',
          render: (h, params) => {
            const row = params.row
            return h('span', row.candidate.name)
          }
        },
        {
          title: '考卷名称',
          key: 'testPaper',
          render: (h, params) => {
            const row = params.row
            return h('span', row.testPaper.testPaperName)
          }
        },
        {
          title: '分数',
          key: 'score'
        }
      ],
      examinationRecordData: [],
      pageNo: 0,
      pageSize: 2,
      examinationRecordDataTotal: 0,
      searchTestPaper: '',
      searchEmployee: '',
      testPaperItem: [],
      employeeItem: []
    }
  },
  methods: {
    getExaminationRecordPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        testPaperId: this.searchTestPaper,
        candidateId: this.searchEmployee
      }
      let url = '/examinationRecord/listExaminationRecord' + '/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.examinationRecordData = res.data.content
          this.examinationRecordDataTotal = res.data.totalElements
        }
      })
    },
    changeTestPaper (event) {
      this.searchTestPaper = event.target.value
    },
    changeEmployee (event) {
      this.searchEmployee = event.target.value
    },
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    },
    getCandidate () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/examinationRecord/listAllEmployees'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.employeeItem = res.data
        }
      })
    },
    getTestPaper () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/examinationRecord/listAllTestPapers'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.testPaperItem = res.data
        }
      })
    },
    search () {
      this.pageNo = 0
      this.getExaminationRecordPage()
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getTestPaper()
    this.getExaminationRecordPage()
    this.getCandidate()
  },
  watch: {
    pageNo: function () {
      this.getExaminationRecordPage()
    },
    pageSize: function () {
      this.getExaminationRecordPage()
    }
  }
}
</script>

<style>
</style>

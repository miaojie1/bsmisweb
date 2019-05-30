<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="输入内容查询" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="conferenceTable"
      :columns="columns"
      :data="conferenceData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.initiator.id && row.isSubmit === 0)"
        @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.initiator.id && row.isSubmit === 0)"
        @click="remove(row, index)">删除</Button>
        <Button type="success" size="small" @click="showFlows(row,index)">流程图</Button>
        <Button type="success" size="small"
          style="margin-right: 1px;"
          @click="writeSummary(row, index)"
          v-show="showWriter(row)">填写会议纪要</Button>
        <Button type="primary" size="small"
          style="margin-right: 1px;"
          v-show="showCheck(row)"
          @click="check(row)">审核</Button>
          <Button type="primary" size="small"
          style="margin-right: 1px;"
          v-show="showDetail(row)"
          @click="detail(row)">详情</Button>
      </template>
    </Table>
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
    <Modal
      v-model="showAddModal"
      title="新增 监理会议">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="会议内容" prop="content">
          <Input v-model="formData.content" placeholder="会议内容" />
        </FormItem>
        <FormItem label="开始时间" prop="startDate">
          <DatePicker type="datetime"
            placeholder="选择日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.startDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endDate">
          <DatePicker type="datetime"
            placeholder="选择日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.endDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project" :placeholder="currentProjectName">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="地点" prop="location">
          <Input v-model="formData.location" placeholder="地点" />
        </FormItem>
        <FormItem label="会议纪要填写人员" prop="employeeWriteList">
          <Select v-model="formData.employeeWriteList" multiple>
            <Option v-for="item in employeeList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="评述" prop="remark">
          <Input v-model="formData.remark" placeholder="评述" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdd('formData',0)">保存</Button>
        <Button type="primary" @click="confirmAdd('formData', 1)">提交</Button>
        <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showEditModal"
      title="修改 监理会议">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="会议内容" prop="content">
          <Input v-model="formData.content" placeholder="会议内容" />
        </FormItem>
        <FormItem label="开始时间" prop="startDate">
          <DatePicker type="datetime"
            placeholder="选择日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.startDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endDate">
          <DatePicker type="datetime"
            placeholder="选择日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.endDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project" :placeholder="currentProjectName">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="地点" prop="location">
          <Input v-model="formData.location" placeholder="地点" />
        </FormItem>
        <FormItem label="会议纪要填写人员" prop="employeeWriteList">
          <Select v-model="formData.employeeWriteList" :placeholder="currentEmployee" multiple>
            <Option v-for="item in employeeList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="评述" prop="remark">
          <Input v-model="formData.remark" placeholder="评述" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData', 0)">保存</Button>
        <Button type="primary" @click="confirmEdit('formData', 1)">提交</Button>
        <Button @click="cancelEdit('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
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
    <Modal
      v-model="showWriteSummary"
      title="填写会议纪要">
      <Form ref="formData" :model="formData" :label-width="100" :rules="ruleValidate">
        <FormItem label="会议纪要" prop="content">
          <Input v-model="content" placeholder="会议纪要" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmWrite('formData')">提交</Button>
        <Button @click="cancelWrite('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showMajorCheckModal"
      title="总监审核">
      <Table
      border
      highlight-row
      :columns="writeColumns"
      :data="employeeWriteData"
      style="margin-top: 15px"
      size="small">
      </Table>
      <Form ref="formData" :model="formData" :rule="checkValidate" :label-width="100" style="margin-top: 10px">
        <FormItem label="审核结果" prop="result">
          <Select v-model="checkResult">
            <Option value=true>通过</Option>
            <Option value=false>不通过</Option>
          </Select>
        </FormItem>
        <FormItem label="审核意见" prop="message">
          <Input v-model="checkMsg" placeholder="审核意见" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmCheck('formData')">提交</Button>
        <Button @click="cancelCheck('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showCheckImgModal"
      title="流程图">
      <img :src="img"/>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="showDetailModal" title="会议记录详情">
      <p>会议题目：{{detailRow.content}}</p>
      <p>开始时间：{{detailRow.startDate}}</p>
      <p>结束时间：{{detailRow.endDate}}</p>
      <p>会议地点：{{detailRow.location}}</p>
      <span>
        <p v-if="detailRow.initiator">发起人：{{detailRow.initiator.name}}</p>
        <p v-else>发起人：</p>
      </span>
      <span>
        <p v-if="detailRow.project">所属项目：{{detailRow.project.name}}</p>
        <p v-else>所属项目：</p>
      </span>
      <p>
        会议纪要填写人：
        <span v-for="(item, index) in detailRow.employeeWriteList" :key="index">{{item.username}}、</span>
      </p>
      <p v-if="detailRow.conferenceSummaryList">
        会议纪要：
        <span v-for="(item, index) in detailRow.conferenceSummaryList" :key="index">
          <p v-if="item">{{item.content}}；</p>
        </span>
      </p>
      <p v-else>会议纪要：</p>
      <p>创建时间：{{detailRow.createDate}}</p>
      <p>修改时间：{{detailRow.modificationDate}}</p>
      <p>备注：{{detailRow.remark}}</p>
      <div slot="footer">
        <Button type="primary" @click="closeDetail">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      conferenceData: [],
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 100
        },
        {
          title: '会议内容',
          key: 'content',
          width: 150
        },
        {
          title: '开始时间',
          key: 'startDate',
          width: 100
        },
        {
          title: '结束时间',
          key: 'endDate',
          width: 100
        },
        {
          title: '发起人',
          key: 'initiator',
          width: 100,
          render: (h, params) => {
            const row = params.row
            return h('span', row.initiator.name)
          }
        },
        {
          title: '填写人',
          key: 'employeeWriteList',
          width: 150,
          render: (h, params) => {
            const employee = params.row.employeeWriteList
            let name = ''
            for (let i = 0; i < employee.length; i++) {
              name += employee[i].username + '、'
            }
            return h('span', name)
          }
        },
        {
          title: '创建日期',
          key: 'createDate',
          width: 100
        },
        {
          title: '修改日期',
          key: 'modificationDate',
          width: 100
        },
        {
          title: '地点',
          key: 'location',
          width: 100
        },
        {
          title: '会议总结',
          key: 'conferenceSummaryList',
          width: 140,
          render: (h, params) => {
            const conferenceSummaryList = params.row.conferenceSummaryList
            let content = ''
            for (let i = 0; i < conferenceSummaryList.length; i++) {
              content += conferenceSummaryList[i].content + '  '
            }
            return h('span', content)
          }
        },
        {
          title: '备注',
          key: 'remark',
          width: 100
        },
        {
          title: '状态',
          key: 'isSubmit',
          width: 140,
          render: (h, params) => {
            const Row = params.row
            const color = Row.isSubmit === 0 ? 'default' : 'success'
            const text = Row.isSubmit === 0 ? '未提交' : '已提交'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          width: 100
        },
        {
          title: '操作',
          slot: 'action',
          width: 250,
          fixed: 'right'
        }
      ],
      formData: {},
      employeeList: [],
      conferenceSummaryListItem: [],
      ruleValidate: {
        content: [
          {
            required: true, message: '不可以为空', trigger: 'blur'
          }
        ],
        location: [
          {
            required: true, message: '不可以为空', trigger: 'blur'
          }
        ]
      },
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      searchData: '',
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      currentRowId: '',
      currentRank: '',
      currentEmplId: 0,
      currentEmpl: {},
      startEndTime: '',
      showSetEmplModal: false,
      // 所有项目
      projectList: [],
      showWriteSummary: false,
      taskId: '',
      employeeWriteData: [],
      writeColumns: [
        {
          title: '填写人员',
          key: 'employee',
          width: 100,
          render: (h, params) => {
            const employee = params.row.employee
            return h('span', employee.username)
          }
        },
        {
          title: '会议纪要',
          key: 'content',
          width: 285
        },
        {
          title: '填写时间',
          key: 'createDate',
          width: 150
        }
      ],
      showMajorCheckModal: false,
      // 审核结果
      checkResult: '',
      // 审核意见
      checkMsg: '',
      // 会议纪要
      content: '',
      showCheckImgModal: false,
      showDetailModal: false,
      detailRow: ''
    }
  },
  created () {
    this.getConference()
    this.getAllEmployees()
    this.getProjectList()
    this.getAllConferenceSummary()
    this.currentEmpl = JSON.parse(localStorage.getItem('currentUser'))
    this.currentEmplId = JSON.parse(localStorage.getItem('currentUser')).id
    const departmentPosition = JSON.parse(localStorage.getItem('currentUser')).departmentPosition
    this.currentRank = departmentPosition.rank
  },
  methods: {
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    search () {
      this.pageSize = 5
      this.pageNo = 0
      this.getConference()
    },
    changestartEndTime (val, value) {
      this.formData.startDate = val[0]
      this.formData.endDate = val[1]
    },
    handleClearDate () {
      this.formData.startDate = ''
      this.formData.endDate = ''
    },
    getConference () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        content: this.searchData
      }
      let url = '/conference/listConferencePage/pageSize/' + this.pageSize + '/pageNo/' + this.pageNo
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.conferenceData = res.data.content
          this.dataTable = res.data.totalElements
        }
      })
    },
    getAllEmployees () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/conference/listAllEmployees'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.employeeList = res.data
        }
      })
    },
    getProjectList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/conference/listAllProjects'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
        }
      })
    },
    getAllConferenceSummary () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/conference/listAllConferenceSummary'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.conferenceSummaryListItem = res.data
        }
      })
    },
    confirmAdd (name, isSubmit) {
      this.formData.isSubmit = isSubmit
      if (this.formData.project === undefined || this.formData.project === null) {
        this.$Message.error('请选择所属项目！')
      } else if (this.formData.employeeWriteList === undefined || this.formData.employeeWriteList === null) {
        this.$Message.error('请选择填写会议纪要人员！')
      } else {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = '/conference/saveConference?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showAddModal = false
              if (res.data.status === true) {
                this.getConference()
                this.$Message.success(res.data.message)
                this.$refs[name].resetFields()
              } else {
                this.$refs[name].resetFields()
                this.$Message.error(res.data.message)
              }
            })
          } else {
            this.$Message.error('表单数据校验失败!')
          }
        })
      }
    },
    confirmEdit (name, isSubmit) {
      this.formData.isSubmit = isSubmit
      this.$refs[name].validate((valid) => {
        if (valid) {
          let url = '/conference/saveConference?access_token=' + localStorage.getItem('jwtToken')
          this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getConference()
              this.$Message.success(res.data.message)
              this.$refs[name].resetFields()
            } else {
              this.$refs[name].resetFields()
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('表单数据校验失败!')
        }
      })
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/conference/delete/conferenceId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getConference()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    cancelAdd () {
      this.showAddModal = false
      this.$refs.formData.resetFields()
      this.$Message.info('您已取消添加！')
    },
    cancelEdit () {
      this.showEditModal = false
      this.getConference()
      this.$Message.info('您已取消修改！')
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$Message.info('您已取消删除！')
    },
    showWriter (row) {
      if (row.needWrite) {
        return true
      }
    },
    writeSummary (row, index) {
      this.showWriteSummary = true
      this.currentRowId = row.id
      this.taskId = row.taskId
    },
    confirmWrite (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let url = '/conference/allotUserWrite'
          let data = {
            access_token: localStorage.getItem('jwtToken'),
            conferenceId: this.currentRowId,
            taskId: this.taskId,
            content: this.content
          }
          this.$http.post(url, data).then(res => {
            this.showWriteSummary = false
            if (res.data.status === true) {
              this.getConference()
              this.content = ''
              this.$refs.formData.resetFields()
              this.$Message.success(res.data.message)
            } else {
              this.$refs.formData.resetFields()
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('表单数据校验失败!')
        }
      })
    },
    cancelWrite () {
      this.showWriteSummary = false
      this.content = ''
      this.$Message.info('您已取消填写会议纪要！')
    },
    showCheck (row) {
      if (row.needAudit) {
        return true
      }
    },
    check (row) {
      this.currentRowId = row.id
      this.taskId = row.taskId
      this.employeeWriteData = row.conferenceSummaryList
      this.employeeWriteData.conference = row.content
      console.log(this.employeeWriteData)
      this.showMajorCheckModal = true
    },
    // 提交审核结果
    confirmCheck (name) {
      let url = '/conference/checkConference'
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        conferenceId: this.currentRowId,
        taskId: this.taskId,
        approved: this.checkResult,
        auditOpinion: this.checkMsg
      }
      this.$http.post(url, data).then(res => {
        this.showMajorCheckModal = false
        this.checkResult = null
        this.checkMsg = ''
        if (res.data.status === true) {
          this.getConference()
          this.$Message.success(res.data.message)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    // 取消提交审核
    cancelCheck () {
      this.showMajorCheckModal = false
      this.$Message.info('您已取消审核')
      this.checkResult = ''
      this.checkMsg = ''
    },
    showFlows (row, index) {
      let url = '/getFlowImg/' + row.processId + '?access_token=' + localStorage.getItem('jwtToken')
      this.$http.get(url).then(res => {
        this.showCheckImgModal = true
        this.img = 'data:image/png;base64,' +
          btoa(new Uint8Array(res.data).reduce((res, byte) => res + String.fromCharCode(byte), ''))
      })
    },
    // 是否显示会议记录详情按钮
    showDetail (row) {
      if (row.auditStatus === '审核通过') {
        return true
      }
    },
    detail (row) {
      this.detailRow = row
      this.showDetailModal = true
    },
    // 关闭会议记录详情窗口
    closeDetail () {
      this.showDetailModal = false
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
      this.getConference()
    },
    pageSize: function () {
      this.getConference()
    }
  }

}
</script>

<style>

</style>

<template>
    <div>
        <Row :gutter="16">
            <i-col span="8">
                <Input suffix="ios-search" placeholder="输入部位名称查询" v-model="partName"/>
            </i-col>
            <i-col span="8">
                <Button @click="search" type="primary">查询</Button>
                <Button @click="add" type="primary">添加</Button>
            </i-col>
        </Row>
        <Table
        border
        highlight-row
        ref="sideStationTable"
        :columns="columns"
        :data="sideStationData"
        style="margin-top: 30px"
        size="small">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
        <template slot="action" slot-scope="{ row, index }">
            <Button type="success" size="small" @click="showFlows(row,index)">流程图</Button>
            <Button type="primary" size="small" style="margin-right: 1px"
            v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.sponsor.id && row.isSubmit === 0)" @click="edit(row, index)">编辑</Button>
            <Button type="error" size="small"
            v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.sponsor.id && row.isSubmit === 0)" @click="remove(row, index)">删除</Button>
            <Button type="warning" size="small"
            v-show="showCheck(row)" @click="check(row)">审核</Button>
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
        v-model="showAddModal"
        title="新增 旁站">
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
                <FormItem label="部位" prop="part">
                <Input v-model="formData.part" placeholder="部位" />
                </FormItem>
                <FormItem label="所属项目" prop="project">
                <Select v-model="formData.project">
                    <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
                </Select>
                </FormItem>
                <FormItem label="简要内容" prop="brief">
                <Input v-model="formData.brief" placeholder="简要内容" />
                </FormItem>
                <FormItem label="解决问题" prop="problems">
                <Input v-model="formData.problems" placeholder="解决问题" />
                </FormItem>
                <FormItem label="旁站日期" prop="sideStationDate">
                <DatePicker format="yyyy-MM-dd" v-model="formData.sideStationDate" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="confirmAdd('formData', 0)">保存</Button>
                <Button type="primary" @click="confirmAdd('formData', 1)">提交</Button>
                <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
            </div>
        </Modal>
        <Modal
        v-model="showEditModal"
        title="编辑 旁站">
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
                <FormItem label="部位" prop="part">
                <Input v-model="formData.part" placeholder="部位" />
                </FormItem>
                <FormItem label="简要内容" prop="brief">
                <Input v-model="formData.brief" placeholder="简要内容" />
                </FormItem>
                <FormItem label="解决问题" prop="problems">
                <Input v-model="formData.problems" placeholder="解决问题" />
                </FormItem>
                <FormItem label="所属项目" prop="project">
                <Select v-model="formData.project" :placeholder="currentProject">
                    <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
                </Select>
                </FormItem>
                <FormItem label="旁站日期" prop="sideStationDate">
                <DatePicker format="yyyy-MM-dd" v-model="formData.sideStationDate" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
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
        v-model="showCheckResultModal"
        title="审核">
        <Form ref="formData" :label-width="100">
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
          <Button type="primary" @click="confirmCheck()">提交</Button>
          <Button @click="cancelCheck()" style="margin-left: 8px">取消</Button>
        </div>
      </Modal>
    </div>
</template>
<script>
export default {
  data () {
    return {
      currentProject: '',
      projectList: [],
      currentRowId: '',
      taskId: '',
      checkResult: '',
      checkMsg: '',
      currentEmplId: 0,
      // 模块显示
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showCheckResultModal: false,
      currentRank: '',
      // 分页
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      // 模糊查询
      partName: '',
      // 表格显示数据
      sideStationData: [],
      // 表单暂存（增加修改时用）
      formData: {},
      editData: {
        part: '',
        brief: '',
        problems: '',
        project: {},
        sideStationDate: ''
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 60
        },
        {
          title: '部位',
          key: 'part',
          width: 70
        },
        {
          title: '所属项目',
          key: 'project',
          width: 120,
          render: (h, params) => {
            let projec = params.row.project
            return h('span', projec.name)
          }
        },
        {
          title: '创建人',
          key: 'sponsor',
          width: 130,
          render: (h, params) => {
            let employee = params.row.sponsor
            return h('span', employee.name)
          }
        },
        {
          title: '创建日期',
          key: 'createDate',
          width: 160,
          render: (h, params) => {
            const createDate = params.row.createDate
            if (createDate === null || createDate === '') {
              return h('span', '')
            } else {
              return h('span', createDate.substring(0, 10))
            }
          }
        },
        {
          title: '旁站日期',
          key: 'sideStationDate',
          width: 150,
          render: (h, params) => {
            const sideStationDate = params.row.sideStationDate
            if (sideStationDate === null || sideStationDate === '') {
              return h('span', '')
            } else {
              return h('span', sideStationDate.substring(0, 10))
            }
          }
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          width: 120
        },
        {
          title: '审核人',
          key: 'employeeAudit',
          width: 80,
          render: (h, params) => {
            let employee = params.row.majorAudit.employee.name
            return h('span', employee)
          }
        },
        {
          title: '提交状态',
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
          title: '操作',
          slot: 'action',
          width: 223,
          fixed: 'right'
        }
      ],
      // 校验规则
      ruleValidate: {
        part: [
          {required: true, message: '不可以为空', trigger: 'blur'}
        ],
        brief: [
          {required: true, message: '不可以为空', trigger: 'blur'}
        ],
        problems: [
          {required: true, message: '不可以为空', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getProjectsList()
    this.getSideStationDataList()
    const departmentPosition = JSON.parse(localStorage.getItem('currentUser')).departmentPosition
    this.currentRank = departmentPosition.rank
    this.currentEmplId = JSON.parse(localStorage.getItem('currentUser')).id
  },
  methods: {
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    confirmAdd (name, isSubmit) {
      if (this.formData.project === undefined || this.formData.project === null) {
        this.$Message.error('请选择所属项目！')
      } else {
        this.formData.isSubmit = isSubmit
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = '/sideStation/saveSideStation?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showAddModal = false
              if (res.data.status === true) {
                this.getSideStationDataList()
                this.$Message.success(res.data.message)
              } else {
                this.$Message.error(res.data.message)
              }
            })
          } else {
            this.$Message.error('表单数据校验失败!')
          }
        })
      }
    },
    cancelAdd () {
      this.showAddModal = false
      this.$Message.info('您已取消添加！')
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
      this.formData.project = row.project
      this.currentProject = row.project.name

      this.editData.part = row.part
      this.editData.brief = row.brief
      this.editData.problems = row.problems
      this.editData.project = row.project
      this.editData.sideStationDate = row.sideStationDate
    },
    confirmEdit (name, isSubmit) {
      if (this.formData.project === undefined || this.formData.project === null) {
        this.$Message.error('请选择所属项目！')
      } else {
        this.formData.isSubmit = isSubmit
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = '/sideStation/saveSideStation?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showEditModal = false
              if (res.data.status === true) {
                this.getSideStationDataList()
                this.$Message.success(res.data.message)
              } else {
                this.$Message.error(res.data.message)
              }
            })
          } else {
            this.$Message.error('表单数据校验失败!')
          }
        })
      }
    },
    cancelEdit () {
      this.showEditModal = false
      this.$Message.info('您已取消修改！')
      this.formData.part = this.editData.part
      this.formData.brief = this.editData.brief
      this.formData.problems = this.editData.problems
      this.formData.project = this.editData.project
      this.formData.sideStationDate = this.editData.sideStationDate
    },
    remove (row, index) {
      this.showDeleteModal = true
      this.currentRowId = row.id
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        id: this.currentRowId
      }
      let url = '/sideStation/deleteSideStationById'
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getSideStationDataList()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.$Message.info('您已取消删除！')
    },
    showFlows (row, index) {
    },
    getCheckStatusList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/checkStatus/listAllCheckStatus'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.checkStatusList = res.data
        }
      })
    },
    // 判断是否显示 审核 按钮，以及“总监审核”按钮
    showCheck (row) {
      if (row.needAudit) {
        return true
      }
    },
    // 弹出审核弹框
    check (row) {
      this.showCheckResultModal = true
      this.currentRowId = row.id
      this.taskId = row.taskId
    },
    // 提交审核结果
    confirmCheck () {
      let url = '/sideStation/checkSideStation'
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        sideStationId: this.currentRowId,
        taskId: this.taskId,
        approved: this.checkResult,
        auditOpinion: this.checkMsg
      }
      this.$http.post(url, data).then(res => {
        this.showCheckResultModal = false
        if (res.data.status === true) {
          this.getSideStationDataList()
          this.$Message.success(res.data.message)
        } else {
          this.$Message.error(res.data.message)
        }
      })
      this.checkResult = ''
      this.checkMsg = ''
    },
    // 取消提交审核
    cancelCheck () {
      this.showCheckResultModal = false
      this.$Message.info('您已取消审核')
      this.checkResult = ''
      this.checkMsg = ''
    },
    search () {
      this.getSideStationDataList()
    },
    getProjectsList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/project/listAllProjects'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
        }
      })
    },
    getSideStationDataList () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        partName: this.partName
      }
      let url = '/sideStation/listSideStation/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.sideStationData = res.data.content
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
      this.getSideStationDataList()
    },
    pageSize: function () {
      this.getSideStationDataList()
    }
  }
}
</script>

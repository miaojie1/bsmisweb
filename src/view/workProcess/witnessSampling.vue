<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="输入取样名称查询" v-model="samplingName"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="witnessSamplingTable"
      :columns="columns"
      :data="witnessSamplingData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.creator.id && row.isSubmit === 0)" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.creator.id && row.isSubmit === 0)" @click="remove(row, index)">删除</Button>
        <Button type="success" size="small" @click="showFlows(row,index)">流程图</Button>
        <Button type="primary" size="small"
          style="margin-right: 1px;"
          v-show="showCheck(row)"
          @click="check(row)">审核</Button>
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
      title="新增 见证取样">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="取样名称" prop="samplingName">
          <Input v-model="formData.samplingName" placeholder="取样名称" />
        </FormItem>
        <FormItem label="取样部位" prop="location">
          <Input v-model="formData.location" placeholder="取样部位" />
        </FormItem>
        <FormItem label="数量" prop="quantity">
          <Input v-model="formData.quantity" type="number" placeholder="数量" />
        </FormItem>
        <FormItem label="规格" prop="standard">
          <Input v-model="formData.standard" placeholder="规格" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
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
      title="编辑 见证取样">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project" :placeholder="currentProjectName">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="取样名称" prop="samplingName">
          <Input v-model="formData.samplingName" placeholder="取样名称" />
        </FormItem>
        <FormItem label="取样部位" prop="location">
          <Input v-model="formData.location" placeholder="取样部位" />
        </FormItem>
        <FormItem label="数量" prop="quantity">
          <Input v-model="formData.quantity" type="number" placeholder="数量" />
        </FormItem>
        <FormItem label="规格" prop="standard">
          <Input v-model="formData.standard" placeholder="规格" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData', 0)">保存</Button>
        <Button type="primary" @click="confirmEdit('formData', 1)">提交</Button>
        <Button @click="canceEdit('formData')" style="margin-left: 8px">取消</Button>
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
      <Form ref="formData" :model="formData" :label-width="100">
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      witnessSamplingData: [],
      projectList: [],
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      samplingName: '',
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 50
        },
        {
          title: '所属项目',
          key: 'project',
          width: 100,
          render: (h, params) => {
            const project = params.row.project
            return h('span', project.name)
          }
        },
        {
          title: '取样名称',
          key: 'samplingName',
          width: 100
        },
        {
          title: '取样部位',
          key: 'location',
          width: 100
        },
        {
          title: '创建人',
          key: 'creator',
          width: 80,
          render: (h, params) => {
            const employee = params.row.creator
            return h('span', employee.name)
          }
        },
        {
          title: '所属部门',
          key: 'department',
          width: 100,
          render: (h, params) => {
            const department = params.row.department
            return h('span', department.name)
          }
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
          title: '数量',
          key: 'quantity',
          width: 50
        },
        {
          title: '规格',
          key: 'standard',
          width: 50
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          width: 100
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 100,
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
          title: '修改时间',
          key: 'modificationDate',
          width: 100,
          render: (h, params) => {
            const modificationDate = params.row.modificationDate
            if (modificationDate === null || modificationDate === '') {
              return h('span', '')
            } else {
              return h('span', modificationDate.substring(0, 10))
            }
          }
        },
        {
          title: '图像资料',
          key: 'pictureList',
          width: 100
        },
        {
          title: '审核人',
          key: 'employeeAudit',
          width: 80
        },
        {
          title: '备注',
          key: 'remark',
          width: 80
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          fixed: 'right'
        }
      ],
      formData: {},
      // 校验规则
      ruleValidate: {
        samplingName: [
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
      showCheckResultModal: false,
      currentProjectName: '',
      currentRank: 0,
      currentEmplId: 0,
      currentRowId: '',
      taskId: '',
      checkResult: '',
      checkMsg: '',
      currentEmpl: {}
    }
  },
  created: function () {
    this.getWitnessSamplingDataList()
    const departmentPosition = JSON.parse(localStorage.getItem('currentUser')).departmentPosition
    this.currentEmpl = JSON.parse(localStorage.getItem('currentUser'))
    this.currentEmplId = JSON.parse(localStorage.getItem('currentUser')).id
    this.currentRank = departmentPosition.rank
  },
  methods: {
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    search () {
      this.pageNo = 0
      this.pageSize = 5
      this.getWitnessSamplingDataList()
    },
    edit (row, data) {
      this.formData = row
      this.showEditModal = true
    },
    getWitnessSamplingDataList () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        samplingName: this.samplingName
      }
      let url = '/witnessSampling/listWitnessSamplingByDepartment'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.witnessSamplingData = res.data.content
          this.dataTotal = res.data.totalElements
          console.log(res)
        }
      })
    },
    getProjectList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/witnessSampling/listAllProjects'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
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
        id: this.currentRowId
      }
      let url = '/witnessSampling/deleteWitnessSamplingById'
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getWitnessSamplingDataList()
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    confirmAdd (name, isSubmit) {
      if (this.formData.project === undefined || this.formData.project === null) {
        this.$Message.error('请选择所属项目！')
      } else {
        this.formData.isSubmit = isSubmit
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = '/witnessSampling/saveWitnessSampling?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showAddModal = false
              if (res.data.status === true) {
                this.getWitnessSamplingDataList()
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
      if (this.formData.project === undefined || this.formData.project === null) {
        this.$Message.error('请选择所属项目！')
      } else {
        this.$refs[name].validate((valid) => {
          this.formData.isSubmit = isSubmit
          if (valid) {
            let url = '/witnessSampling/saveWitnessSampling?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showEditModal = false
              if (res.data.status === true) {
                this.getWitnessSamplingDataList()
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
    cancelAdd () {
      this.showAddModal = false
      this.$refs.formData.resetFields()
      this.$Message.info('您已取消添加！')
    },
    cancelEdit () {
      this.showEditModal = false
      this.$refs.formData.resetFields()
      this.$Message.info('您已取消修改！')
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$Message.info('您已取消删除！')
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
    confirmCheck (name) {
      let url = '/witnessSampling/checkWitnessSampling'
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        witnessSamplingId: this.currentRowId,
        taskId: this.taskId,
        approved: this.checkResult,
        auditOpinion: this.checkMsg
      }
      this.$http.post(url, data).then(res => {
        this.showCheckResultModal = false
        if (res.data.status === true) {
          this.getWitnessSamplingDataList()
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
    showFlows (row, index) {
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
      this.getWitnessSamplingDataList()
    },
    pageSize: function () {
      this.getWitnessSamplingDataList()
    },
    selectedName: function () {
      this.getWitnessSamplingDataList()
    }
  }
}
</script>

<style>

</style>

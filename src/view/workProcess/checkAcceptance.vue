<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="输入检查验收内容查询" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="checkAcceptanceTable"
      :columns="columns"
      :data="checkAcceptanceData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.creater.id && row.isSubmit === 0)" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.creater.id && row.isSubmit === 0)" @click="remove(row, index)">删除</Button>
        <Button type="success" size="small" @click="showFlows(row,index)">流程图</Button>
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
    <Modal v-model="showAddModal" title="新增 检查验收">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="验收名称" prop="acceptanceName">
          <Input v-model="formData.acceptanceName" placeholder="验收名称" />
        </FormItem>
        <FormItem label="部位" prop="part">
          <Input v-model="formData.part" placeholder="部位" />
        </FormItem>
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="验收时间" prop="receptionDate">
          <DatePicker type="datetime"
            placeholder="选择日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.receptionDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="部位" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdd('formData',0)">保存</Button>
        <Button type="primary" @click="confirmAdd('formData', 1)">提交</Button>
        <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal v-model="showEditModal" title="修改 检查验收">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="验收名称" prop="acceptanceName">
          <Input v-model="formData.acceptanceName" placeholder="验收名称" />
        </FormItem>
        <FormItem label="部位" prop="part">
          <Input v-model="formData.part" placeholder="部位" />
        </FormItem>
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="验收时间" prop="receptionDate">
          <DatePicker type="datetime"
            placeholder="选择日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.receptionDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="部位" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData',0)">保存</Button>
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
    <Modal
      v-model="showCheckImgModal"
      title="流程图">
      <img :src="img"/>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checkAcceptanceData: [],
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 100
        },
        {
          title: '验收名称',
          key: 'acceptanceName',
          width: 100
        },
        {
          title: '部位',
          key: 'part',
          width: 100
        },
        {
          title: '创建人',
          key: 'creater',
          width: 100,
          render: (h, params) => {
            const row = params.row
            return h('span', row.creater.name)
          }
        },
        {
          title: '所属项目',
          key: 'project',
          width: 100,
          render: (h, params) => {
            const row = params.row
            return h('span', row.project.name)
          }
        },
        {
          title: '验收时间',
          key: 'receptionDate',
          width: 100
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 100
        },
        {
          title: '修改时间',
          key: 'modificationDate',
          width: 100
        },
        {
          title: '备注',
          key: 'remark',
          width: 100
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
          title: '版本',
          key: 'version',
          width: 100
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          width: 100
        },
        {
          title: '操作',
          slot: 'action',
          width: 220,
          fixed: 'right'
        }
      ],
      ruleValidate: {
        acceptanceName: [
          {
            required: true, message: '不可以为空', trigger: 'blur'
          }
        ],
        part: [
          {
            required: true, message: '不可以为空', trigger: 'blur'
          }
        ]
      },
      formData: {},
      projectList: [],
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      searchData: '',
      currentEmpl: '',
      currentEmplId: '',
      currentRank: '',
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showCheckResultModal: false,
      checkResult: '',
      checkMsg: '',
      taskId: '',
      currentRowId: '',
      showCheckImgModal: false
    }
  },
  created () {
    this.getCheckAcceptance()
    this.getProjectList()
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
      this.getCheckAcceptance()
    },
    getCheckAcceptance () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        acceptanceName: this.searchData
      }
      let url = '/checkAcceptance/listCheckAcceptancePage'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.checkAcceptanceData = res.data.content
          this.dataTotal = res.data.totalElements
        }
      })
    },
    getProjectList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/checkAcceptance/listAllProjects'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
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
            let url = '/checkAcceptance/saveCheckAcceptance?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showAddModal = false
              if (res.data.status === true) {
                this.getCheckAcceptance()
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
        this.formData.isSubmit = isSubmit
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = '/checkAcceptance/saveCheckAcceptance?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showEditModal = false
              if (res.data.status === true) {
                this.getCheckAcceptance()
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
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/checkAcceptance/delete/checkAcceptanceId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getCheckAcceptance()
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
      this.getCheckAcceptance()
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
    confirmCheck () {
      let url = '/checkAcceptance/checkCheckAcceptance'
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        checkAcceptanceId: this.currentRowId,
        taskId: this.taskId,
        approved: this.checkResult,
        auditOpinion: this.checkMsg
      }
      this.$http.post(url, data).then(res => {
        this.showCheckResultModal = false
        if (res.data.status === true) {
          this.getCheckAcceptance()
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
    // 显示流程图
    showFlows (row, index) {
      let url = '/getFlowImg/' + row.processId + '?access_token=' + localStorage.getItem('jwtToken')
      this.$http.get(url).then(res => {
        this.showCheckImgModal = true
        this.img = 'data:image/png;base64,' +
          btoa(new Uint8Array(res.data).reduce((res, byte) => res + String.fromCharCode(byte), ''))
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
      this.getCheckAcceptance()
    },
    pageSize: function () {
      this.getCheckAcceptance()
    }
  }
}
</script>

<style>

</style>

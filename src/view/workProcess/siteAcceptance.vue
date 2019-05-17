<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" clearable placeholder="输入材料名称查询" v-model="materialName"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="siteAcceptTable"
      :columns="columns"
      :data="siteAcceptData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.sponsor.id && row.isSubmit === 0)" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.sponsor.id && row.isSubmit === 0)" @click="remove(row, index)">删除</Button>
        <Button type="success" size="small" @click="showFlows(row,index)">流程图</Button>
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
      title="新增 进场验收">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="材料名称" prop="materialName">
          <Input v-model="formData.materialName" placeholder="材料名称" />
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
      title="编辑 进场验收">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project" :placeholder="currentProjectName">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="材料名称" prop="materialName">
          <Input v-model="formData.materialName" placeholder="材料名称" />
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      siteAcceptData: [],
      employeeList: [],
      projectList: [],
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      materialName: '',
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
            const projec = params.row.project
            return h('span', projec.name)
          }
        },
        {
          title: '材料名称',
          key: 'materialName',
          width: 100
        },
        {
          title: '发起人',
          key: 'sponsor',
          width: 80,
          render: (h, params) => {
            const employee = params.row.sponsor
            return h('span', employee.username)
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
          width: 220,
          fixed: 'right'
        }
      ],
      formData: {},
      // 校验规则
      ruleValidate: {
        materialName: [
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
    this.getsiteAcceptDataList()
    const departmentPosition = JSON.parse(localStorage.getItem('currentUser')).departmentPosition
    this.currentEmplId = JSON.parse(localStorage.getItem('currentUser')).id
    this.currentRank = departmentPosition.rank
    // this.getEmployeeList()
  },
  methods: {
    add () {
      this.showAddModal = true
      // this.getEmployeeList()
      this.getProjectList()
    },
    search () {
      this.pageNo = 0
      this.pageSize = 5
      this.getsiteAcceptDataList()
    },
    edit (row, data) {
      this.getProjectList()
      this.formData = row
      this.showEditModal = true
      this.currentProjectName = row.project.name
    },
    getsiteAcceptDataList () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        materialName: this.materialName
      }
      let url = '/siteAcceptance/listSiteAcceptsByDepart'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.siteAcceptData = res.data.content
          this.dataTotal = res.data.totalElements
        }
      })
    },
    getEmployeeList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/siteAcceptance/listAllEmployees'
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
      let url = '/siteAcceptance/listAllProjects'
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
      let url = '/siteAcceptance/deleteSiteAcceptanceById'
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getsiteAcceptDataList()
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
            let url = '/siteAcceptance/saveSiteAcceptance?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showAddModal = false
              if (res.data.status === true) {
                this.getsiteAcceptDataList()
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
            let url = '/siteAcceptance/saveSiteAcceptance?access_token=' + localStorage.getItem('jwtToken')
            this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
              this.showEditModal = false
              if (res.data.status === true) {
                this.getsiteAcceptDataList()
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
      this.getsiteAcceptDataList()
    },
    pageSize: function () {
      this.getsiteAcceptDataList()
    },
    selectedName: function () {
      this.getsiteAcceptDataList()
    }
  }
}
</script>

<style>

</style>

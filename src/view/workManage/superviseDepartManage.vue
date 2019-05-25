<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入监理部名称查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="supervisionDepartmentTable"
      :columns="columns"
      :data="supervisionDepartmentData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small" @click="remove(row, index)">删除</Button>
        <Button type="success" size="small" @click="details(row, index)">详情</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          show-sizer
          :total="supervisionDepartmentDataTotal"
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
      title="添加监理部信息">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="监理部名称" prop="name">
          <Input v-model="formData.name" placeholder="监理部名称" />
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="formData.description" placeholder="描述" />
        </FormItem>
        <FormItem label="组长" prop="major">
          <Select v-model="formData.major" style="width:200px">
            <Option v-for="item in employees" :value="item" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="项目名称" prop="project">
          <Select v-model="formData.project" style="width:200px">
            <Option v-for="item in projects" :value="item" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注"/>
        </FormItem>
        <FormItem label="版本" prop="version">
          <Input v-model="formData.version" placeholder="版本" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdd('formData')">提交</Button>
        <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showEditModal"
      title="修改监理部信息">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="监理部名称" prop="name">
          <Input v-model="formData.name" placeholder="监理部名称" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData')">提交</Button>
        <Button @click="cancelEdit('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showDetailModal"
      title="监理部详细信息">
      <Form ref="rowDetails" :model="rowDetails" :label-width="100">
        <FormItem label="监理部名称" prop="name">
          <Input v-model="rowDetails.name" placeholder="监理部名称" disabled/>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="rowDetails.description" placeholder="描述" disabled/>
        </FormItem>
        <FormItem label="组长" prop="major">
          <Input v-model="rowDetails.major.name" placeholder="组长" disabled/>
        </FormItem>
        <FormItem label="项目名称" prop="project">
          <Input v-model="rowDetails.project.name" placeholder="项目名称" disabled/>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Input v-model="rowDetails.project.projectStatus.name" placeholder="状态" disabled/>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="rowDetails.remark" placeholder="备注" disabled/>
        </FormItem>
        <FormItem label="版本" prop="version">
          <Input v-model="rowDetails.version" placeholder="版本" disabled/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="showDetailModal = false" style="margin-left: 8px">关闭</Button>
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
import btnManage from '../../components/btnManage'
export default {
  data () {
    return {
      buttonList: [],
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 70
        },
        {
          title: '名称',
          key: 'name',
          width: 150
        },
        {
          title: '组长',
          key: 'major',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.major.name)
          }
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 180,
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
          title: '状态',
          key: 'project',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.project.projectStatus.name)
          }
        },
        {
          title: '所属项目',
          key: 'project',
          width: 180,
          render: (h, params) => {
            return h('span', params.row.project.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 195,
          fixed: 'right'
        }
      ],
      supervisionDepartmentData: [],
      allSupervisionDepartmentData: [],
      formData: {},
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '菜单项不可以为空', trigger: 'blur' }
        ],
        project: [
          { required: true, message: '不可以为空', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '不可以为空', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '不可以为空', trigger: 'blur' }
        ]
      },
      showAddModal: false,
      showDeleteModal: false,
      showEditModal: false,
      showDetailModal: false,
      // 当前选择行的ID
      currentRowId: '',
      // 分页使用
      pageNo: 0,
      pageSize: 5,
      supervisionDepartmentDataTotal: 0,
      // 查询条件
      searchData: '',
      employees: '',
      projects: '',
      // 暂存当前行，编辑用
      currentRow: {
        name: '',
        remark: '',
        version: ''
      },
      rowDetails: {
        project: {
          projectStatus: {}
        },
        major: {}
      }
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getSupervisionDepartmentPage()
  },
  methods: {
    /**
     * 以下为增加修改删除的弹框控制方法以及提交后台方法
     */
    add () {
      this.formData = {}
      this.showAddModal = true
      this.getEmployeesList()
      this.getProjectsList()
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    edit (row, index) {
      this.formData = row
      this.currentRow.name = this.formData.name
      this.currentRow.remark = this.formData.remark
      this.currentRow.version = this.formData.version
      this.showEditModal = true
    },
    details (row, index) {
      this.rowDetails = row
      this.showDetailModal = true
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/projectSupervisionDepartment/delete/projectSupervisionDpId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getSupervisionDepartmentPage()
        }
      })
    },
    confirmAdd (name) {
      this.formData.createDate = new Date()
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/projectSupervisionDepartment/saveProjectSupervisionDepartment?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getSupervisionDepartmentPage()
              this.$Message.success(res.data.message)
            } else {
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('表单数据校验失败!')
        }
      })
    },
    confirmEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/projectSupervisionDepartment/saveProjectSupervisionDepartment?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getSupervisionDepartmentPage()
              this.$Message.success(res.data.message)
            } else {
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('表单数据校验失败!')
        }
      })
    },
    cancelEdit (name) {
      this.showEditModal = false
      this.formData.name = this.currentRow.name
      this.formData.remark = this.currentRow.remark
      this.formData.version = this.currentRow.version
      this.$Message.info('您已取消编辑！')
    },
    cancelAdd (name) {
      this.$refs[name].resetFields()
      this.showAddModal = false
      this.$Message.info('您已取消增加！')
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$refs.supervisionDepartmentTable.clearCurrentRow()
      this.$Message.info('您已取消删除！')
    },
    search () {
      this.pageNo = 0
      this.getSupervisionDepartmentPage()
    },
    // 获取资源列表
    getSupervisionDepartmentPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        projectSupervisionDpName: this.searchData
      }
      let url = '/projectSupervisionDepartment/listProjectSupervisionDepartmentPage/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.supervisionDepartmentData = res.data.content
          this.supervisionDepartmentDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
    getEmployeesList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/project/listAllEmployees'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.employees = res.data
        }
      })
    },
    getProjectsList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/project/listProjectsSupervisionDpIsNull'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.projects = res.data
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
  components: {
    btnManage
  },
  watch: {
    pageNo: function () {
      this.getSupervisionDepartmentPage()
    },
    pageSize: function () {
      this.getSupervisionDepartmentPage()
    },
    buttonList: function (val) {
      val.forEach(element => {
        if (element.buttonId === 'addBtn') {
          this.showAddBtn = true
        } else if (element.buttonId === 'editBtn') {
          this.showEditBtn = true
        } else if (element.buttonId === 'deleteBtn' || element.buttonId === 'batchDel' || element.buttonId === 'delBtn') {
          this.showDeleteBtn = true
        }
      })
    }
  }
}
</script>

<style>
.ivu-table-overflowX{
  overflow: hidden
}
</style>

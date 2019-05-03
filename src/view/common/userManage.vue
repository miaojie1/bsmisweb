<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入用户名称查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary" v-show="showAddBtn">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="employeeTable"
      :columns="columns"
      :data="employeeData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px" v-show="showEditBtn" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small" v-show="showDeleteBtn" @click="remove(row, index)">删除</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          show-sizer
          :total="employeeDataTotal"
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
      title="添加用户">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="用户名" prop="username">
          <Input v-model="formData.username" placeholder="用户名" />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formData.password" placeholder="密码" />
        </FormItem>
        <FormItem label="性别" prop="sex">
          <Input v-model="formData.sex" placeholder="性别" />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formData.email" placeholder="邮箱" />
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="formData.mobile" placeholder="手机号码"/>
        </FormItem>
        <FormItem label="部门" prop="department">
          <Select style="width:200px" v-model="formData.department">
            <Option v-for="item in departmentItem" :value="item.id" :key="item.id" name="department">{{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="员工状态" prop="employeeStatus">
          <Input v-model="formData.employeeStatus" placeholder="员工状态"/>
        </FormItem>
        <FormItem label="员工职位" prop="DepartmentPosition">
          <Input v-model="formData.DepartmentPosition" placeholder="员工职位"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdd('formData')">提交</Button>
        <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showEditModal"
      title="修改用户">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="用户名" prop="username">
          <Input v-model="formData.username" placeholder="用户名" />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formData.password" placeholder="密码" />
        </FormItem>
        <FormItem label="性别" prop="sex">
          <Input v-model="formData.sex" placeholder="性别" />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formData.email" placeholder="邮箱" />
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="formData.mobile" placeholder="手机号码"/>
        </FormItem>
        <FormItem label="部门" prop="department">
          <Select style="width:200px" v-model="formData.department">
            <Option v-for="item in departmentItem" :value="item.id" :key="item.id" name="department">{{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="员工状态" prop="employeeStatus">
          <Input v-model="formData.employeeStatus" placeholder="员工状态"/>
        </FormItem>
        <FormItem label="员工职位" prop="DepartmentPosition">
          <Input v-model="formData.DepartmentPosition" placeholder="员工职位"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData')">提交</Button>
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
          key: 'id'
          // width: 50
        },
        {
          title: '用户名',
          key: 'username'
          // width: 50
        },
        {
          title: '密码',
          key: 'password',
          width: 150
        },
        {
          title: '性别',
          key: 'sex'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '手机号码',
          key: 'mobile'
        },
        {
          title: '部门',
          key: 'department',
          render: (h, params) => {
            const row = params.row
            return h('Tag', {
              style: {
                color: 'white',
                border: 0
              }
            }, row.department.name)
          }
        },
        {
          title: '员工状态',
          key: 'employeeStatus',
          render: (h, params) => {
            return h('Tag', {
              style: {
                color: 'white',
                border: 0
              }
            }, params.row.employeeStatus.name)
          }
        },
        {
          title: '员工职位',
          key: 'DepartmentPosition',
          render: (h, params) => {
            return h('Tag', {
              style: {
                color: 'white',
                border: 0
              }
            }, params.row.DepartmentPosotion.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          fixed: 'right'
        }
      ],
      employeeData: [],
      formData: {
        username: '',
        password: '',
        sex: '',
        email: '',
        mobile: '',
        department: '',
        employeeStatus: '',
        DepartmentPosition: ''
      },
      ruleValidate: {
        username: [
          { required: true, message: '用户名不可以为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不可以为空', trigger: 'blur' }
        ]
      },
      showAddBtn: false,
      showDeleteBtn: false,
      showEditBtn: false,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      departmentItem: [],
      currentRowId: '',
      // 分页使用
      pageNo: 0,
      pageSize: 5,
      employeeDataTotal: 0,
      // 查询条件
      searchData: ''
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getEmployeePage()
    this.getDepartment()
  },
  methods: {
    add () {
      this.formData = []
      this.showAddModal = true
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
    },
    getEmployeePage () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/employee/listEmployeePage/pageSize/' + this.pageSize + '/pageNo/' + this.pageNo
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.employeeData = res.data.content
          this.employeeDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
    getDepartment () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/department/listDepartmentPage/pageSize/' + this.pageSize + '/pageNo/' + this.pageNo
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.departmentItem = res.data.content
        }
      })
    },
    search () {
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/employee/saveEmployee?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getEmployeePage()
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
    cancelAdd (name) {
      this.$refs[name].resetFields()
      this.showAddModal = false
      this.$Message.info('您已取消增加！')
    },
    confirmEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/employee/saveEmployee?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getEmployeePage()
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
      this.$refs[name].resetFields()
      this.$refs.employeeData.clearCurrentRow()
      this.showEditModal = false
      this.$Message.info('您已取消编辑！')
    },
    // 删除用户
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/employee/delete/employeeId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getEmployeePage()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$refs.employeeTable.clearCurrentRow()
      this.$Message.info('您已取消删除！')
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
      this.getEmployeePage()
    },
    pageSize: function () {
      this.getEmployeePage()
    },
    buttonList: function (val) {
      val.forEach(element => {
        var id = element.buttonId
        if (id.toUpperCase().indexOf('addbtn'.toUpperCase()) >= 0) {
          this.showAddBtn = true
        } else if (id.toUpperCase().indexOf('editbtn'.toUpperCase()) >= 0) {
          this.showEditBtn = true
        } else if (id.toUpperCase().indexOf('delbtn'.toUpperCase()) >= 0 || id.toUpperCase().indexOf('batchbtn'.toUpperCase()) >= 0) {
          this.showDeleteBtn = true
        }
      })
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入用户名称查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="reset" type="primary">重置</Button>
        <Button @click="add" type="primary">添加</Button>
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
        <Button type="primary" size="small" style="margin-right: 1px" v-show="isShow(row)" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small" v-show="isShow(row)" @click="remove(row, index)">删除</Button>
        <Button type="primary" size="small" @click="showDetail(row, index)">详情</Button>
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
        <FormItem label="姓名" prop="name">
          <Input v-model="formData.name" placeholder="姓名" />
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="formData.username" placeholder="用户名" />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formData.password" placeholder="密码" />
        </FormItem>
        <FormItem label="性别" prop="sex">
          <Input v-model="formData.sex" placeholder="性别" />
        </FormItem>
        <FormItem label="入职日期" prop="entryDate">
          <DatePicker type="datetime"
            placeholder="选择入职日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.entryDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="离职日期" prop="termDate">
          <DatePicker type="datetime"
            placeholder="选择离职日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.termDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formData.email" placeholder="邮箱" />
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="formData.mobile" placeholder="手机号码"/>
        </FormItem>
        <FormItem label="部门" prop="department">
          <Select style="width:200px" v-model="formData.department" @on-change="changeDepartmentPosition(formData.department)">
            <Option v-for="item in departmentItem" :value="item" :key="item.id" name="department" :selected="index.indexOf(item.id) > -1">
              {{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="部门职位" prop="departmentPosition">
          <Select style="width:200px" v-model="formData.departmentPosition">
            <Option v-for="item in departmentPositionItem" :value="item" :key="item.id" name="departmentPosition">{{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="角色" prop="roles">
          <Select style="width:200px" v-model="formData.roles" multiple>
            <Option v-for="item in rolesItem" :value="item" :key="item.id" name="roles">{{item.description }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="员工状态" prop="employeeStatus">
          <Select style="width:200px" v-model="formData.employeeStatus">
            <Option v-for="item in employeeStatusItem" :value="item" :key="item.id" name="employeeStatus">{{item.name }}
            </Option>
          </Select>
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
        <FormItem label="姓名" prop="name">
          <Input v-model="formData.name" placeholder="姓名" />
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="formData.username" placeholder="用户名" />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formData.password" placeholder="密码" />
        </FormItem>
        <FormItem label="性别" prop="sex">
          <Input v-model="formData.sex" placeholder="性别" />
        </FormItem>
        <FormItem label="入职日期" prop="entryDate">
          <DatePicker type="datetime"
            placeholder="选择入职日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.entryDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="离职日期" prop="termDate">
          <DatePicker type="datetime"
            placeholder="选择离职日期"
            confirm
            format="yyyy-MM-ddTHH:mm:ss+08:00"
            v-model="formData.termDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formData.email" placeholder="邮箱" />
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="formData.mobile" placeholder="手机号码"/>
        </FormItem>
        <FormItem label="部门" prop="department">
          <Select style="width:200px" v-model="formData.department" :placeholder="deparmentStr" @on-change="changeDepartmentPosition(formData.department)">
            <Option v-for="item in departmentItem" :value="item" :label="item.name" :key="item.id" name="department" :selected="index.indexOf(item.id) > -1">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="员工职位" prop="departmentPosition">
          <Select style="width:200px" v-model="formData.departmentPosition" :placeholder="departmentPositionStr">
            <Option v-for="item in departmentPositionItem" :value="item" :label="item.name" :key="item.id" name="departmentPosition">{{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="角色" prop="roles">
          <Select style="width:200px" v-model="formData.roles" multiple :placeholder="roleStr">
            <Option v-for="item in rolesItem" :label="item.name" :value="item" :key="item.id" name="roles">{{item.description }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="员工状态" prop="employeeStatus">
          <Select style="width:200px" v-model="formData.employeeStatus" :placeholder="employeeStatusStr">
            <Option v-for="item in employeeStatusItem" :value="item" :key="item.id" name="employeeStatus">{{item.name }}
            </Option>
          </Select>
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
    <Modal
      v-model="showDetailModal"
      title="用户详情"
      @on-ok="ok">
      <p>姓名：{{currentRowDetail.name}}</p>
      <p>用户名：{{currentRowDetail.username}}</p>
      <p>性别：{{currentRowDetail.sex}}</p>
      <p>邮箱：{{currentRowDetail.email}}</p>
      <p>手机号：{{currentRowDetail.mobile}}</p>
      <p>入职日期：{{currentRowDetail.entryDate}}</p>
      <p>入职日期：{{currentRowDetail.entryDate}}</p>
      <span>
        <p v-if="currentRowDetail.chief">上级主管：{{currentRowDetail.chief.name}}</p>
        <p v-else>上级主管：</p>
      </span>
      <p>创建日期：{{currentRowDetail.createDate}}</p>
      <p v-if="currentRowDetail.modificationDate">修改日期：{{currentRowDetail.modificationDate}}</p>
      <p v-else>修改日期：无修改</p>
      <span>
        <p v-if="currentRowDetail.employeeStatus">员工状态：{{currentRowDetail.employeeStatus.name}}</p>
        <p v-else>员工状态：</p>
      </span>
      <span>
        <p v-if="currentRowDetail.department">员工部门：{{currentRowDetail.department.name}}</p>
        <p v-else>员工部门：</p>
      </span>
      <span>
        <p v-if="currentRowDetail.departmentPosition">员工职位：{{currentRowDetail.departmentPosition.name}}</p>
        <p v-else>员工职位：</p>
      </span>
      <p>
        员工角色：
        <span v-for="(item, index) in currentRowDetail.roles" :key="index">{{item.description}}、</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="closeDetail">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import btnManage from '../../components/btnManage'
export default {
  data () {
    return {
      index: '',
      buttonList: [],
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 100
        },
        {
          title: '姓名',
          key: 'name',
          width: 150
        },
        {
          title: '用户名',
          key: 'username',
          width: 150
        },
        {
          title: '密码',
          key: 'password',
          width: 150
        },
        {
          title: '性别',
          key: 'sex',
          width: 150
        },
        {
          title: '邮箱',
          key: 'email',
          width: 150
        },
        {
          title: '手机号码',
          key: 'mobile',
          width: 150
        },
        {
          title: '所属部门',
          key: 'department',
          width: 100,
          render: (h, params) => {
            const row = params.row
            return h('span', row.department.name)
          }
        },
        {
          title: '员工职位',
          key: 'departmentPosition',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.departmentPosition.name)
          }
        },
        {
          title: '角色',
          key: 'roles',
          width: 100,
          render: (h, params) => {
            const roles = params.row.roles
            let description = ''
            for (let i = 0; i < roles.length; i++) {
              description += roles[i].description + '  '
            }
            return h('span', description)
          }
        },
        {
          title: '员工状态',
          key: 'employeeStatus',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.employeeStatus.name)
          }
        },
        {
          title: '创建日期',
          key: 'createDate',
          width: 150
        },
        {
          title: '修改日期',
          key: 'modificationDate',
          width: 150
        },
        {
          title: '版本',
          key: 'version',
          width: 100
        },
        {
          title: '操作',
          slot: 'action',
          width: 180,
          fixed: 'right'
        }
      ],
      employeeData: [],
      formData: {},
      ruleValidate: {
        username: [
          { required: true, message: '用户名不可以为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不可以为空', trigger: 'blur' }
        ]
      },
      // showAddBtn: false,
      // showDeleteBtn: false,
      // showEditBtn: false,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showDetailModal: false,
      currentRowDetail: '',
      departmentItem: [],
      employeeStatusItem: [],
      departmentPositionItem: [],
      // rolesItem: {},
      currentRowId: '',
      // 分页使用
      pageNo: 0,
      pageSize: 5,
      employeeDataTotal: 0,
      // 查询条件
      searchData: '',
      // 部门默认显示
      deparmentStr: '',
      // 职位默认显示
      departmentPositionStr: '',
      // 用户默认显示
      roleStr: '',
      // 员工状态默认显示
      employeeStatusStr: '',
      // 当前登录用户
      currentEmpl: ''
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getEmployeePage()
    this.getDepartment()
    // this.getDepartmentPosition()
    this.getEmployeeStatus()
    this.getRoles()
    this.currentEmpl = JSON.parse(localStorage.getItem('currentUser'))
  },
  methods: {
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    edit (row, index) {
      this.formData = row
      if (row.department !== null) {
        this.deparmentStr = row.department.name
      } else {
        this.deparmentStr = '无'
      }
      if (row.departmentPosition !== null) {
        this.departmentPositionStr = row.departmentPosition.name
      } else {
        this.departmentPositionStr = '无'
      }
      if (row.roles !== null) {
        for (let i = 0; i < row.roles.length; i++) {
          this.roleStr += row.roles[i].description
        }
      } else {
        this.roleStr = '无'
      }
      if (row.employeeStatus !== null) {
        this.employeeStatusStr = row.employeeStatus.name
      } else {
        this.employeeStatusStr = '无'
      }
      this.showEditModal = true
    },
    isShow () {
      for (let i = 0; i < this.currentEmpl.roles.length; i++) {
        if (this.currentEmpl.roles[i].description === '管理员') {
          return true
        }
      }
    },
    getEmployeePage () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/employee/listEmployeePage/pageSize/' + this.pageSize + '/pageNo/' + this.pageNo + '?username=' + this.searchData
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.employeeData = res.data.content
          this.employeeDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
    // 获取部门
    getDepartment () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/department/listAllDepartment'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.departmentItem = res.data
        }
      })
    },
    changeDepartmentPosition (department) {
      console.log(department)
      let departmentIds = ''
      departmentIds = department.id
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/departmentPosition/listAllDepartmentPositions?departmentIds=' + departmentIds
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.departmentPositionItem = res.data
        }
      })
    },
    // 获取部门职位
    // getDepartmentPosition () {
    //   let data = {
    //     access_token: localStorage.getItem('jwtToken')
    //   }
    //   let url = '/departmentPosition/listAllDepartmentPositions'
    //   this.$http.post(url, data).then(res => {
    //     if (res.status === 200) {
    //       console.log(res)
    //       this.departmentPositionItem = res.data
    //     }
    //   })
    // },
    // 获取角色
    getRoles () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/role/listAllRoles'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.rolesItem = res.data
        }
      })
    },
    // 获取在职状态
    getEmployeeStatus () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/employeeStatus/listAllEmployeeStatus'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.employeeStatusItem = res.data
        }
      })
    },
    search () {
      this.getEmployeePage()
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
      this.deparmentStr = ''
      this.departmentPositionStr = ''
      this.roleStr = ''
      this.employeeStatusStr = ''
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
      // this.$refs[name].resetFields()
      this.showEditModal = false
      this.deparmentStr = ''
      this.departmentPositionStr = ''
      this.roleStr = ''
      this.employeeStatusStr = ''
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
    // 重置查询条件
    reset () {
      this.searchData = ''
      this.getEmployeePage()
    },
    showDetail (row, index) {
      this.currentRowDetail = row
      this.showDetailModal = true
    },
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
  components: {
    btnManage
  },
  watch: {
    pageNo: function () {
      this.getEmployeePage()
    },
    pageSize: function () {
      this.getEmployeePage()
    }
  }
}
</script>

<style>

</style>

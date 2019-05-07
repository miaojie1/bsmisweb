<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入角色名称查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary" v-show="showAddBtn">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="roleTable"
      :columns="columns"
      :data="roleData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px" v-show="showEditBtn" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small" v-show="showDeleteBtn" @click="remove(row, index)">删除</Button>
        <Button type="success" size="small" @click="addRoot(row,index)">角色授权</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          show-sizer
          :total="roleDataTotal"
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
      title="添加角色">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="角色名称" prop="name">
          <Input v-model="formData.name" placeholder="角色名称" />
        </FormItem>
        <FormItem label="角色描述" prop="description">
          <Input v-model="formData.description" placeholder="角色描述" />
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
      title="修改角色">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="角色名称" prop="name">
          <Input v-model="formData.name" placeholder="角色名称" />
        </FormItem>
        <FormItem label="角色描述" prop="description">
          <Input v-model="formData.description" placeholder="description" />
        </FormItem>
        <FormItem label="版本" prop="version">
          <Input v-model="formData.version" placeholder="版本" />
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
          key: 'id',
          width: 50
        },
        {
          title: '角色名称',
          key: 'name',
          width: 110
        },
        {
          title: '角色描述',
          key: 'description',
          width: 110
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 130,
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
          width: 130,
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
          title: '按钮',
          key: 'operations',
          width: 210,
          render: (h, params) => {
            const opeval = params.row.operations
            let btns = ''
            if (opeval === '') {
              return h('span', '无')
            } else {
              opeval.forEach(element => {
                btns = btns + element.buttonId + '; '
              })
              return h('span', btns)
            }
          }
        },
        {
          title: '版本',
          key: 'version',
          width: 115
        },
        {
          title: '操作',
          slot: 'action',
          width: 220,
          fixed: 'right'
        }
      ],
      roleData: [],
      allRoleData: [],
      formData: {
        name: '',
        description: '',
        version: ''
      },
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '不可以为空', trigger: 'blur' }
        ]
      },
      showAddModal: false,
      showDeleteModal: false,
      showEditModal: false,
      showAddBtn: false,
      showDeleteBtn: false,
      showEditBtn: false,
      // 当前选择行的ID
      currentRowId: '',
      // 分页使用
      pageNo: 0,
      pageSize: 5,
      roleDataTotal: 0,
      // 查询条件
      searchData: ''
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getRolePage()
  },
  methods: {
    /**
     * 以下为增加修改删除的弹框控制方法以及提交后台方法
     */
    add (index) {
      this.showAddModal = true
      this.getRoleList()
    },

    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
    },
    addRoot (row, index) {

    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/role/delete/roleId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getRolePage()
        }
      })
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/role/saveRole?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getRolePage()
              this.$Message.success(res.data.message)
            } else {
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('表单数据校验失败!')
        }
      })
      this.formData.name = ''
      this.formData.description = ''
      this.formData.version = ''
    },
    confirmEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/role/saveRole?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getRolePage()
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
      this.$refs.roleTable.clearCurrentRow()
      this.$Message.info('您已取消删除！')
    },
    search () {
      this.pageNo = 0
      this.getRolePage()
    },
    // 获取菜单资源列表
    getRolePage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        roleName: this.searchData
      }
      let url = '/role/listRolePage/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.roleData = res.data.content
          this.roleDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
    // 获取所有的资源列表 不分页
    getRoleList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/role/listAllRoles'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.allRoleData = res.data.content
        }
      })
    },
    changeStatus (status) {
      this.formData.status = status
    },
    changeRootRole (status) {
      this.formData.rootRole = status
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
      this.getRolePage()
    },
    pageSize: function () {
      this.getRolePage()
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
.ivu-table-body{
  overflow: hidden;
}
</style>

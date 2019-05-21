<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入角色名称查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
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
        <Button type="primary" size="small" style="margin-right: 1px" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small" @click="remove(row, index)">删除</Button>
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
          <Input v-model="formData.description" placeholder="角色描述" />
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
      v-model="showAddRootModal"
      title="角色授权">
      <Tree
        :data="allRoleData"
        children-key="subMenus"
        :render="renderContent"
        ref="roleTree"
        multiple
        show-checkbox>
      </Tree>
      <div slot="footer">
        <Button type="primary" @click="confirmAddRoot()">提交</Button>
        <Button @click="cancelAddRoot()" style="margin-left: 8px">取消</Button>
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
          key: 'description'
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

          render: (h, params) => {
            const modificationDate = params.row.modificationDate
            if (modificationDate === null || modificationDate === '') {
              return h('span', '')
            } else {
              return h('span', modificationDate.substring(0, 10))
            }
          }
        },
        // {
        //   title: '按钮',
        //   key: 'operations',
        //   width: 210,
        //   render: (h, params) => {
        //     const opeval = params.row.operations
        //     let btns = ''
        //     if (opeval === '') {
        //       return h('span', '无')
        //     } else {
        //       opeval.forEach(element => {
        //         btns = btns + element.buttonId + '; '
        //       })
        //       return h('span', btns)
        //     }
        //   }
        // },
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
      // 列表
      roleData: [],
      // 分配权限 保存所有资源
      allRoleData: [],
      rootsData: '',
      currentRoots: '',
      menusData: '',
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
      // 控制各提示框的显示
      showAddModal: false,
      showDeleteModal: false,
      showEditModal: false,
      showAddBtn: false,
      showDeleteBtn: false,
      showEditBtn: false,
      showAddRootModal: false,
      // 当前选择行的ID
      currentRowId: '',
      currentRow: {},
      // 分页使用
      pageNo: 0,
      pageSize: 5,
      roleDataTotal: 0,
      // 查询条件
      searchData: '',
      selectRoleData: []
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
    resetFields () {
      this.formData = {
        name: '',
        description: ''
      }
    },
    add (index) {
      this.resetFields()
      this.showAddModal = true
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    edit (row, index) {
      debugger
      this.formData = row
      this.showEditModal = true
    },
    addRoot (row, index) {
      this.formData = row
      this.getRoots()
      this.showAddRootModal = true
      this.currentRoots = row.menus
      this.currentRow = row
    },
    renderContent (h, { root, node, data }) {
      return h('span', [
        h('Icon', {
          props: {
            type: 'md-keypad'
          },
          style: {
            marginRight: '8px'
          }}), h('span', data.name)])
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
      this.resetFields()
    },
    cancelAddRoot () {
      this.showAddRootModal = false
      this.$Message.info('您已取消修改！')
      this.menusData = ''
      this.resetFields()
    },
    cancelAdd (name) {
      this.showAddModal = false
      this.$Message.info('您已取消增加！')
      this.resetFields()
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
    // 获取所有的资源列表 不分页
    getRoots () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/menu/listMenuTree'
      this.$http.post(url, data).then(res => {
        debugger
        if (res.status === 200) {
          this.allRoleData = res.data
        }
      })
    },
    // 获取角色列表
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
    },
    confirmAddRoot () {
      debugger
      this.selectRoleData = this.$refs.roleTree.getCheckedAndIndeterminateNodes()
      for (var i = 0; i < this.selectRoleData.length; i++) {
        delete this.selectRoleData[i].checked
        delete this.selectRoleData[i].indeterminate
        delete this.selectRoleData[i].nodeKey
        this.selectRoleData[i].subMenus = null
      }
      console.log(this.selectRoleData)
      let url = '/role/saveRoleMenus?access_token=' + localStorage.getItem('jwtToken') + '&roleId=' + this.currentRow.id
      this.$http.postForm(url, JSON.stringify(this.selectRoleData)).then(res => {
        debugger
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.selectRoleData = []
          this.allRoleData = []
          this.showAddRootModal = false
        } else {
          this.$Message.error(res.data.message)
          this.selectRoleData = []
          this.allRoleData = []
          this.showAddRootModal = false
        }
      })
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

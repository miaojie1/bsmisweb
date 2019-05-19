<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入菜单名称查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="menuTable"
      :columns="columns"
      :data="menuData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px" @click="edit(row, index)">编辑</Button>
        <Button type="error" size="small" @click="remove(row, index)">删除</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          show-sizer
          :total="menuDataTotal"
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
      title="添加菜单">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="菜单项" prop="name">
          <Input v-model="formData.name" placeholder="菜单项" />
        </FormItem>
        <FormItem label="URL" prop="url">
          <Input v-model="formData.url" placeholder="URL" />
        </FormItem>
        <FormItem label="状态" prop="status">
          <i-switch v-model="formData.status" @on-change="changeStatus">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注"/>
        </FormItem>
        <FormItem label="是否根菜单" prop="rootMenu">
          <i-switch v-model="formData.rootMenu" @on-change="changeRootMenu">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="父菜单" prop="parentMenuId">
          <Select v-model="formData.parentMenuId">
            <Option v-for="item in allMenuData" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
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
      title="修改菜单">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="菜单项" prop="name">
          <Input v-model="formData.name" placeholder="菜单项" />
        </FormItem>
        <FormItem label="URL" prop="url">
          <Input v-model="formData.url" placeholder="URL" />
        </FormItem>
        <FormItem label="状态" prop="status">
          <i-switch v-model="formData.status" @on-change="changeStatus">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注"/>
        </FormItem>
        <FormItem label="是否根菜单" prop="rootMenu">
          <i-switch v-model="formData.rootMenu" @on-change="changeRootMenu">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="父菜单" prop="parentMenuId">
          <Select v-model="formData.parentMenuId">
            <Option v-for="item in menuData" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
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
// import {getDate} from '../../common/filters/dateFilters.js'
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
          title: '菜单项',
          key: 'name',
          width: 100
        },
        {
          title: 'URL',
          key: 'url',
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
        // {
        //   title: '按钮',
        //   key: 'operation',
        //   width: 100,
        //   render: (h, params) => {
        //     const opeval = params.row.operation
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
          title: '状态',
          key: 'status',
          width: 120,
          render: (h, params) => {
            const row = params.row
            const color = row.status === true ? 'primary' : 'error'
            const text = row.status === true ? '是' : '否'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '备注',
          key: 'remark',
          width: 100
        },
        {
          title: '是否根菜单',
          key: 'rootMenu',
          width: 120,
          render: (h, params) => {
            const row = params.row
            const color = row.rootMenu === true ? 'primary' : 'error'
            const text = row.rootMenu === true ? '是' : '否'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '父菜单',
          key: 'parentMenuId',
          width: 100,
          render: (h, params) => {
            const parentMenuId = params.row.parentMenuId
            if (parentMenuId === null || parentMenuId === '') {
              return h('span', '无')
            } else {
              return h('span', this.transParentMenu(parentMenuId))
            }
          }
        },
        {
          title: '版本',
          key: 'version',
          width: 50
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          fixed: 'right'
        }
      ],
      menuData: [],
      allMenuData: [],
      formData: {
        name: '',
        url: '',
        // createDate: '',
        // modifiationDate: '',
        status: true,
        remark: '',
        rootMenu: false,
        parentMenuId: '',
        version: ''
      },
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '菜单项不可以为空', trigger: 'blur' }
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
      menuDataTotal: 0,
      // 查询条件
      searchData: ''
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getMenuPage()
    this.getMenuList()
  },
  methods: {
    /**
     * 以下为增加修改删除的弹框控制方法以及提交后台方法
     */
    add (index) {
      this.showAddModal = true
      this.getMenuList()
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/menu/delete/menuId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getMenuPage()
        }
      })
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/menu/saveMenu?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            this.$refs[name].resetFields()
            if (res.data.status === true) {
              this.getMenuPage()
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
          this.$http.postForm('/menu/saveMenu?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getMenuPage()
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
      this.$refs.menuData.clearCurrentRow()
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
      this.$refs.menuTable.clearCurrentRow()
      this.$Message.info('您已取消删除！')
    },
    search () {
      this.pageNo = 0
      this.getMenuPage()
    },
    // 获取菜单资源列表
    getMenuPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        name: this.searchData
      }
      let url = '/menu/listMenuPage/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.menuData = res.data.content
          this.menuDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
    // 获取所有的资源列表 不分页
    getMenuList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/menu/listAllMenus'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.allMenuData = res.data
        }
      })
    },
    transParentMenu (parentId) {
      let i = 0
      for (i = 0; i < this.allMenuData.length; i++) {
        if (this.allMenuData[i].id === parentId) {
          return this.allMenuData[i].name
        }
      }
    },
    changeStatus (status) {
      this.formData.status = status
    },
    changeRootMenu (status) {
      this.formData.rootMenu = status
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
      this.getMenuPage()
    },
    pageSize: function () {
      this.getMenuPage()
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
</style>

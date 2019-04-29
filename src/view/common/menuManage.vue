<template>
  <div>
    <btn-manage :buttonList="buttonList"></btn-manage>
    <Button @click="edit">测试修改</Button>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="menuData"
      style="margin-top: 30px"
      size="small"
      @on-row-click="handleClickRow">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
    </Table>
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
          <Input v-model="formData.parentMenuId" placeholder="父菜单" />
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
          <Input v-model="formData.parentMenuId" placeholder="父菜单" />
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
import {getDate} from '../../common/filters/dateFilters.js'
export default {
  data () {
    return {
      buttonList: [],
      columns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '菜单项',
          key: 'name'
        },
        {
          title: 'URL',
          key: 'url'
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
          title: '按钮',
          key: 'operation',
          render: (h, params) => {
            const opeval = params.row.operation
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
          key: 'remark'
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
          title: '父菜单ID',
          key: 'parentMenuId'
        },
        {
          title: '版本',
          key: 'version'
        }
      ],
      menuData: [],
      formData: {
        name: '',
        url: '',
        createDate: '',
        modifiationDate: '',
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
      // 当前选择行的ID
      currentRowId: '',
      // 当前行的数据
      currentRow: ''
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getMenuPage()
  },
  methods: {
    add () {
      this.formData.createDate = getDate(new Date())
      this.showAddModal = true
    },
    remove () {
      if (this.currentRowId === '') {
        this.$Message.error('请选择要删除的数据！')
        return
      }
      this.showDeleteModal = true
    },
    edit () {
      if (this.currentRow === '') {
        this.$Message.error('请选择要编辑的数据！')
        return
      }
      this.showEditModal = true
      this.formData = this.currentRow
      this.formData.modificationDate = getDate(new Date())
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/menu/delete/menuId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success('成功删除一条菜单数据!')
          this.getMenuPage()
        }
      })
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/menu/saveMenu?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
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
      this.showEditModal = false
    },
    cancelAdd (name) {
      this.$refs[name].resetFields()
      this.showAddModal = false
    },
    getMenuPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let pageNo = 0
      let pageSize = 20
      let url = '/menu/listMenuPage/pageNo/' + pageNo + '/pageSize/' + pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.menuData = res.data.content
        }
      })
    },
    changeStatus (status) {
      this.formData.status = status
    },
    changeRootMenu (status) {
      this.formData.rootMenu = status
    },
    handleClickRow (data, index) {
      this.currentRowId = data.id
      this.currentRow = data
    }
  },
  components: {
    btnManage
  },
  watch: {
    // $route () {
    //   console.log('**************************')
    //   console.log($route.path)
    // }
  }
}
</script>

<style>
</style>

<template>
  <div>
    <btn-manage :buttonList="buttonList"></btn-manage>
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
        <FormItem label="修改时间" prop="modificationDate">
          <Input v-model="formData.modificationDate" placeholder="修改时间" />
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
// import tableFilters from '../../common/filters/tableFilters'
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
          key: 'createDate'
        },
        {
          title: '修改时间',
          key: 'modificationDate'
        },
        // {
        //   title: '按钮',
        //   key: 'operation'
        // },
        {
          title: '状态',
          key: 'status',
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
          key: 'parentMenuId'
        },
        {
          title: '版本',
          key: 'version'
        }
      ],
      menuData: [],
      formData: {
        name: '测试1',
        url: '/test1',
        createDate: '',
        modifiationDate: '',
        status: true,
        remark: '',
        rootMenu: false,
        parentMenuId: '1',
        version: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '菜单项不可以为空', trigger: 'blur' }
        ]
        // status: [
        //   { required: true, message: '状态不可以为空', trigger: 'blur' }
        // ],
        // rootMenu: [
        //   { required: true, message: '是否根菜单不可以为空', trigger: 'blur' }
        // ]
      },
      showAddModal: false,
      showDeleteModal: false,
      currentRowId: ''
    }
  },
  created () {
    localStorage.setItem('operation', JSON.stringify(this.$route.params.operation))
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getMenuPage()
  },
  methods: {
    add () {
      this.showAddModal = true
    },
    remove () {
      this.showDeleteModal = true
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
          this.$http.postForm('/menu/saveMenu', this.formData).then(res => {
            this.showAddModal = false
            if (res.data.state === 200) {
              this.getMenuPage()
              this.$Message.success('成功添加一条菜单数据!')
            }
          })
        } else {
          this.$Message.error('添加菜单数据失败!')
        }
      })
    },
    cancelAdd (name) {
      this.$refs[name].resetFields()
      this.showAddModal = false
    },
    getMenuPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let pageNo = '0'
      let pageSize = '20'
      let url = '/menu/listMenuPage/pageNo/' + pageNo + '/pageSize/' + pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
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

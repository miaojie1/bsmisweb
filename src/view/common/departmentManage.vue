<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入部门名称查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary" v-show="showAddBtn">添加</Button>
        <Button @click="add" type="primary" style="marign-left: 10px">测试增加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="departData"
      style="margin-top: 30px"
      size="small"
      @on-row-click="handleClickRow">
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
          :total="departDataTotal"
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
      title="添加部门">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="部门名称" prop="name">
          <Input v-model="formData.name" placeholder="部门名称" />
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="formData.description" placeholder="描述" />
        </FormItem>
        <FormItem label="上级部门" prop="superiorDepartment">
          <Select v-model="formData.superiorDepartment">
            <Option v-for="item in departData" :value="item" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <!-- <FormItem label="部门职位" prop="departmentPositions">
          <Input v-model="formData.departmentPositions" placeholder="部门职位" />
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdd('formData')">提交</Button>
        <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showEditModal"
      title="编辑部门">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="部门名称" prop="name">
          <Input v-model="formData.name" placeholder="部门名称" />
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="formData.description" placeholder="描述" />
        </FormItem>
        <FormItem label="上级部门" prop="superiorDepartment">
          <Select v-model="superDep.id" :placeholder="superDep.name">
            <Option v-for="item in departData" :value="item" :label="item.name" :key="item.id"></Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <!-- <FormItem label="部门职位" prop="departmentPositions">
          <Input v-model="formData.departmentPositions" placeholder="部门职位" />
        </FormItem> -->
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
        },
        {
          title: '部门名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'createDate',
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
        {
          title: '上级部门',
          key: 'superiorDepartment',
          render: (h, params) => {
            const superDep = params.row.superiorDepartment
            if (superDep === null || superDep === '') {
              return h('span', '无')
            } else {
              return h('span', superDep.name)
            }
          }
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '部门职位',
          key: 'departmentPositions'
        },
        {
          title: '版本',
          key: 'version'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          fixed: 'right'
        }
      ],
      departData: [],
      superDep: {},
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showAddBtn: false,
      showEditBtn: false,
      showDeleteBtn: false,
      searchData: '',
      formData: {
        name: '',
        description: '',
        superiorDepartment: '',
        remark: ''
        // departmentPositions: {},
      },
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '菜单项不可以为空', trigger: 'blur' }
        ]
      },
      currentRowId: '',
      currentRow: '',
      pageNo: 0,
      pageSize: 5,
      departDataTotal: 0
    }
  },
  created: function () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getDepartData()
  },
  methods: {
    add () {
      this.showAddModal = true
    },
    edit (row, index) {
      this.formData = row
      let superiorDepart = row.superiorDepartment
      this.superDep = superiorDepart
      this.showEditModal = true
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let url = '/department/saveOrUpdate?access_token=' + localStorage.getItem('jwtToken')
          this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getDepartData()
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
    cancelAdd () {
      this.showAddModal = false
      this.$refs.formData.resetFields()
      this.$Message.info('您已取消添加！')
    },
    confirmEdit (name) {
      this.formData.superiorDepartment = this.superDep.id
      this.$refs[name].validate((valid) => {
        if (valid) {
          let url = '/department/saveOrUpdate?access_token=' + localStorage.getItem('jwtToken')
          this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getDepartData()
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
    cancelEdit () {
      this.superDep = ''
      this.$refs.formData.resetFields()
      this.showEditModal = false
      this.$Message.info('您已取消编辑！')
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        departmentIds: this.currentRowId
      }
      let url = '/department/delDepartmentBatch'
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getDepartData()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.$Message.info('您已取消删除！')
    },
    search () {
      this.pageNo = 0
      this.getDepartData()
    },
    getDepartData () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        departmentName: this.searchData
      }
      let url = '/department/listDepartmentPage/pageSize/' + this.pageSize + '/pageNo/' + this.pageNo
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.departData = res.data.content
          this.departDataTotal = res.data.totalElements
        }
      })
    },
    handleClickRow (data, index) {
      this.currentRowId = data.id
      this.currentRow = data
      this.formData = data
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
      this.getDepartData()
    },
    pageSize: function () {
      this.getDepartData()
    },
    buttonList: function (val) {
      val.forEach(element => {
        if (element.buttonId === 'addBtn') {
          // this.showAddBtn = true
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

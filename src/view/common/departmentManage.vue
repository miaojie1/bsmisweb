<template>
  <div>
    <btn-manage :buttonList="buttonList"></btn-manage>
    <Button @click="add">测试增加</Button>
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
    </Table>
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
        <FormItem label="部门职位" prop="departmentPositions">
          <Input v-model="formData.departmentPositions" placeholder="部门职位" />
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
      title="编辑部门">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="部门名称" prop="name">
          <Input v-model="formData.name" placeholder="部门名称" />
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="formData.description" placeholder="描述" />
        </FormItem>
        <FormItem label="上级部门" prop="superiorDepartment">
          <Input v-model="formData.superiorDepartment" placeholder="上级部门" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <FormItem label="部门职位" prop="departmentPositions">
          <Input v-model="formData.departmentPositions" placeholder="部门职位" />
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
        }
      ],
      departData: [],
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      // formData: [
      //   name: '',
      //   description: ''
      // ],
      formData: {
        // name: ''
      },
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '菜单项不可以为空', trigger: 'blur' }
        ]
      },
      currentRowId: '',
      currentRow: ''
    }
  },
  created: function () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getDepartData()
  },
  methods: {
    add () {
      this.formData.createDate = getDate(new Date())
      this.formData.modificationDate = ''
      this.showAddModal = true
    },
    edit () {
      this.formData.modificationDate = getDate(new Date())
      this.showEditModal = true
    },
    remove () {
      this.showDeleteModal = true
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let url = '/department/saveOrUpdate?access_token=' + localStorage.getItem('jwtToken')
          // let url = '/department/saveOrUpdate?access_token=' + localStorage.getItem('jwtToken') + '&superiorDepartmentId=' + this.formData.superiorDepartment
          this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            debugger
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
    cancelAdd () {},
    confirmEdit () {},
    cancelEdit () {},
    confirmDelete () {},
    cancelDelete () {},
    getDepartData () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let pageNo = 0
      let pageSize = 20
      let url = '/department/listDepartmentPage/pageSize/' + pageSize + '/pageNo/' + pageNo
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.departData = res.data.content
        }
      })
    },
    handleClickRow (data, index) {
      this.currentRowId = data.id
      this.currentRow = data
    }
  },
  components: {
    btnManage
  }
}
</script>

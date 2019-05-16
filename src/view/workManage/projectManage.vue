<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入名称进行查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="projectTable"
      :columns="columns"
      :data="projectData"
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
          :total="projectDataTotal"
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
      title="添加项目">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="项目名称" prop="name">
          <Input v-model="formData.name" placeholder="项目名称" />
        </FormItem>
        <FormItem label="项目编号" prop="no">
          <Input v-model="formData.no" placeholder="项目编号" />
        </FormItem>
        <FormItem label="标段" prop="section">
          <Input v-model="formData.section" placeholder="标段" />
        </FormItem>
        <FormItem label="项目状态" prop="projectStatus">
          <Select style="width:200px" v-model="formData.projectStatus">
            <Option v-for="item in projectStatusItem" :value="item" :key="item.id" name="projectStatus">{{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="施工单位" prop="construction">
          <Input v-model="formData.construction" placeholder="施工单位" />
        </FormItem>
        <FormItem label="建设单位" prop="development">
          <Input v-model="formData.development" placeholder="建设单位" />
        </FormItem>
        <FormItem label="项目经理" prop="manager">
          <Select style="width:200px" v-model="formData.manager">
            <Option v-for="item in managerItem" :value="item" :key="item.id" name="manager">{{item.name }}
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
      title="修改项目">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="项目名称" prop="name">
          <Input v-model="formData.name" placeholder="项目名称" />
        </FormItem>
        <FormItem label="项目编号" prop="no">
          <Input v-model="formData.no" placeholder="项目编号" />
        </FormItem>
        <FormItem label="标段" prop="section">
          <Input v-model="formData.section" placeholder="标段" />
        </FormItem>
        <FormItem label="项目状态" prop="projectStatus">
          <Select style="width:200px" v-model="formData.projectStatus" :placeholder="currentProjectStatusName">
            <Option v-for="item in projectStatusItem" :value="item" :key="item.id" name="projectStatus">{{item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="施工单位" prop="construction">
          <Input v-model="formData.construction" placeholder="施工单位" />
        </FormItem>
        <FormItem label="建设单位" prop="development">
          <Input v-model="formData.development" placeholder="建设单位" />
        </FormItem>
        <FormItem label="项目经理" prop="manager">
          <Select style="width:200px" v-model="formData.manager" :placeholder="currentManagerName">
            <Option v-for="item in managerItem" :value="item" :key="item.id" name="manager">{{item.name }}
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '项目编号',
          key: 'no',
          width: 88
        },
        {
          title: '项目名称',
          key: 'name',
          width: 115
        },
        {
          title: '标段',
          key: 'section',
          width: 100
        },
        {
          title: '项目状态',
          key: 'projectStatus',
          width: 100,
          render: (h, params) => {
            const row = params.row
            return h('span', row.projectStatus.name)
          }
        },
        {
          title: '施工单位',
          key: 'construction',
          width: 100
        },
        {
          title: '建设单位',
          key: 'development',
          width: 100
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 110,
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
          width: 110,
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
          title: '项目经理',
          key: 'manager',
          width: 100,
          render: (h, params) => {
            const row = params.row
            return h('span', row.manager.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          fixed: 'right'
        }
      ],
      buttonList: [],
      formData: {},
      projectData: [],
      pageNo: 0,
      pageSize: 2,
      projectDataTotal: 0,
      searchData: '',
      currentManagerName: '',
      currentProjectStatusName: '',
      projectStatusItem: [],
      managerItem: [],
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false,
      currentRowId: '',
      ruleValidate: {
        name: [
          { required: true, message: '项目名称不可以为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getProjectPage()
    this.getProjectStatus()
    this.getManager()
  },
  methods: {
    getProjectPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        projectName: this.searchData
      }
      let url = '/project/listProjectPage/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.projectData = res.data.content
          this.projectDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
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
      this.showEditModal = true
      this.currentManagerName = row.manager.name
      this.currentProjectStatusName = row.projectStatus.name
    },
    // 获取项目状态
    getProjectStatus () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/projectStatus/listAllProjectStatus'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.projectStatusItem = res.data
        }
      })
    },
    getManager () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/employee/listAllEmployees'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.managerItem = res.data
        }
      })
    },
    search () {
      this.pageNo = 0
      this.getProjectPage()
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/project/saveProject?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getProjectPage()
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
          this.$http.postForm('/project/saveProject?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getProjectPage()
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
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/project/delete/projectId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getProjectPage()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$refs.projectTable.clearCurrentRow()
      this.$Message.info('您已取消删除！')
    },
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    }
  },
  watch: {
    pageNo: function () {
      this.getProjectPage()
    },
    pageSize: function () {
      this.getProjectPage()
    },
    buttonList: function (val) {
      val.forEach(element => {
        if (element.buttonId === 'editBtn') {
          this.showAddBtn = true
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

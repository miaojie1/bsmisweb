<template>
  <div>
    <Row :gutter="18">
      <i-col span="5">
        <Input suffix="ios-search" placeholder="请输入考卷名称进行查询···" v-model="searchTestPaperName"/>
      </i-col>
      <i-col span="5">
        <Select style="width:200px" v-model="searchTestPaperCategory"  @change="changeCategory($event)" placeholder="请选择类别">
          <Option v-for="(item,index) in testPaperCategoryItem" :value="item.id" :key="index">{{item.description}}
          </Option>
        </Select>
      </i-col>
      <i-col span="5">
        <Select style="width:200px" v-model="searchDepartment"  @change="changeDepartment($event)" placeholder="请选择部门">
          <Option v-for="(item,index) in departmentItem" :value="item.id" :key="index">{{item.name}}
          </Option>
        </Select>
      </i-col>
      <i-col span="5">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="testPaperData"
      style="margin-top: 15px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="info" size="small" style="margin-right: 1px" @click="showTestPaperDetail(row, index)">试题管理</Button>
        <Button type="primary" size="small" style="margin-right: 1px" @click="test(row, index)">考试</Button>
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
          :total="testPaperDataTotal"
          :current="pageNo+1"
          :page-size="pageSize"
          :page-size-opts=[5,10,15]
          @on-change="changePageNo"
          @on-page-size-change="changePageSize">
        </Page>
      </div>
    </div>
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
      v-model="showEditModal"
      title="修改考卷">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="试卷名称" prop="testPaperName">
          <Input v-model="formData.testPaperName" placeholder="试卷名称" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <FormItem label="试卷总分" prop="fullScore">
          <Input v-model="formData.fullScore" type="number" placeholder="试卷总分" />
        </FormItem>
        <FormItem label="试卷类别" prop="testPaperCategory">
          <Select style="width:200px" v-model="formData.testPaperCategory" :placeholder="currentTestPaperCategoryName">
            <Option v-for="item in testPaperCategoryItem" :value="item" :key="item.id" name="testPaperCategory">{{item.description}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="所属部门" prop="department">
          <Select style="width:200px" v-model="formData.department" :placeholder="currentDepartmentName">
            <Option v-for="item in departmentItem" :value="item" :key="item.id" name="department">{{item.name }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData')">提交</Button>
        <Button @click="cancelEdit('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    </Modal>
        <Modal
      v-model="showAddModal"
      title="增加试卷">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="试卷名称" prop="testPaperName">
          <Input v-model="formData.testPaperName" placeholder="试卷名称" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <FormItem label="试卷总分" prop="fullScore">
          <Input v-model="formData.fullScore" type="number" placeholder="试卷总分" />
        </FormItem>
        <FormItem label="试卷类别" prop="testPaperCategory">
          <Select style="width:200px" v-model="formData.testPaperCategory">
            <Option v-for="item in testPaperCategoryItem" :value="item" :key="item.id" name="testPaperCategory">{{item.description}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="所属部门" prop="department">
          <Select style="width:200px" v-model="formData.department">
            <Option v-for="item in departmentItem" :value="item" :key="item.id" name="department">{{item.name }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdd('formData')">提交</Button>
        <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
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
          title: '试卷名称',
          key: 'testPaperName',
          width: 150
        },
        {
          title: '备注',
          key: 'remark',
          width: 160
        },
        {
          title: '试卷总分',
          key: 'fullScore',
          width: 100
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 120,
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
          title: '试卷类别',
          key: 'testPaperCategory',
          width: 121,
          render: (h, params) => {
            const row = params.row
            return h('span', row.testPaperCategory.description)
          }
        },
        {
          title: '所属部门',
          key: 'department',
          width: 123,
          render: (h, params) => {
            const row = params.row
            return h('span', row.department.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 300,
          fixed: 'right'
        }
      ],
      testPaperData: [],
      formData: {},
      pageNo: 0,
      pageSize: 2,
      testPaperDataTotal: 0,
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false,
      currentDepartmentName: '',
      currentTestPaperCategoryName: '',
      currentRowId: '',
      eid: '',
      buttonList: [],
      searchTestPaperName: '',
      searchTestPaperCategory: '',
      searchDepartment: '',
      testPaperCategoryItem: [],
      departmentItem: [],
      ruleValidate: {
        testPaperName: [
          { required: true, message: '学习资料名称不可以为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getTestPaperPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        testPaperName: this.searchTestPaperName,
        testPaperCategoryId: this.searchTestPaperCategory,
        departmentId: this.searchDepartment
      }
      let url = '/testPaper/listTestPaper' + '/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.testPaperData = res.data.content
          this.testPaperDataTotal = res.data.totalElements
        }
      })
    },
    showTestPaperDetail (row, index) {
      this.$router.push('/testPaperDetail/listTestPaperDetail' + row.id)
    },
    test (row, index) {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        testPaperId: row.id
      }
      let url = '/examinationRecord/addExaminationRecord'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.eid = res.data.object.id
          this.$Message.success(res.data.message + '，开始考试')
          this.$router.push({name: '考试', params: {id: row.id, eid: this.eid}})
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
      if (row.testPaperCategory != null) {
        this.currentTestPaperCategoryName = row.testPaperCategory.description
      }
      if (row.department != null) {
        this.currentDepartmentName = row.department.name
      }
    },
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/testPaper/saveTestPaper?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getTestPaperPage()
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
          this.$http.postForm('/testPaper/saveTestPaper?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getTestPaperPage()
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
    changeCategory (event) {
      this.searchTestPaperCategory = event.target.value
    },
    changeDepartment (event) {
      this.searchDepartment = event.target.value
    },
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/testPaper/delete/testPaperId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getTestPaperPage()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$Message.info('您已取消删除！')
    },
    getTestPaperCategory () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/testPaper/listAllTestPaperCategories'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.testPaperCategoryItem = res.data
        }
      })
    },
    getDepartment () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/testPaper/listAllDepartment'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.departmentItem = res.data
        }
      })
    },
    search () {
      this.pageNo = 0
      this.getTestPaperPage()
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getTestPaperPage()
    this.getTestPaperCategory()
    this.getDepartment()
  },
  watch: {
    pageNo: function () {
      this.getTestPaperPage()
    },
    pageSize: function () {
      this.getTestPaperPage()
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

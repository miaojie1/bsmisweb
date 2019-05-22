<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入试题题目进行查询···" v-model="searchTestPaperDetailName"/>
      </i-col>
      <i-col span="3">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="testPaperDetailData"
      style="margin-top: 15px"
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
          :total="testPaperDetailDataTotal"
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
      title="修改试题">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="试题名称" prop="testPaperDetailName">
          <Input v-model="formData.testPaperDetailName" placeholder="试题名称" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <FormItem label="试题内容" prop="content">
          <Input v-model="formData.content" placeholder="试题内容" />
        </FormItem>
        <FormItem label="题目分值" prop="fullScore">
          <Input v-model="formData.fullScore" type="number" placeholder="题目分值" />
        </FormItem>
        <FormItem label="试题答案" prop="answer">
          <Input v-model="formData.answer" placeholder="试题答案" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData')">提交</Button>
        <Button @click="cancelEdit('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showAddModal"
      title="增加试题">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="试题名称" prop="testPaperDetailName">
          <Input v-model="formData.testPaperDetailName" placeholder="试题名称" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <FormItem label="试题内容" prop="content">
          <Input v-model="formData.content" placeholder="试题内容" />
        </FormItem>
        <FormItem label="题目分值" prop="fullScore">
          <Input v-model="formData.fullScore" type="number" placeholder="题目分值" />
        </FormItem>
        <FormItem label="试题答案" prop="answer">
          <Input v-model="formData.answer" placeholder="试题答案" />
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
          title: '试题名称',
          key: 'testPaperDetailName'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '试题内容',
          key: 'content'
        },
        {
          title: '题目分值',
          key: 'fullScore'
        },
        {
          title: '试题答案',
          key: 'answer'
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
          title: '所属试卷',
          key: 'testPaper',
          render: (h, params) => {
            const row = params.row
            return h('span', row.testPaper.testPaperName)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          fixed: 'right'
        }
      ],
      testPaperDetailData: [],
      formData: {},
      pageNo: 0,
      pageSize: 2,
      testPaperDetailDataTotal: 0,
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false,
      currentRowId: '',
      buttonList: [],
      searchTestPaperDetailName: '',
      ruleValidate: {
        testPaperDetailName: [
          { required: true, message: '试题题目不可以为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    requsetData (id) {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        testPaperDetailName: this.searchTestPaperDetailName,
        testPaperId: id
      }
      let url = '/testPaperDetail/listTestPaperDetailByTestPaperPage/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.testPaperDetailData = res.data.content
          this.testPaperDetailDataTotal = res.data.totalElements
        }
      })
    },
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
    },
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/testPaperDetail/saveTestPaperDetail?testPaperId=' + this.$route.params.id + '&access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.$Message.success(res.data.message)
              let id = this.$route.params.id
              this.requsetData(id)
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
          this.$http.postForm('/testPaperDetail/saveTestPaperDetail?testPaperId=' + this.$route.params.id + '&access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.$Message.success(res.data.message)
              let id = this.$route.params.id
              this.requsetData(id)
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
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/testPaperDetail/delete/testPaperDetailId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          let id = this.$route.params.id
          this.requsetData(id)
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$refs.projectTable.clearCurrentRow()
      this.$Message.info('您已取消删除！')
    },
    search () {
      this.pageNo = 0
      let id = this.$route.params.id
      this.requsetData(id)
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    let id = this.$route.params.id
    this.requsetData(id)
  },
  watch: {
    pageNo: function () {
      let id = this.$route.params.id
      this.requsetData(id)
    },
    pageSize: function () {
      let id = this.$route.params.id
      this.requsetData(id)
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

<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入文档库进行查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      ref="documentFolderTable"
      :columns="columns"
      :data="documentFolderData"
      style="margin-top: 30px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="info" size="small" @click="showDocuments(row, index)">查看</Button>
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
          :total="documentFolderDataTotal"
          :current="pageNo+1"
          :page-size="pageSize"
          :page-size-opts=[5,10,15]
          @on-change="changePageNo"
          @on-page-size-change="changePageSize"
          ></Page>
      </div>
    </div>
    <Modal
      v-model="showEditModal"
      title="修改文档库">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="文档库名称" prop="name">
          <Input v-model="formData.name" placeholder="文档库名称" />
        </FormItem>
        <FormItem label="文档库描述" prop="description">
          <Input v-model="formData.description" placeholder="文档库描述" />
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
          title: '文档库名称',
          key: 'name',
          width: 153
        },
        {
          title: '文档库描述',
          key: 'description',
          width: 600
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
          title: '操作',
          slot: 'action',
          width: 200,
          fixed: 'right'
        }
      ],
      buttonList: [],
      formData: {},
      documentFolderData: [],
      pageNo: 0,
      pageSize: 2,
      documentFolderDataTotal: 0,
      searchData: '',
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false,
      currentRowId: '',
      ruleValidate: {
        name: [
          { required: true, message: '文档库名称不可以为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getDocumentFolderPage()
  },
  methods: {
    getDocumentFolderPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        documentFolderName: this.searchData
      }
      let url = '/documentFolder/listDocumentFolderPage/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.documentFolderData = res.data.content
          this.documentFolderDataTotal = parseInt(res.data.totalElements)
          console.log(res)
        }
      })
    },
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    showDocuments (row, index) {
      this.$router.push('/document/listDocumentDetail' + row.id)
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
    },
    search () {
      this.pageNo = 0
      this.getDocumentFolderPage()
    },
    confirmEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/documentFolder/saveDocumentFolder?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getDocumentFolderPage()
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
      let url = '/documentFolder/delete/documentFolderId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getDocumentFolderPage()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$refs.documentFolderTable.clearCurrentRow()
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
      this.getDocumentFolderPage()
    },
    pageSize: function () {
      this.getDocumentFolderPage()
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

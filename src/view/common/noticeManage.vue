<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入标题进行查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary" v-show="showAddBtn">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="postingData"
      style="margin-top: 15px"
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
          :total="postingDataTotal"
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
      title="添加公告">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="公告标题" prop="name">
          <Input v-model="formData.name" placeholder="公告标题" />
        </FormItem>
        <FormItem label="公告内容" prop="content">
          <Input v-model="formData.content" placeholder="公告内容" />
        </FormItem>
        <FormItem label="生效-失效日期" prop="effectAndExpireDate">
          <DatePicker type="daterange"
            placement="bottom-end"
            placeholder="选择生效日期以及失效日期"
            confirm
            v-model="effectAndExpireDate"
            @on-change="changeEffectAndExpireDate"
            @on-clear="handleClearDate"
            ></DatePicker>
        </FormItem>
        <!-- <FormItem label="添加附件" prop="attachments">
          <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button icon="ios-cloud-upload-outline">点击上传附件</Button>
          </Upload>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdd('formData')">提交</Button>
        <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showEditModal"
      title="修改公告">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="公告标题" prop="name">
          <Input v-model="formData.name" placeholder="公告标题" />
        </FormItem>
        <FormItem label="公告内容" prop="content">
          <Input v-model="formData.content" placeholder="公告内容" />
        </FormItem>
        <FormItem label="生效-失效日期" prop="effectAndExpireDate">
          <DatePicker type="daterange"
          placement="bottom-end"
          :placeholder="effectAndExpireDate"
          confirm
          v-model="effectAndExpireDate"
          @on-change="changeEffectAndExpireDate"
          @on-clear="handleClearDate"
          ></DatePicker>
        </FormItem>
        <!-- <FormItem label="添加附件" prop="attachments">
          <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button icon="ios-cloud-upload-outline">点击上传附件</Button>
          </Upload>
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
export default {
  data () {
    return {
      columns: [
        {
          title: '公告标题',
          key: 'name'
        },
        {
          title: '公告内容',
          key: 'content'
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
          title: '生效时间',
          key: 'effectDate',
          render: (h, params) => {
            const effectDate = params.row.effectDate
            if (effectDate === null || effectDate === '') {
              return h('span', '')
            } else {
              return h('span', effectDate.substring(0, 10))
            }
          }
        },
        {
          title: '失效时间',
          key: 'expireDate',
          render: (h, params) => {
            const expireDate = params.row.expireDate
            if (expireDate === null || expireDate === '') {
              return h('span', '')
            } else {
              return h('span', expireDate.substring(0, 10))
            }
          }
        },
        {
          title: '发布人',
          key: 'announcer',
          render: (h, params) => {
            const row = params.row
            return h('Tag', row.announcer.name)
          }
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
      postingData: [],
      buttonList: [],
      pageNo: 0,
      pageSize: 2,
      postingDataTotal: 0,
      showAddBtn: false,
      showEditBtn: false,
      showDeleteBtn: false,
      searchData: '',
      formData: {},
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '公告标题不可以为空', trigger: 'blur' }
        ]
      },
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      effectAndExpireDate: '',
      currentRowId: '',
      currentRow: ''
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    localStorage.setItem('operation', JSON.stringify(this.$route.params.operation))
    this.getPostingPage()
  },
  methods: {
    getPostingPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        postingName: this.searchData
      }
      let url = '/posting/listPostingPage/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.postingData = res.data.content
          this.postingDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    changeEffectAndExpireDate (val, value) {
      this.formData.effectDate = val[0]
      this.formData.expireDate = val[1]
    },
    handleClearDate () {
      this.formData.effectDate = ''
      this.formData.expireDate = ''
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/posting/savePosting?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getPostingPage()
              this.$refs.formData.resetFields()
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
      this.$Message.info('您已取消增加！')
    },
    edit (row, index) {
      this.formData = row
      this.effectAndExpireDate = row.effectDate.substring(0, 10) + '-' + row.expireDate.substring(0, 10)
      this.showEditModal = true
    },
    confirmEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/posting/savePosting?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getPostingPage()
              this.$refs.formData.resetFields()
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
      this.$refs.formData.resetFields()
      this.showEditModal = false
      this.$Message.info('您已取消修改！')
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/posting/delete/postingId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getPostingPage()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.$Message.info('您已取消删除！')
    },
    search () {
      this.pageNo = 0
      this.getPostingPage()
    },
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    },
    handleClickRow (data, index) {
      this.currentRowId = data.id
      this.currentRow = data
      this.formData = data
    }
  },
  watch: {
    pageNo: function () {
      this.getPostingPage()
    },
    pageSize: function () {
      this.getPostingPage()
    },
    buttonList: function (val) {
      val.forEach(element => {
        if (element.buttonId === 'addBtn') {
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

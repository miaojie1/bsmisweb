<template>
    <div>
        <Row :gutter="16">
            <i-col span="8">
                <Input suffix="ios-search" placeholder="请输入文件名称查询···" v-model="searchData"/>
            </i-col>
            <i-col span="8">
                <Button @click="search" type="primary">查询</Button>
                <Button @click="add" type="primary">增加</Button>
            </i-col>
        </Row>
        <Table
            border
            highlight-row
            ref="knowledgeTable"
            :columns="columns"
            :data="knowledgeData"
            style="margin-top: 30px; border: 0"
            size="small">
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot="action" slot-scope="{ row, index }">
                <Button type="error" size="small" v-show="showDeleteBtn" @click="remove(row, index)">删除</Button>
                <Button type="primary" size="small" v-show="showDowloadBtn" @click="dowloadKnowledge(row, index)">下载</Button>
            </template>
        </Table>
        <Modal v-model="showAddModal" title="新增知识库">
            <Form ref="formData" :model="formData" :label-width="100">
                <Upload
                    :action="actionUrl"
                    :data="formData"
                    :on-success="onFileSuccess"
                    name="file">
                    <Button icon="ios-cloud-upload-outline">点击上传附件</Button>
                </Upload>
                <!-- <FormItem label="文件类型" prop="fileCategory">
                    <Input v-model="formData.fileCategory" placeholder="文件类型" />
                </FormItem> -->
            </Form>
            <div slot="footer">
                <Button @click="cancelAdd()" style="margin-left: 8px">取消</Button>
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
      fileFolderId: '',
      fileFolderName: '',
      fileFolder: {},
      fileCategory: {},
      columns: [
        {
          title: '文件名',
          key: 'fileName'
        },
        {
          title: '文件路径',
          key: 'fileUrl',
          render: (h, params) => {
            const row = params.row
            return h('a', {
              on: {
                click () {
                //   this.dowloadKnowledge()
                }
              }
            }, row.fileUrl)
          }
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '文件夹',
          key: 'fileFolder',
          render: (h, params) => {
            const row = params.row
            return h('span', row.fileFolder.name)
          }
        },
        {
          title: '文件类型',
          key: 'fileCategory',
          render: (h, params) => {
            const row = params.row
            return h('span', row.fileCategory.name)
          }
        },
        {
          title: '发布者',
          key: 'republisher',
          render: (h, params) => {
            const row = params.row
            return h('span', row.republisher.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 180,
          fixed: 'right'
        }
      ],
      formData: {
        fileFolderId: ''
      },
      ruleValidate: [],
      knowledgeData: [],
      searchData: '',
      actionUrl: '',
      file: '',
      showAddModal: false,
      showDeleteBtn: true,
      showDowloadBtn: true,
      showDeleteModal: false,
      currentRowId: ''
    }
  },
  created () {
    this.fileFolderId = this.$route.query.fileFolderId
    this.fileFolderName = this.$route.query.fileFolderName
    this.fileFolder = this.$route.query.fileFolder
    this.formData.fileFolderId = this.fileFolderId
    this.getKnowledgeByFolder()
  },
  methods: {
    add () {
      this.actionUrl = 'http://127.0.0.1:8082/supervision/knowledge/uploadKnowledge?access_token=' + localStorage.getItem('jwtToken')
      this.showAddModal = true
      this.getKnowledgeByFolder()
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.showDeleteModal = true
    },
    onFileSuccess (response, file, fileList) {
      this.showAddModal = false
      this.getKnowledgeByFolder()
    },
    getKnowledgeByFolder () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/knowledge/findKnowledgeByFileFolder?fileFolderId=' + this.fileFolderId
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.knowledgeData = res.data
        }
      })
    },
    // beforeUpload () {
    //   this.$http.postForm('/knowledge/uploadKnowledge?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
    //     this.showAddFileFolderModal = false
    //     if (res.data.status === true) {
    //       this.getKnowledgeByFolder()
    //       this.$Message.success(res.data.message)
    //     } else {
    //       this.$Message.error(res.data.message)
    //     }
    //   })
    // },
    search () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      console.log(this.searchData)
      let url = '/knowledge/findKnowledgeByFileNameAndFolder?fileName=' + this.searchData + '&fileFolderId=' + this.fileFolderId
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.knowledgeData = res.data
        }
      })
    },
    cancelAdd (name) {
      this.$refs[name].resetFields()
      this.showAddModal = false
      this.$Message.info('您已取消增加！')
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/knowledge/delete/knowledge/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getKnowledgeByFolder()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$Message.info('您已取消删除！')
    },
    // 下载附件
    dowloadKnowledge (row) {
      let filePath = row.fileName
      // 由于是ajax调用下载方法，下载数据不会直接下载到本地，所以再创建一个a标签，给它一个 download 属性（HTML5新属性）
      let url = '/knowledge/downloadKnowledge?access_token=' + localStorage.getItem('jwtToken')
      this.$http.upload(url, filePath).then((data) => {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(data.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        // 获取文件名
        let fileName = row.fileName
        // if (filePath.indexOf('/') !== -1) {
        //   fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
        // } else {
        //   fileName = filePath
        // }
        // download 属性定义了下载链接的地址而不是跳转路径
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>

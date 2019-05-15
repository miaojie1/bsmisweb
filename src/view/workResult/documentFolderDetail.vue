<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入文件名进行查询···" v-model="searchDocumentName"/>
      </i-col>
      <i-col span="5">  
        <Select style="width:200px" v-model="searchDocumentCategory"  @change="changeCategory($event)">
          <Option v-for="(item,index) in documentCategoryItem" :value="item.id" :key="index">{{item.name}}
          </Option>
        </Select>
      </i-col>
      <i-col span="3">
        <Button @click="search" type="primary">查询</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="documentData"
      style="margin-top: 15px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="info" size="small" style="margin-right: 1px" @click="downloadDocument(row, index)">下载</Button>
        <Button type="error" size="small" @click="remove(row, index)">删除</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          show-sizer
          :total="documentDataTotal"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '文档名称',
          key: 'documentName'
        },
        {
          title: '文档Url',
          key: 'documentUrl'
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
          title: '文档类型',
          key: 'documentCategory',
          render: (h, params) => {
            const row = params.row
            return h('span', row.documentCategory.name)
          }
        },
        {
          title: '上传者',
          key: 'uploader',
          render: (h, params) => {
            const row = params.row
            return h('span', row.uploader.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          fixed: 'right'
        }
      ],
      documentData: [],
      pageNo: 0,
      pageSize: 2,
      documentDataTotal: 0,
      showDeleteModal: false,
      currentRowId: '',
      buttonList: [],
      searchDocumentName: '',
      searchDocumentCategory: '',
      documentCategoryItem: []
    }
  },
  methods: {
    requsetData (id) {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        documentName: this.searchDocumentName,
        documentCategoryId: this.searchDocumentCategory
      }
      let url = '/document/listDocumentByFolderPage/documentFolderId/' + id + '/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.documentData = res.data.content
          this.documentDataTotal = res.data.totalElements
        }
      })
    },
    changeCategory (event) {
      this.searchDocumentCategory = event.target.value
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
      let url = '/document/delete/documentId/' + this.currentRowId
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
    // 下载
    downloadDocument (row, index) {
      let filePath = row.documentName
      console.log(row)
      // 由于是ajax调用下载方法，下载数据不会直接下载到本地，所以再创建一个a标签，给它一个 download 属性（HTML5新属性）
      let url = '/document/download?access_token=' + localStorage.getItem('jwtToken')
      this.$http.upload(url, filePath).then((data) => {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(data.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        // 获取文件名
        let fileName = null
        if (filePath.indexOf('/') !== -1) {
          fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
        } else {
          fileName = filePath
        }
        // download 属性定义了下载链接的地址而不是跳转路径
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    },
    getDocumentCategory () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/documentCategory/listAllDocumentCategories'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.documentCategoryItem = res.data
        }
      })
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
    this.getDocumentCategory()
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
        if (element.buttonId === 'deleteBtn' || element.buttonId === 'batchDel' || element.buttonId === 'delBtn') {
          this.showDeleteBtn = true
        }
      })
    }
  }
}
</script>

<style>
</style>

<template>
  <div>
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
        }
      ],
      documentData: [],
      pageNo: 0,
      pageSize: 2,
      documentDataTotal: 0
    }
  },
  methods: {
    requsetData (id) {
      let data = {
        access_token: localStorage.getItem('jwtToken')
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
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    }
  },
  created () {
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
    }
  }
}
</script>

<style>
</style>

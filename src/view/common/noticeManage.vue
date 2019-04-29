<template>
  <div>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="postingData"
      style="margin-top: 15px"
      size="small">
    </Table>
  </div>
</template>

<script>
import {formatDate} from '../../common/filters/dateFilters.js'
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
            return h('Tag',
              formatDate(new Date(params.row.createDate), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '修改时间',
          key: 'modificationDate',
          render: (h, params) => {
            return h('Tag',
              formatDate(new Date(params.row.modificationDate), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '生效时间',
          key: 'effectDate',
          render: (h, params) => {
            return h('Tag',
              formatDate(new Date(params.row.effectDate), 'yyyy-MM-dd hh:mm')
            )
          }
        },
        {
          title: '失效时间',
          key: 'expireDate',
          render: (h, params) => {
            return h('Tag',
              formatDate(new Date(params.row.expireDate), 'yyyy-MM-dd hh:mm')
            )
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
        }
      ],
      postingData: []
    }
  },
  created () {
    localStorage.setItem('operation', JSON.stringify(this.$route.params.operation))
    this.getPostingPage()
  },
  methods: {
    getPostingPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let pageNo = '0'
      let pageSize = '20'
      let url = '/posting/listPostingPage/pageNo/' + pageNo + '/pageSize/' + pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.postingData = res.data.content
        }
      })
    }
  }
}
</script>

<style>

</style>

<template>
    <div>
        <Row :gutter="16">
            <i-col span="8">
                <Input suffix="ios-search" placeholder="输入部位名称查询" v-model="partName"/>
            </i-col>
            <i-col span="8">
                <Button @click="search" type="primary">查询</Button>
                <Button @click="add" type="primary">添加</Button>
            </i-col>
        </Row>
        <Table
        border
        highlight-row
        ref="sideStationTable"
        :columns="columns"
        :data="sideStationData"
        style="margin-top: 30px"
        size="small">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
        <!-- <template slot="action" slot-scope="{ row, index }">
            <Button type="primary" size="small" style="margin-right: 1px"
            v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.sponsor.id && row.isSubmit === 0)" @click="edit(row, index)">编辑</Button>
            <Button type="error" size="small"
            v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.sponsor.id && row.isSubmit === 0)" @click="remove(row, index)">删除</Button>
            <Button type="success" size="small" @click="showFlows(row,index)">流程图</Button>
        </template> -->
        </Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page
                show-total
                show-elevator
                show-sizer
                :total="dataTotal"
                :current="pageNo+1"
                :page-size="pageSize"
                :page-size-opts=[5,10,15]
                @on-change="changePageNo"
                @on-page-size-change="changePageSize"
                ></Page>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 分页
      pageSize: 5,
      pageNo: 0,
      dataTotal: 0,
      // 模糊查询
      partName: '',
      // 表格显示数据
      sideStationData: [],
      // 表单暂存（增加修改时用）
      formData: {},
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 100
        },
        {
          title: '部位',
          key: 'partName',
          width: 110
        },
        {
          title: '所属项目',
          key: 'project',
          width: 140,
          render: (h, params) => {
            let projec = params.row.project
            return h('span', projec.name)
          }
        },
        {
          title: '创建人',
          key: 'sponsor',
          width: 150,
          render: (h, params) => {
            let employee = params.row.sponsor
            return h('span', employee.username)
          }
        },
        {
          title: '创建日期',
          key: 'createDate',
          width: 200
        },
        {
          title: '状态',
          key: 'status',
          width: 150,
          render: (h, params) => {
            let newStatus = params.row.status
            return h('span', newStatus.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 223,
          fixed: 'right'
        }
      ]
    }
  },
  methods: {
    getSideStationDataList () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        partName: this.partName
      }
      let url = '/sideStation/listSideStation'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.sideStationData = res.data.content
          this.dataTotal = res.data.totalElements
        }
      })
    }
  },
  watch: {
    pageNo: function () {
      this.getSideStationDataList()
    },
    pageSize: function () {
      this.getSideStationDataList()
    }
  }
}
</script>

<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" placeholder="请输入标题进行查询···" v-model="searchData"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary" v-show="showAddBtn">添加</Button>
        <!-- <Button @click="edit" type="primary" style="marign-left: 10px">测试修改</Button> -->
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="postingData"
      style="margin-top: 15px"
      size="small">
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
          <DatePicker type="datetimerange"
            placement="bottom-end"
            placeholder="选择生效日期以及失效日期"
            confirm
            v-model="effectAndExpireDate"
            @on-change="changeEffectAndExpireDate"
            @on-clear="handleClearDate"
            ></DatePicker>
        </FormItem>
        <FormItem label="添加附件" prop="attachments">
          <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button icon="ios-cloud-upload-outline">点击上传附件</Button>
          </Upload>
        </FormItem>
        <FormItem label="版本" prop="version">
          <Input v-model="formData.version" placeholder="版本" />
        </FormItem>
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
        <FormItem label="菜单项" prop="name">
          <Input v-model="formData.name" placeholder="菜单项" />
        </FormItem>
        <FormItem label="URL" prop="url">
          <Input v-model="formData.url" placeholder="URL" />
        </FormItem>
        <FormItem label="状态" prop="status">
          <i-switch v-model="formData.status" @on-change="changeStatus">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注"/>
        </FormItem>
        <FormItem label="是否根菜单" prop="rootMenu">
          <i-switch v-model="formData.rootMenu" @on-change="changeRootMenu">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="父菜单" prop="parentMenuId">
          <Select v-model="formData.parentMenuId">
            <Option v-for="item in menuData" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="版本" prop="version">
          <Input v-model="formData.version" placeholder="版本" />
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
      formData: {
        name: '',
        content: '',
        expireDate: '',
        effectDate: '',
        attachments: []
      },
      // 校验规则
      ruleValidate: {
        name: [
          { required: true, message: '公告标题不可以为空', trigger: 'blur' }
        ]
      },
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      effectAndExpireDate: ''
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
        paramJson: this.searchData
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
          this.$http.postAndAttach('/posting/savePosting?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getPostingPage()
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
      this.$Message.info('您已取消增加！')
    },
    edit () {
      this.showEditModal = true
    },
    confirmEdit () {},
    cancelEdit () {
      this.showEditModal = false
      this.$Message.info('您已取消修改！')
    },
    remove (row, index) {
      this.showDeleteModal = true
    },
    confirmDelete () {},
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
        } else if (element.buttonId === 'editBtn') {
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

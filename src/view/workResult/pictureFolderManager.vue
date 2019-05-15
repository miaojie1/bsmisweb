<template>
    <div>
        <Row :gutter="16">
            <i-col span="8">
                <Input suffix="ios-search" placeholder="请输入文件夹名称查询···" v-model="searchData"/>
            </i-col>
            <i-col span="8">
                <Button @click="search" type="primary">查询</Button>
                <Button @click="add" type="primary">新建文件夹</Button>
            </i-col>
        </Row>
        <Table
        border
        highlight-row
        ref="pictureFolderTable"
        :columns="columns"
        :data="pictureFolderData"
        style="margin-top: 30px"
        size="small">
        <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
        </template>
        <template slot="action" slot-scope="{ row, index }">
            <Button type="primary" size="small" @click="openPictureFolder(row, index)">打开</Button>
            <Button type="success" size="small" @click="edit(row,index)">修改</Button>
            <Button type="error" size="small" @click="remove(row, index)">删除</Button>
        </template>
        </Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page
                show-total
                show-elevator
                show-sizer
                :total="pictureDataTotal"
                :current="pageNo+1"
                :page-size="pageSize"
                :page-size-opts=[5,10,15]
                @on-change="changePageNo"
                @on-page-size-change="changePageSize"
                ></Page>
            </div>
        </div>
        <Modal v-model="showAddPictureFolderModal" title="新增文件夹">
          <Form ref="formPictureFoderData" :model="formPictureFoderData" :rules="ruleValidate" :label-width="100">
            <FormItem label="文件夹名字" prop="name">
              <Input v-model="formPictureFoderData.name" placeholder="文件夹名字" />
            </FormItem>
            <FormItem label="文件夹描述" prop="description">
              <Input v-model="formPictureFoderData.description" placeholder="文件夹描述" />
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="confirmAdd('formPictureFoderData')">提交</Button>
            <Button @click="cancelAdd('formPictureFoderData')" style="margin-left: 8px">取消</Button>
          </div>
        </Modal>
        <Modal v-model="showEditPictureFolderModal" title="修改文件夹信息">
          <Form ref="formPictureFoderData" :model="formPictureFoderData" :rules="ruleValidate" :label-width="100">
            <FormItem label="文件夹名字" prop="name">
              <Input v-model="formPictureFoderData.name" placeholder="文件夹名字" />
            </FormItem>
            <FormItem label="文件夹描述" prop="description">
              <Input v-model="formPictureFoderData.description" placeholder="文件夹描述" />
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="confirmEdit('formPictureFoderData')">提交</Button>
            <Button @click="cancelEdit('formPictureFoderData')" style="margin-left: 8px">取消</Button>
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
            <p>您确认删除文件夹及照片?</p>
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
      pictureFolderData: [],
      formPictureFoderData: {},
      ruleValidate: {
        name: [
          { required: true, message: '文件夹名称不可以为空', trigger: 'blur' }
        ]
      },
      // 分页使用
      pageNo: 0,
      pageSize: 5,
      pictureDataTotal: 0,
      showAddPictureFolderModal: false,
      showEditPictureFolderModal: false,
      showDeleteModal: false,
      columns: [
        {
          title: '文件夹名称',
          key: 'name',
          width: 300
        },
        {
          title: '描述',
          key: 'description',
          width: 300
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 300,
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
          width: 173,
          fixed: 'right'
        }
      ],
      searchData: '',
      currentRow: {}
    }
  },
  created () {
    this.getPictureFolder()
  },
  methods: {
    addPictureFolder () {
      this.showAddPictureFolderModal = true
    },
    getPictureFolder () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pictureFolderName: this.searchData
      }
      let url = '/pictureFolder/listPicFolderPage/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.pictureFolderData = res.data.content
          this.pictureDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
    search () {
      this.pageNo = 0
      this.getPictureFolder()
    },
    add () {
      this.formPictureFoderData = {}
      this.showAddPictureFolderModal = true
    },
    edit (row, index) {
      this.currentRow.name = row.name
      this.currentRow.description = row.description
      this.formPictureFoderData = row
      this.showEditPictureFolderModal = true
    },
    remove (row, index) {
      this.showDeleteModal = true
      this.formPictureFoderData = row.id
    },
    upload () {},
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/pictureFolder/savePictureFolder?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formPictureFoderData)).then(res => {
            this.showAddPictureFolderModal = false
            if (res.data.status === true) {
              this.getPictureFolder()
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
      this.showAddPictureFolderModal = false
      this.$Message.info('您已取消增加！')
    },
    confirmEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/pictureFolder/savePictureFolder?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formPictureFoderData)).then(res => {
            this.showEditPictureFolderModal = false
            if (res.data.status === true) {
              this.getPictureFolder()
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
      this.showEditPictureFolderModal = false
      this.$Message.info('您已取消编辑！')
      this.formPictureFoderData.name = this.currentRow.name
      this.formPictureFoderData.description = this.currentRow.description
    },
    openPictureFolder (pictureFolder, index) {
      this.$router.push('/pictureFolder/listPictures' + pictureFolder.id)
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/pictureFolder/delete/pictureFolder/' + this.formPictureFoderData
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getPictureFolder()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.$Message.info('您已取消删除')
    },
    // 分页
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    }
  },
  watch: {
    pageNo: function () {
      this.getRolePage()
    },
    pageSize: function () {
      this.getRolePage()
    }
  }
}
</script>
<style>
.ivu-table-body{
  overflow: hidden;
}
</style>

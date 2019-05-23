<template>
  <div>
    <Row :gutter="18">
      <i-col span="5">
        <Input suffix="ios-search" placeholder="请输入学习资料名称进行查询···" v-model="searchStudyMaterialName"/>
      </i-col>
      <i-col span="5">
        <Select style="width:200px" v-model="searchStudyMaterialCategory"  @change="changeCategory($event)" placeholder="请选择类别">
          <Option v-for="(item,index) in studyMaterialCategoryItem" :value="item.id" :key="index">{{item.description}}
          </Option>
        </Select>
      </i-col>
      <i-col span="5">
        <Select style="width:200px" v-model="searchDepartment"  @change="changeDepartment($event)" placeholder="请选择部门">
          <Option v-for="(item,index) in departmentItem" :value="item.id" :key="index">{{item.name}}
          </Option>
        </Select>
      </i-col>
      <i-col span="5">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">添加</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="studyMaterialData"
      style="margin-top: 15px"
      size="small">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="primary" size="small" style="margin-right: 1px" @click="edit(row, index)">编辑</Button>
        <Button type="info" size="small" style="margin-right: 1px" v-show="(row.studyMaterialAttachmentName === null && row.studyMaterialAttachmentUrl === null)" @click="uploadStudyMaterialAttachment(row, index)">上传附件</Button>
        <Button type="info" size="small" style="margin-right: 1px" v-show="(row.studyMaterialAttachmentName != undefined && row.studyMaterialAttachmentUrl != undefined)" @click="downloadStudyMaterialAttachment(row, index)">下载附件{{row.studyMaterialAttachmentName}}</Button>
        <Button type="error" size="small" style="margin-right: 1px" v-show="(row.studyMaterialAttachmentName != undefined && row.studyMaterialAttachmentUrl != undefined)" @click="removeStudyMaterialAttachment(row, index)">删除附件{{row.studyMaterialAttachmentName}}</Button>
        <Button type="error" size="small" @click="remove(row, index)">删除</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          show-sizer
          :total="studyMaterialDataTotal"
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
      v-model="showUploadModal"
      width="360">
      <Upload
        :action="actionUrl"
        :on-success="onFileSuccess"
        name="file">
        <Button icon="ios-cloud-upload-outline">点击上传附件</Button>
      </Upload>
      <div slot="footer">
        <Button @click="cancelUpload()" style="margin-left: 8px">取消上传</Button>
      </div>
    </Modal>
        <Modal
      v-model="showEditModal"
      title="修改学习资料">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="学习资料名称" prop="studyMaterialName">
          <Input v-model="formData.studyMaterialName" placeholder="学习资料名称" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <FormItem label="学习资料类别" prop="studyMaterialCategory">
          <Select style="width:200px" v-model="formData.studyMaterialCategory" :placeholder="currentStudyMaterialCategoryName">
            <Option v-for="item in studyMaterialCategoryItem" :value="item" :key="item.id" name="studyMaterialCategory">{{item.description}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="所属部门" prop="department">
          <Select style="width:200px" v-model="formData.department" :placeholder="currentDepartmentName">
            <Option v-for="item in departmentItem" :value="item" :key="item.id" name="department">{{item.name }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData')">提交</Button>
        <Button @click="cancelEdit('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showAddModal"
      title="增加学习资料">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="学习资料名称" prop="studyMaterialName">
          <Input v-model="formData.studyMaterialName" placeholder="学习资料名称" />
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" placeholder="备注" />
        </FormItem>
        <FormItem label="学习资料类别" prop="studyMaterialCategory">
          <Select style="width:200px" v-model="formData.studyMaterialCategory">
            <Option v-for="item in studyMaterialCategoryItem" :value="item" :key="item.id" name="studyMaterialCategory">{{item.description}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="所属部门" prop="department">
          <Select style="width:200px" v-model="formData.department">
            <Option v-for="item in departmentItem" :value="item" :key="item.id" name="department">{{item.name }}
            </Option>
          </Select>
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
          title: '学习资料名称',
          key: 'studyMaterialName',
          width: 127
        },
        {
          title: '备注',
          key: 'remark',
          width: 100
        },
        {
          title: '创建时间',
          key: 'createDate',
          width: 100,
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
          title: '学习资料类别',
          key: 'studyMaterialCategory',
          width: 121,
          render: (h, params) => {
            const row = params.row
            return h('span', row.studyMaterialCategory.description)
          }
        },
        {
          title: '所属部门',
          key: 'department',
          width: 100,
          render: (h, params) => {
            const row = params.row
            return h('span', row.department.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 525,
          fixed: 'right'
        }
      ],
      studyMaterialData: [],
      formData: {},
      pageNo: 0,
      pageSize: 2,
      studyMaterialDataTotal: 0,
      showDeleteModal: false,
      showUploadModal: false,
      showAddModal: false,
      showEditModal: false,
      currentDepartmentName: '',
      currentStudyMaterialCategoryName: '',
      currentRowId: '',
      currentUploadRowId: '',
      buttonList: [],
      searchStudyMaterialName: '',
      searchStudyMaterialCategory: '',
      searchDepartment: '',
      studyMaterialCategoryItem: [],
      departmentItem: [],
      ruleValidate: {
        studyMaterialName: [
          { required: true, message: '学习资料名称不可以为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getStudyMaterialPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        studyMaterialName: this.searchStudyMaterialName,
        studyMaterialCategoryId: this.searchStudyMaterialCategory,
        departmentId: this.searchDepartment
      }
      let url = '/studyMaterial/listStudyMaterial' + '/pageNo/' + this.pageNo + '/pageSize/' + this.pageSize
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.studyMaterialData = res.data.content
          this.studyMaterialDataTotal = res.data.totalElements
        }
      })
    },
    uploadStudyMaterialAttachment (row, index) {
      this.currentUploadRowId = row.id
      this.actionUrl = 'http://127.0.0.1:8082/supervision/studyMaterial/uploadStudyMaterialAttachment/studyMaterialId/' + this.currentUploadRowId + '?access_token=' + localStorage.getItem('jwtToken')
      this.showUploadModal = true
    },
    onFileSuccess (response, file, fileList) {
      this.$Message.success(response.message)
      this.getStudyMaterialPage()
    },
    downloadStudyMaterialAttachment (row, index) {
      let filePath = row.studyMaterialAttachmentName
      // 由于是ajax调用下载方法，下载数据不会直接下载到本地，所以再创建一个a标签，给它一个 download 属性（HTML5新属性）
      let url = '/studyMaterial/downloadStudyMaterialAttachment?access_token=' + localStorage.getItem('jwtToken')
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
    removeStudyMaterialAttachment (row, index) {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        studyMaterialId: row.id
      }
      let url = '/studyMaterial/deleteStudyMaterialAttachment'
      this.$http.post(url, data).then(res => {
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getStudyMaterialPage()
        }
      })
    },
    edit (row, index) {
      this.formData = row
      this.showEditModal = true
      if (row.studyMaterialCategory != null) {
        this.currentStudyMaterialCategoryName = row.studyMaterialCategory.description
      }
      if (row.department != null) {
        this.currentDepartmentName = row.department.name
      }
    },
    cancelUpload () {
      this.showUploadModal = false
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        studyMaterialId: this.currentUploadRowId
      }
      let url = '/studyMaterial/deleteStudyMaterialAttachment'
      this.$http.post(url, data).then(res => {
        if (res.data.status === true) {
          this.getStudyMaterialPage()
        }
      })
      this.currentUploadRowId = ''
      this.actionUrl = ''
    },
    add () {
      this.formData = {}
      this.showAddModal = true
    },
    confirmAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/studyMaterial/saveStudyMaterial?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            if (res.data.status === true) {
              this.getStudyMaterialPage()
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
      this.$refs[name].resetFields()
      this.showAddModal = false
      this.$Message.info('您已取消增加！')
    },
    confirmEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/studyMaterial/saveStudyMaterial?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getStudyMaterialPage()
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
    changeCategory (event) {
      this.searchStudyMaterialCategory = event.target.value
    },
    changeDepartment (event) {
      this.searchDepartment = event.target.value
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
      let url = '/studyMaterial/delete/studyMaterialId/' + this.currentRowId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getStudyMaterialPage()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.currentRowId = ''
      this.$Message.info('您已取消删除！')
    },
    getStudyMaterialCategory () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/studyMaterial/listAllStudyMaterialCategories'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.studyMaterialCategoryItem = res.data
        }
      })
    },
    getDepartment () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/studyMaterial/listAllDepartment'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.departmentItem = res.data
        }
      })
    },
    search () {
      this.pageNo = 0
      this.getStudyMaterialPage()
    }
  },
  created () {
    this.buttonList = JSON.parse(localStorage.getItem('operation'))
    this.getStudyMaterialPage()
    this.getStudyMaterialCategory()
    this.getDepartment()
  },
  watch: {
    pageNo: function () {
      this.getStudyMaterialPage()
    },
    pageSize: function () {
      this.getStudyMaterialPage()
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

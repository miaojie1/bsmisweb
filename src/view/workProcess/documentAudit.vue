<template>
  <div>
    <Row :gutter="16">
      <i-col span="8">
        <Input suffix="ios-search" clearable placeholder="请输入标题进行查询···" v-model="documentName"/>
      </i-col>
      <i-col span="8">
        <Button @click="search" type="primary">查询</Button>
        <Button @click="add" type="primary">上传待审核文件</Button>
      </i-col>
    </Row>
    <Table
      border
      highlight-row
      :columns="columns"
      :data="docAuditData"
      style="margin-top: 15px">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot="action" slot-scope="{ row, index }">
        <Button type="warning" size="small" @click="downLoadDoc(row, index)">下载文档</Button>
        <Button type="primary" size="small" style="margin-right: 1px;" @click="edit(row, index)"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.sponsor.id && row.isSubmit === 0)">编辑</Button>
        <Button type="error" size="small" style="margin-right: 1px;" @click="remove(row, index)"
        v-show="(currentRank < row.originRank && row.isSubmit === 1) || (currentEmplId === row.sponsor.id && row.isSubmit === 0)">删除</Button>
        <Button type="success" size="small" v-show="row.processId !== null || row.processId !== ''" @click="showFlows(row, index)">流程图</Button>
        <Button type="success" size="small"
          style="margin-right: 1px;"
          @click="allotEmpl(row, index)"
          v-show="showSetCheck(row)">审核人</Button>
        <Button type="primary" size="small"
          style="margin-right: 1px;"
          v-show="showCheck(row)"
          @click="check(row)">审核</Button>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
          show-total
          show-elevator
          show-sizer
          :total="docAuditDataTotal"
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
      title="上传文件审核">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="标题" prop="title">
          <Input v-model="formData.title" placeholder="标题" />
        </FormItem>
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="文件夹" prop="folder">
          <Select v-model="folderId">
            <Option v-for="item in folderList" :value="item.id" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="文件类型" prop="category">
          <Select v-model="categoryId">
            <Option v-for="item in categoryList" :value="item.id" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="上传文件" prop="document">
          <Upload
            :action="actionUrl"
            :on-success="onFileSuccess"
            name="file">
            <Button icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmAdd('formData', 0)">保存</Button>
        <Button type="primary" @click="confirmAdd('formData', 1)">提交</Button>
        <Button @click="cancelAdd('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showEditModal"
      title="修改文件审核">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
        <FormItem label="标题" prop="title">
          <Input v-model="formData.title" placeholder="标题" />
        </FormItem>
        <FormItem label="所属项目" prop="project">
          <Select v-model="formData.project" :placeholder="currentProjectName">
            <Option v-for="item in projectList" :value="item" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="文件夹" prop="folder">
          <Select v-model="folderId" :placeholder="currentRowFolder">
            <Option v-for="item in folderList" :value="item.id" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="文件类型" prop="category">
          <Select v-model="categoryId" :placeholder="currentRowCategory">
            <Option v-for="item in categoryList" :value="item.id" :key="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="上传文件" prop="document">
          <Upload
            :action="actionUrl"
            :on-success="onFileSuccess"
            name="file">
            <Button icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmEdit('formData', 0)">保存</Button>
        <Button type="primary" @click="confirmEdit('formData', 1)">提交</Button>
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
    <Modal
      v-model="showSetEmplModal"
      title="设置审核人">
      <Form ref="formData" :model="formData" :label-width="100">
        <FormItem label="审核人" prop="project">
          <Select v-model="formData.employees" multiple>
            <Option v-for="item in employeeList" :value="item" :key="item.id" :label="item.username"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmSet('formData')">提交</Button>
        <Button @click="cancelSet('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showCheckResultModal"
      title="审核">
      <Form ref="formData" :model="formData" :rule="checkValidate" :label-width="100">
        <FormItem label="审核结果" prop="result">
          <Select v-model="checkResult">
            <Option value=true>通过</Option>
            <Option value=false>不通过</Option>
          </Select>
        </FormItem>
        <FormItem label="审核意见" prop="message">
          <Input v-model="checkMsg" placeholder="审核意见" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmCheck('formData', 0)">提交</Button>
        <Button @click="cancelCheck('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showMajorCheckModal"
      title="总监审核">
      <Table
      border
      highlight-row
      :columns="auditColumns"
      :data="employeeAuditData"
      style="margin-top: 15px"
      size="small">
      </Table>
      <Form ref="formData" :model="formData" :rule="checkValidate" :label-width="100" style="margin-top: 10px">
        <FormItem label="审核结果" prop="result">
          <Select v-model="checkResult">
            <Option value=true>通过</Option>
            <Option value=false>不通过</Option>
          </Select>
        </FormItem>
        <FormItem label="审核意见" prop="message">
          <Input v-model="checkMsg" placeholder="审核意见" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="confirmCheck('formData', 1)">提交</Button>
        <Button @click="cancelCheck('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="showCheckImgModal"
      title="流程图">
      <img :src="img"/>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: 'Id',
          key: 'id',
          width: 80
        },
        {
          title: '标题',
          key: 'title',
          width: 100
        },
        {
          title: '所属项目',
          key: 'project',
          width: 100,
          render: (h, params) => {
            const projec = params.row.project
            return h('span', projec.name)
          }
        },
        {
          title: '发起人',
          key: 'sponsor',
          width: 80,
          render: (h, params) => {
            const employee = params.row.sponsor
            return h('span', employee.username)
          }
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
          title: '修改时间',
          key: 'modificationDate',
          width: 100,
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
          title: '审核状态',
          key: 'auditStatus',
          width: 100
        },
        {
          title: '文件名称',
          key: 'document',
          width: 130,
          render: (h, params) => {
            let att = params.row.document
            return h('span', att.documentName)
          }
        },
        {
          title: '是否提交',
          key: 'isSubmit',
          width: 140,
          render: (h, params) => {
            const Row = params.row
            const color = Row.isSubmit === 0 ? 'default' : 'success'
            const text = Row.isSubmit === 0 ? '未提交' : '已提交'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '所属部门',
          key: 'department',
          width: 100,
          render: (h, params) => {
            const department = params.row.department
            return h('span', department.name)
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 300,
          fixed: 'right'
        }
      ],
      auditColumns: [
        {
          title: '审核人',
          key: 'employee',
          render: (h, params) => {
            const employee = params.row.employee
            return h('span', employee.username)
          }
        },
        {
          title: '审核结果',
          key: 'approved',
          render: (h, params) => {
            const approved = params.row.approved
            if (approved === true) {
              return h('span', '通过')
            } else if (approved === false) {
              return h('span', '拒绝')
            } else {
              return h('span', '暂无')
            }
          }
        },
        {
          title: '审核意见',
          key: 'auditOpinion'
        }
      ],
      docAuditData: [],
      // 总监审核时用于保存 审核人的审核结果 意见
      employeeAuditData: [],
      projectList: [],
      folderList: [],
      categoryList: [],
      employeeList: [],
      pageNo: 0,
      pageSize: 5,
      docAuditDataTotal: 0,
      formData: {},
      // 校验规则
      ruleValidate: {
        title: [{
          required: true, message: '不可以为空', trigger: 'blur'
        }]
      },
      checkValidate: {
        message: [{
          required: true, message: '不可以为空', trigger: 'blur'
        }]
      },
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      // 设置审核弹框
      showCheckResultModal: false,
      // 设置审核人弹框
      showSetEmplModal: false,
      // 总监审核弹框
      showMajorCheckModal: false,
      showCheckImgModal: false,
      currentRowId: '',
      actionUrl: '',
      currentRank: 0,
      currentEmplId: 0,
      // 供查询的文件名称
      documentName: '',
      // 文件夹id 用于设置文件
      categoryId: '',
      // 文件类别id 用于设置文件
      folderId: '',
      // 上传文档后 返回的id
      documentId: '',
      // 用于修改时下拉框的 默认显示问题
      currentProjectName: '',
      currentRowFolder: '',
      currentRowCategory: '',
      // 审核意见
      checkResult: true,
      checkMsg: '',
      taskId: '',
      img: ''
    }
  },
  created () {
    this.getDocumentAudits()
    const departmentPosition = JSON.parse(localStorage.getItem('currentUser')).departmentPosition
    this.currentEmplId = JSON.parse(localStorage.getItem('currentUser')).id
    this.currentRank = departmentPosition.rank
  },
  methods: {
    getDocumentAudits () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        name: this.documentName
      }
      let url = '/documentAudit/listDocumentAuditsByDepart'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.docAuditData = res.data.content
          this.docAuditDataTotal = parseInt(res.data.totalElements)
        }
      })
    },
    getProjectList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/documentAudit/listAllProjects'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.projectList = res.data
        }
      })
    },
    getFolderList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/documentAudit/listAllFolders'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.folderList = res.data
        }
      })
    },
    getCategoryList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/documentAudit/listAllCategorys'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.categoryList = res.data
        }
      })
    },
    getEmployeeList () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/documentAudit/listAllEmployees'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.employeeList = res.data
        }
      })
    },
    add () {
      this.formData = {}
      this.actionUrl = 'http://127.0.0.1:8082/supervision/document/uploadDocument?access_token=' + localStorage.getItem('jwtToken')
      this.showAddModal = true
      this.getProjectList()
      this.getFolderList()
      this.getCategoryList()
    },
    // 显示审核弹框
    check (row) {
      this.formData = row
      let manager = row.project.manager
      if (manager.id === this.currentEmplId) {
        this.employeeAuditData = row.employeeAuditList
        this.showMajorCheckModal = true
      } else {
        this.showCheckResultModal = true
      }
      this.currentRowId = row.id
      this.taskId = row.taskId
    },
    showFlows (row, index) {
      let url = '/getFlowImg/' + row.processId + '?access_token=' + localStorage.getItem('jwtToken')
      this.$http.get(url).then(res => {
        this.showCheckImgModal = true
        this.img = 'data:image/png;base64,' +
          btoa(new Uint8Array(res.data).reduce((res, byte) => res + String.fromCharCode(byte), ''))
      })
    },
    confirmAdd (name, isSubmit) {
      let that = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          that.formData.isSubmit = isSubmit
          debugger
          if (that.checkResult !== that && this.checkMsg !== '') {
            let i = 0
            let currentEmplAudit = JSON.parse(localStorage.getItem('currentEmplAudit'))
            for (i = 0; i < that.formData.employeeAuditList.length; i++) {
              if (that.formData.employeeAuditList[i].id === currentEmplAudit.id) {
                debugger
                that.formData.employeeAuditList[i].approved = that.checkResult
                that.formData.employeeAuditList[i].auditOpinion = that.checkMsg
              }
            }
          }
          let url = '/documentAudit/saveDocumentAudit?access_token=' + localStorage.getItem('jwtToken') + '&documentId=' + this.documentId + '&categoryId=' + this.categoryId + '&folderId=' + this.folderId
          this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
            this.showAddModal = false
            this.showCheckResultModal = false
            if (res.data.status === true) {
              this.getDocumentAudits()
              this.$refs.formData.resetFields()
              this.$Message.success(res.data.message)
            } else {
              this.removeAttachment()
              this.$refs.formData.resetFields()
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('表单数据校验失败!')
        }
        this.categoryId = ''
        this.folderId = ''
        this.documentId = ''
        this.checkResult = null
        this.checkMsg = ''
      })
    },
    cancelAdd () {
      this.showAddModal = false
      this.showCheckResultModal = false
      this.$refs.formData.resetFields()
      this.$Message.info('您已取消增加！')
    },
    // 提交审核结果
    confirmCheck (name, type) {
      let url = '/documentAudit/allotUserAudit'
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        documentAuditId: this.currentRowId,
        taskId: this.taskId,
        approved: this.checkResult,
        auditOpinion: this.checkMsg,
        auditType: type
      }
      this.$http.post(url, data).then(res => {
        this.showCheckResultModal = false
        this.showMajorCheckModal = false
        if (res.data.status === true) {
          this.getDocumentAudits()
          this.$Message.success(res.data.message)
        } else {
          this.$Message.error(res.data.message)
        }
      })
      this.checkResult = ''
      this.checkMsg = ''
    },
    // 取消提交审核
    cancelCheck () {
      this.showCheckResultModal = false
      this.showMajorCheckModal = false
      this.$Message.info('您已取消审核')
      this.checkResult = ''
      this.checkMsg = ''
    },
    edit (row, index) {
      this.formData = row
      this.currentProjectName = row.project.name
      const folder = row.document.documentFolder
      const category = row.document.documentCategory
      this.currentRowFolder = folder.name
      this.currentRowCategory = category.name
      this.showEditModal = true
      this.getProjectList()
      this.getFolderList()
      this.getCategoryList()
    },
    confirmEdit (name, isSubmit) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formData.isSubmit = isSubmit
          let url = '/documentAudit/saveDocumentAudit?access_token=' + localStorage.getItem('jwtToken') + '&documentId=' + this.documentId + '&categoryId=' + this.categoryId + '&folderId=' + this.folderId
          this.$http.postForm(url, JSON.stringify(this.formData)).then(res => {
            this.showEditModal = false
            if (res.data.status === true) {
              this.getDocumentAudits()
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
    // 判断是否显示 审核 按钮，以及“总监审核”按钮
    showCheck (row) {
      if (row.needAudit) {
        return true
      }
    },
    // 判断是否显示 审核人 按钮
    showSetCheck (row) {
      if (row.needAllot) {
        return true
      }
    },
    // 提交 设置审核人
    confirmSet (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let url = '/documentAudit/allotAuditTask?access_token=' + localStorage.getItem('jwtToken') + '&documentAuditId=' + this.currentRowId
          let data = []
          this.formData.employees.forEach(element => {
            data.push(element)
          })
          this.$http.postForm(url, JSON.stringify(data)).then(res => {
            this.showSetEmplModal = false
            if (res.data.status === true) {
              this.getDocumentAudits()
              this.$refs.formData.resetFields()
              this.$Message.success(res.data.message)
            } else {
              this.$refs.formData.resetFields()
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('表单数据校验失败!')
        }
      })
    },
    cancelSet () {
      this.showSetEmplModal = false
      this.$Message.info('您已取消设置审核人！')
    },
    remove (row, index) {
      this.currentRowId = row.id
      this.documentId = row.document.id
      this.showDeleteModal = true
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        docAuditId: this.currentRowId,
        docId: this.documentId
      }
      let url = '/documentAudit/deleteDocAuditById'
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getDocumentAudits()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.$Message.info('您已取消删除！')
    },
    search () {
      this.pageNo = 0
      this.getDocumentAudits()
    },
    allotEmpl (row, index) {
      this.showSetEmplModal = true
      this.currentRowId = row.id
      this.getEmployeeList()
    },
    downLoadDoc (row, index) {
      let fileName = row.document.documentName
      // 由于是ajax调用下载方法，下载数据不会直接下载到本地，所以再创建一个a标签，给它一个 download 属性（HTML5新属性）
      let url = '/documentAudit/downloadDoc?access_token=' + localStorage.getItem('jwtToken')
      this.$http.upload(url, fileName).then((data) => {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(data.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        // download 属性定义了下载链接的地址而不是跳转路径
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    },
    changePageNo (pageNo) {
      this.pageNo = pageNo - 1
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    },
    onFileSuccess (response, file, fileList) {
      this.documentId = response
    },
    removeAttachment () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        docId: this.documentId
      }
      let url = '/documentAudit/deleteDocById'
      this.$http.post(url, data).then(res => {
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  },
  watch: {
    pageNo: function () {
      this.getDocumentAudits()
    },
    pageSize: function () {
      this.getDocumentAudits()
    }
  }
}
</script>

<style>

</style>

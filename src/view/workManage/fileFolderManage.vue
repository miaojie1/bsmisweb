<template>
    <div>
        <Row :gutter="18">
          <i-col span="5">
            <Input suffix="ios-search" placeholder="请输入文件夹名称查询···" v-model="searchData"/>
          </i-col>
          <i-col span="13">
            <Button @click="search" type="primary">查询</Button>
            <!-- <Button @click="upload" type="primary">上传文件</Button> -->
            <Button @click="addFileFolder" type="primary">新建文件夹</Button>
            <Button @click="delFileFolder" type="error">删除</Button>
          </i-col>
        </Row>
        <div v-if="fileFolderData">
          <div v-for="(item, index) in fileFolderData" :key="index" :value="item.name"
            @dblclick="openFileFolder(item)"
            style="width: 120px; height: 110px; text-align:center; float: left; margin-top: 10px"
            @click="selectFolder(item,$event)">
              <img class="img" :class="{'colordisplay': display}" :src="fileFolderImg" alt="" style="width: 90px; height: 90px; margin-left: 15px; margin-bottom: -10px"/>
              <span>{{item.name}}</span>
          </div>
        </div>
        <Modal v-model="showAddFileFolderModal" title="新增文件夹">
          <Form ref="formFileFoderData" :model="formFileFoderData" :rules="ruleValidate" :label-width="100">
            <FormItem label="文件夹名字" prop="name">
              <Input v-model="formFileFoderData.name" placeholder="文件夹名字" />
            </FormItem>
            <FormItem label="文件夹描述" prop="description">
              <Input v-model="formFileFoderData.description" placeholder="文件夹描述" />
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="primary" @click="confirmAddFileFolderModal('formFileFoderData')">提交</Button>
            <Button @click="cancelAddFileFolderModal('formFileFoderData')" style="margin-left: 8px">取消</Button>
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
import fileFolderImg from '../../assets/fileFolderLogo.png'
export default {
  data () {
    return {
      display: false,
      fileFolderImg: fileFolderImg,
      fileFolderData: [],
      formFileFoderData: {
        name: '',
        description: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '文件夹名不可以为空', trigger: 'blur' }
        ]
      },
      showAddFileFolderModal: false,
      showDeleteModal: false,
      currentId: '',
      searchData: ''
    }
  },
  created () {
    this.getFileFolder()
  },
  methods: {
    addFileFolder () {
      this.formFileFoderData = {}
      this.showAddFileFolderModal = true
    },
    getFileFolder () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/fileFolder/listAllFileFolder'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.fileFolderData = res.data
        }
      })
    },
    upload () {},
    confirmAddFileFolderModal (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/fileFolder/saveFileFolder?access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formFileFoderData)).then(res => {
            this.showAddFileFolderModal = false
            if (res.data.status === true) {
              this.getFileFolder()
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
    cancelAddFileFolderModal (name) {
      this.$refs[name].resetFields()
      this.showAddFileFolderModal = false
      this.$Message.info('您已取消增加！')
    },
    openFileFolder (fileFolder) {
      this.$router.push(
        {
          path: '/knowledge/listKnowledges',
          name: '文件管理',
          query: {
            fileFolderId: fileFolder.id,
            fileFolderName: fileFolder.name,
            fileFolder: fileFolder}
        })
    },
    selectFolder (item, $event) {
      $event.currentTarget.style.color = 'blue'
      this.currentId = item.id
    },
    delFileFolder () {
      this.showDeleteModal = true
    },
    confirmDelete () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/fileFolder/delete/fileFolder/' + this.currentId
      this.$http.post(url, data).then(res => {
        this.showDeleteModal = false
        if (res.data.status === true) {
          this.$Message.success(res.data.message)
          this.getFileFolder()
        }
      })
    },
    cancelDelete () {
      this.showDeleteModal = false
      this.$Message.info('您已取消删除！')
      this.getFileFolder()
    },
    search () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/fileFolder/findFileFolderByName?name=' + this.searchData
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.fileFolderData = res.data
        }
      })
    }
  }
}
</script>
<style>
.colordisplay {
  background-color:darkseagreen
}
</style>

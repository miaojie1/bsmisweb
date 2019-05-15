<template>
<div>
    <div class="demo-upload-list" v-for="item in defaultList" :key="item.id" >
        <template v-if="item.status === 'finished'">
            <img src="item.pictureUrl">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.pictureName)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
    </div>
    <Upload
        name="file"
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :on-error="handleError"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        :action="actionUrl"
        :data="formData"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
        </div>
    </Upload>
</div>
</template>
<script>
export default {
  data () {
    return {
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      pictureFolderId: '',
      formData: {
        pictureFolderId: ''
      },
      actionUrl: ''
    }
  },
  created () {
    this.pictureFolderId = this.$route.params.id
    this.formData.pictureFolderId = this.pictureFolderId
    this.actionUrl = 'https://localhost:8083/supervision/picture/uploadPicture?access_token=' + localStorage.getItem('jwtToken')
    this.getPicturesByFolder()
  },
  methods: {
    getPicturesByFolder () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/picture/findPictureByPictureFolder?pictureFolderId=' + this.pictureFolderId
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.defaultList = res.data
        }
      })
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      this.getPicturesByFolder()
      this.$Message.info('文件上传成功')
    },
    handleError () {
      this.$Message.info('文件上传失败')
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    },
    download (row) {
      let filePath = row.fileName
      // 由于是ajax调用下载方法，下载数据不会直接下载到本地，所以再创建一个a标签，给它一个 download 属性（HTML5新属性）
      let url = '/picture/downloadPicture?access_token=' + localStorage.getItem('jwtToken')
      this.$http.get(url, filePath).then((data) => {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(data.data)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        // 获取文件名
        let fileName = row.fileName
        // download 属性定义了下载链接的地址而不是跳转路径
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

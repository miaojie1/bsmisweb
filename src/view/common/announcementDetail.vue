<template>
  <div>
    <h2 style="text-align: center">{{announcementData.name}}</h2>
    <Divider />
    <Row :gutter="16" type="flex" justify="center" class="code-row-bg">
      <Col span="5">
        <div>创建时间：{{announcementData.createDate.substring(0, 10)}}</div>
      </Col>
      <Col span="5">
        <div>修改时间：{{announcementData.modificationDate.substring(0, 10)}}</div>
      </Col>
      <Col span="5">
        <div>生效时间：{{announcementData.effectDate.substring(0, 10)}}</div>
      </Col>
      <Col span="5">
        <div>失效时间：{{announcementData.expireDate.substring(0, 10)}}</div>
      </Col>
    </Row>
    <Divider />
    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{announcementData.content}}</p>
    <br>
    <p>附件：</p>
    <br>
    <p v-for="file in announcementData.attachments" :key="file.id">
      <Icon type="ios-document" size="20"></Icon>
      <a class='link-type' href='javascript:void(0)' @click="downloadAttachment(file.name)">{{file.name}}</a>
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      announcementData: {}
    }
  },
  methods: {
    requsetData (id) {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/posting/announcementDetail/postingId/' + id
      this.$http.get(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.announcementData = res.data
        }
      })
    },
    // 下载附件
    downloadAttachment (filePath) {
      // 由于是ajax调用下载方法，下载数据不会直接下载到本地，所以再创建一个a标签，给它一个 download 属性（HTML5新属性）
      let url = '/attachment/download?access_token=' + localStorage.getItem('jwtToken')
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
    }
  },
  created: function () {
    let id = this.$route.params.id
    this.requsetData(id)
  }
}
</script>

<style>
</style>

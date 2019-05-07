<template>
  <div>
    <h>{{announcementData.name}}</h>
    <div v-html="announcementData.content"></div>
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

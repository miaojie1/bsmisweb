<template>
  <div>
    <h2 style="text-align: center">{{testPaperData.testPaperName}}</h2>
    <Divider />
    <span>
        <p v-if="testPaperData.testPaperCategory">试卷类别：{{testPaperData.testPaperCategory.description}}</p>
        <p v-else>试卷类别：</p>
    </span>
    <p v-for="testPaperDetail in testPaperData.testPaperDetails" :key="testPaperDetail.id">
      {{testPaperDetail.testPaperDetailName}}:
      {{testPaperDetail.content}}
      <br>
      答：<Input placeholder="答题区域" />
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testPaperData: []
    }
  },
  methods: {
    requsetData (id) {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        testPaperId: id
      }
      let url = '/testPaper/getTestPaperById'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.testPaperData = res.data
        }
      })
    }
  },
  created () {
    let id = this.$route.params.id
    this.requsetData(id)
  },
  watch: {
  }
}
</script>

<style>
</style>

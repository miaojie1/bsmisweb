<template>
  <div>
    <Row :gutter="10">
      <i-col span="5">
        <Button @click="showStudy" type="primary">学习</Button>
        <Button @click="showTest" type="primary">考试</Button>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  methods: {
    showStudy () {
      this.$router.push('/studyMaterial/listStudyMaterial')
    },
    showTest () {
      this.$router.push('/testPaper/listTestPaper')
    }
  }
}
</script>
<style>
</style>

<template>
  <div>
    <Row :gutter="10">
      <i-col span="10">
        <Button @click="showStudy" type="primary">学习</Button>
        <Button @click="showTest" type="primary">考试</Button>
        <Button @click="showExaminationRecord" type="primary">考试记录</Button>
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
    },
    showExaminationRecord () {
      this.$router.push('/examinationRecord/listExaminationRecord')
    }
  }
}
</script>
<style>
</style>

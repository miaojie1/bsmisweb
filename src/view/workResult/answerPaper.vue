<template>
  <div>
    <h2 style="text-align: center">{{testPaperData.testPaperName}}</h2>
    <Divider />
    <span>
        <p v-if="testPaperData.testPaperCategory">试卷类别：{{testPaperData.testPaperCategory.description}}</p>
        <p v-else>试卷类别：</p>
    </span>
    <Divider />
    <div>
      <span v-for="testPaperDetail in testPaperDetails" :key="testPaperDetail.id">
        {{testPaperDetail.testPaperDetailName}}:
        <br>
        <Input placeholder="题目区域" v-model="testPaperDetail.content" :disabled="true" type="textarea">
        </Input>
        <Button type="primary" @click="answerModal(testPaperDetail)">作答题目</Button>
        <br>
      </span>
    </div>
    <Divider />
    <Button type="primary" @click="submit">提交答卷</Button>
    <Modal
      v-model="showAnswerModal"
      title="答题">
      <Form ref="formData" :model="formData" :label-width="100">
        <FormItem label="题目" prop="currentTest">
          <Input placeholder="题目区域" :rows="3" v-model="currentTest" :disabled="true" type="textarea"/>
        </FormItem>
        <FormItem label="答：" prop="answer">
          <Input placeholder="答题区域" :rows="3" v-model="formData.answer" type="textarea"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveAnswer('formData')">提交</Button>
        <Button @click="cancel('formData')" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testPaperData: [],
      testPaperDetails: [],
      currentTest: '',
      formData: {},
      testPaperDetailId: '',
      showAnswerModal: false,
      score: 0
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
    },
    getDetail (id) {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        testPaperId: id
      }
      let url = '/testPaperDetail/listAllDetailByTest'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.testPaperDetails = res.data
        }
      })
    },
    saveAnswer (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.postForm('/answerPaperDetail/saveAnswerPaperDetail?testPaperDetailId=' + this.testPaperDetailId + '&access_token=' + localStorage.getItem('jwtToken'), JSON.stringify(this.formData)).then(res => {
            this.showAnswerModal = false
            if (res.data.status === true) {
              this.$Message.success(res.data.message)
              this.score += res.data.object.gradeOfAnswer
              console.log(this.score)
            } else {
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('表单数据校验失败!')
        }
      })
    },
    answerModal (testPaperDetail) {
      this.formData = {}
      this.currentTest = testPaperDetail.content
      this.testPaperDetailId = testPaperDetail.id
      this.showAnswerModal = true
    },
    cancel () {
      this.formData = {}
      this.showAnswerModal = false
      this.currentTest = ''
      this.testPaperDetailId = ''
    },
    submit () {
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        examinationRecordId: this.$route.params.eid,
        score: this.score
      }
      let url = '/examinationRecord/updateExaminationRecord'
      this.$http.post(url, data).then(res => {
        if (res.data.status === true) {
          this.$Message.success('考试结束，你的分数为' + res.data.object.score)
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  },
  created () {
    let id = this.$route.params.id
    this.requsetData(id)
    this.getDetail(id)
  },
  watch: {
  }
}
</script>

<style>
</style>

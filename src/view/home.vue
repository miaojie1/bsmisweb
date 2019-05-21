<template>
  <div>
    <Row class="header-row">
      <i-col span="12" style="height: 15rem">
        <Card style="width:99%;height:100%">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            系统公告
          </p>
          <a href="#" slot="extra" @click.prevent="changeLimit">
            <Icon type="ios-loop-strong"></Icon>
            查看更多
          </a>
          <div class="notice"  style="color:#57a3f3">
            <marquee behavior="scroll" direction="up" loop="infinite" scrollamount="2" scrolldelay="30" onMouseOut="this.start()" onMouseOver="this.stop()">
              <ul>
                <li v-for="(item,Index) in expPostingData" :key="Index" :name="item.name">
                  <router-link :to="'/posting/announcementDetail'+item.id">{{item.name}}(点击查看详情)</router-link>
                </li>
              </ul>
            </marquee>
          </div>
        </Card>
      </i-col>
      <i-col span="12" style="height: 15rem">
        <Card style="width:99%;height:100%">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            天气状况
          </p>
          <div slot="extra">
            济南
          </div>
          <div class="content">
            <div class="menuPanel">
              <Menu mode="horizontal" active-name="0" @on-select="changeWeatherDate">
                <MenuItem name="0">
                  <Icon type="ios-paper" />
                  今天
                </MenuItem>
                <MenuItem name="1">
                  <Icon type="ios-people" />
                  明天
                </MenuItem>
                <MenuItem name="2">
                  <Icon type="ios-construct" />
                  后天
                </MenuItem>
              </Menu>
            </div>
            <div class="panel">
              <div class="left">
                <div class="item">温度： {{currentTem}}</div>
                <div class="item">晴朗状况： {{currentType}}</div>
                <div class="item">空气指数： {{currentAQI}}</div>
                <div class="item">日期： {{currentWeaDate}}</div>
                <div class="item">风向： {{currentF}}</div>
              </div>
              <div class="right">
                <Icon type="md-cloud-done" size="50" :color="currentColor"/>
              </div>
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Row class="body-row">
      <Card style="width:99%;height:100%">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          我的待办
        </p>
        <a href="#" slot="extra" @click.prevent="changeLimit">
          <Icon type="ios-loop-strong"></Icon>
          查看更多
        </a>
        <div class="notice">
          <Table stripe :columns="taskColumns" :data="toDoTaskData"></Table>
        </div>
      </Card>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      expPostingData: [],
      taskColumns: [
        {
          title: '任务名称',
          key: 'name'
        },
        {
          title: 'createTime',
          key: '创建时间',
          render: (h, params) => {
            const createDate = params.row.createTime
            if (createDate === null || createDate === '') {
              return h('span', '')
            } else {
              return h('span', createDate.substring(0, 10))
            }
          }
        },
        {
          title: '任务进程号',
          key: 'processInstanceId'
        },
        {
          title: '任务类别',
          key: 'taskDefinitionKey'
        }
      ],
      toDoTaskData: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ],
      currentUserId: '',
      weatherData: [],
      currentTem: '',
      currentType: '',
      currentAQI: '',
      currentWeaDate: '',
      currentF: '',
      currentColor: ''
    }
  },
  created () {
    this.currentEmplId = JSON.parse(localStorage.getItem('currentUser')).id
    localStorage.setItem('currentCityId', 101120101)
    this.getToDoTask()
    this.getExpPostingPage()
    this.getWeather()
  },
  methods: {
    getExpPostingPage () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/posting/listExpPostingPage'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.expPostingData = res.data
        }
      })
    },
    getToDoTask () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/employee/getCurrentUser'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.currentUserId = res.data.id
          let taskData = {
            access_token: localStorage.getItem('jwtToken'),
            userId: this.currentUserId
          }
          let taskUrl = '/getMyTaskList'
          this.$http.post(taskUrl, taskData).then(res => {
            if (res.status === 200) {
              this.toDoTaskData = res.data
            }
          })
        }
      })
    },
    getWeather () {
      let url = '/getWeatherList'
      let data = {
        access_token: localStorage.getItem('jwtToken'),
        cityId: localStorage.getItem('currentCityId')
      }
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.weatherData[0] = res.data.data.forecast[0]
          this.weatherData[1] = res.data.data.forecast[1]
          this.weatherData[2] = res.data.data.forecast[2]
          this.setShowWeaAtt(0)
        } else {
          this.$message.info('获取天气情况失败！')
        }
      })
    },
    setShowWeaAtt (i) {
      this.currentTem = this.weatherData[i].low + '~' + this.weatherData[i].high
      this.currentWeaDate = this.weatherData[i].ymd + ' ' + this.weatherData[i].week
      this.currentAQI = this.weatherData[i].aqi
      this.currentF = this.weatherData[i].fx + ' ' + this.weatherData[i].fl
      this.currentType = this.weatherData[i].type
    },
    changeWeatherDate (name) {
      this.setShowWeaAtt(parseInt(name))
    }
  },
  watch: {
    currentType: function (val) {
      switch (val) {
        case '晴':
          this.currentColor = 'green'
          break
        case '多云':
          this.currentColor = 'default'
          break
        case '小雨':
          this.currentColor = '#515a6e'
          break
        default:
          this.currentColor = '#2b85e4'
          break
      }
    }
  }
}
</script>
<style>
.header-row {
 height: 50% !important;
}
.ivu-menu-horizontal {
  height: 30px;
  line-height: 1px;
}
.content {
  /* padding-left: 20px; */
  height: 100%;
}
.content .menuPanel {
}
.content .panel {
  width: 100%;
  display: flex;
  flex-flow: row;
}
.panel .left{
  width: 70%;
  margin-top: 10px;
  display: flex;
  flex-flow: column;
}
.panel .right{
  width: 20%;
  margin-top: 20px;
}
.panel .item {
  margin-bottom: 4px;
}
.notice-item {
  height: 3rem;
  margin-bottom: 5px;
  display: flex;
  flex-flow: row;
  border-bottom: 1pt rgb(218, 215, 212) solid;
}
.notice-btn {
  width: 4%;
  height: 3rem;
}
.notice-text {
  width: 80%;
  height: 3rem;
}
.notice-action {
  width: 16%;
  height: 3rem;
}
.notice-img {
  width: 100%;
  height: 2rem;
}
.notice-date {
  width: 100%;
  height: 1rem;
  font-size: 6px;
  color: rgb(145, 145, 146);
}
.body-row {
  margin-top: 20px;
  height: 50%;
}
</style>

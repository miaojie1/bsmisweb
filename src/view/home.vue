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
            信息资讯
          </p>
          <a href="#" slot="extra" @click.prevent="changeLimit">
            <Icon type="ios-loop-strong"></Icon>
            查看更多
          </a>
          <div class="notice">
            <div class="notice-item" v-for="item in 3" :key="item">
              <div class="notice-btn">
                <Icon type="md-square" v-if="item === 1" style="color: #ed4014" />
                <Icon type="md-square" v-if="item === 2" style="color: #19be6b" />
                <Icon type="md-square" v-if="item === 3" style="color: #ff9900" />
              </div>
              <div class="notice-text">
                xinwenlieb新闻列表xinwenlieb新闻列表xinxinwenlieb新闻列表xinwenlieb新闻列表xinwenlieb新闻列表xinwenlieb新闻列表xinwen···
              </div>
              <div class="notice-action">
                <div class="notice-img">
                  <Icon type="ios-more" size="20" style="float: right"/>
                </div>
                <div class="notice-date">
                  2018-10-22 19:57
                </div>
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
          <Table stripe :columns="columns1" :data="data1"></Table>
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
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data1: [
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
      ]
    }
  },
  created () {
    localStorage.setItem('operation', JSON.stringify(this.$route.params.operation))
    this.getExpPostingPage()
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
    }
  }
}
</script>
<style>
.header-row {
 height: 50% !important;
}
.notice {
  /* padding-left: 20px; */
}
.notice-item {
  /* background-color: antiquewhite; */
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

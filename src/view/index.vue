<template>
  <div class="layout">
    <Layout>
      <Header>
        <div class="layout-logo">
          <Icon type="logo-buffer" size="25" />
          建设监理信息系统
        </div>
        <div class="layout-nav">
          <div class="layout-nav-item" v-for="(item, index) in headMenuData" :key="index" @click="linkMenu(item.url)">
            <Icon type="ios-navigate"></Icon>
            <span>{{item.text}}</span>
          </div>
        </div>
        <Dropdown style="float:right" @on-click="setting">
          <a href="javascript:void(0)">
            <Icon type="ios-contact-outline" color="white" size="30"/>
          </a>
          <DropdownMenu slot="list" class="layout-infor-menu">
            <DropdownItem name="infor">个人信息</DropdownItem>
            <DropdownItem name="setting">设置</DropdownItem>
            <DropdownItem name="logout">注销登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown style="float:right; margin-left: 100px">
          <a href="javascript:void(0)">
            <Icon type="md-add" color="white" style="margin-right: 40px" size="30"/>
          </a>
          <DropdownMenu slot="list" class="layout-infor-menu">
            <DropdownItem>设置1</DropdownItem>
            <DropdownItem>设置2</DropdownItem>
            <DropdownItem>设置3</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Header>
      <Layout>
        <Sider hide-trigger class="navContainer">
          <Menu theme="light" width="auto" active-name="1">
            <Submenu v-for="(item, Index) in menuData" :key="Index" :name="item.name">
              <template slot="title">
                <Icon type="ios-cog" />
                {{item.name}}
              </template>
              <MenuItem v-for="(i, index) in item.subMenus" :key="index" :name="i.name" @click.native="menuItemClick(i)">
                <Icon type="ios-navigate"></Icon>
                {{i.name}}
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem to="/home">Home</BreadcrumbItem>
            <BreadcrumbItem>{{ $route.name }}</BreadcrumbItem>
          </Breadcrumb>
          <Content class="contentContainer">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menuData: [],
      headMenuData: [
        {
          text: '首页',
          url: '/home'
        },
        {
          text: '测试按钮',
          url: '/testbtn'
        },
        {
          text: '菜单3',
          url: '/item3'
        }
      ],
      activeName: ''
    }
  },
  created: function () {
    this.init()
    this.$Spin.show()
    // this.activeName = localStorage.getItem('currentPath')
  },
  methods: {
    linkMenu (url) {
      this.$router.push({
        path: url
      })
    },
    setting (name) {
      if (name === 'infor') {
        this.$Message.info('点击个人信息！')
      } else if (name === 'setting') {
        this.$Message.info('点击设置')
      } else if (name === 'logout') {
        this.$Modal.confirm({
          title: '提示',
          content: '确定退出系统吗？',
          onOk: () => {
            this.$router.push('/login')
            this.$Message.info('成功退出！')
          },
          onCancel: () => {
            this.$Message.info('您已取消退出！')
          }
        })
      }
    },
    init () {
      let data = {
        access_token: localStorage.getItem('jwtToken')
      }
      let url = '/menu/listMenu'
      this.$http.post(url, data).then(res => {
        if (res.status === 200) {
          this.menuData = res.data
          this.$Spin.hide()
        }
      })
    },
    menuItemClick (val) {
      // this.$router.push({
      //   path: val.url,
      //   query: {
      //     operation: val.operation
      //   }
      // })
      // this.$store.commit('setOperation', val.operation)
      this.$router.push({
        name: val.name,
        params: {
          operation: val.operation
        }
      })
      // localStorage.setItem('currentPath', val.url)
    }
  }
}
</script>
<style scoped>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100vh;
}
.ivu-layout-header {
  padding-left: 20px;
}
.ivu-breadcrumb {
  margin: 11px 0px !important;
}
.ivu-layout.ivu-layout-has-sider>.ivu-layout, .ivu-layout.ivu-layout-has-sider>.ivu-layout-content {
  padding: 0px 20px !important;
}
.layout-logo{
  width: 200px;
  height: 30px;
  margin: 0px;
  color: white;
  font: 18px bolder;
  float: left;
  position: relative;
  top: 20px;
  left: 0px;
}
.layout-nav{
  width: 24%;
  height: 64px;
  margin: 0 auto;
  margin-left: 540px;
  float: left;
  display: flex;
  flex-direction: row;
  justify-content: end
}
.layout-nav-item {
  width: 100px;
  color: white;
  font: 15px bold;
  margin: auto 20px;
  padding-top: 20px;
  cursor:default;
}
.layout-nav-item :hover {
  color: #2d8cf0;
}
.contentContainer {
  padding: 24px;
  height: 80vh;
  background: #fff;
  margin: 0px;
  overflow-y: auto;
}
.navContainer {
  background: #fff;
  height: 90vh;
}
</style>

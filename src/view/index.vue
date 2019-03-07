<template>
  <div class="layout">
    <Layout>
      <Header>
        <div class="layout-logo">
          <Icon type="logo-buffer" size="25" />
          建设监理信息系统
        </div>
        <div class="layout-nav">
          <div class="layout-nav-item" v-for="(item, index) in menuData" :key="index" @click="linkMenu(item.url)">
              <Icon type="ios-navigate"></Icon>
              <span @click="linkMenu(item.url)">{{item.text}}</span>
          </div>
        </div>
        <div class="layout-infor">
          <Icon type="md-add" color="white" style="margin-right: 40px" size="30"/>
          <Dropdown transfer="true" style="float:right">
            <a href="javascript:void(0)">
              <Icon type="ios-contact-outline" color="white" size="30" style="float: right;"/>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>个人信息</DropdownItem>
              <DropdownItem>设置</DropdownItem>
              <DropdownItem>注销登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger class="navContainer">
          <Menu theme="light" width="auto" active-name="1">
            <Submenu v-for="(item, Index) in menuData" :key="Index" :name="Index">
              <template slot="title">
                <Icon type="ios-cog" />
                {{item.text}}
              </template>
              <MenuItem v-for="(i, index) in item.children" :key="index" :to="i.url" :name="i.text">
                <Icon type="ios-navigate"></Icon>
                {{i.text}}
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Components</BreadcrumbItem>
            <BreadcrumbItem>Layout</BreadcrumbItem>
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
      menuData: [
        {
          text: '菜单1',
          url: '/item1',
          children: [
            {
              text: '子菜单1',
              url: '/item1'
            },
            {
              text: '子菜单2',
              url: '/item2'
            }
          ]
        },
        {
          text: '菜单2',
          url: '/item2',
          children: [
            {
              text: '子菜单3',
              url: '/item2'
            }
          ]
        },
        {
          text: '菜单3',
          url: '/item3',
          children: [
            {
              text: '子菜单4',
              url: '/item2'
            },
            {
              text: '子菜单5',
              url: '/item3'
            }
          ]
        }
      ]
    }
  },
  created: function () {
    // this.$http.test()
  },
  methods: {
    linkMenu (url) {
      this.$router.push(url)
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
.ivu-select-dropdown.ivu-dropdown-transfer {
  width: 200px !important;
  padding-top: 100px !important;
}
.ivu-select-dropdown {
  /* min-width: 180px !important; */
  /* margin: 30px 10px !important; */
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
  width: 60%;
  height: 64px;
  margin: 0 auto;
  float: left;
  margin-right: 50px;
}
.layout-nav-item {
  width: 100px;
  /* height: 64px; */
  float: right;
  color: white;
  font: 15px bold;
  margin: auto 20px;
  padding-top: 20px;
  cursor:default;
}
.layout-nav-item :hover {
  color: #2d8cf0;
}
.layout-infor {
  width: 20%;
  height: 64px;
  float: right;
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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

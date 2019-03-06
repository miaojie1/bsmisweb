<template>
  <div class="layout">
    <Layout>
      <Header>
        <div class="layout-logo">
          <Icon type="logo-buffer" size="25" />
          建设监理信息系统
        </div>
        <div class="layout-nav">
          <div class="layout-nav-item" v-for="(item, index) in menuData" :key="index">
              <Icon type="ios-navigate"></Icon>
              {{item.text}}
          </div>
        </div>
        <div class="layout-infor">
          <Dropdown transfer="true" style="margin-top: 20px;float:right">
            <a href="javascript:void(0)">
              <Icon type="ios-contact-outline" color="white" size="25" style="float: right;"/>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>驴打滚</DropdownItem>
              <DropdownItem>炸酱面</DropdownItem>
              <DropdownItem>豆汁儿</DropdownItem>
              <DropdownItem>冰糖葫芦</DropdownItem>
              <DropdownItem>北京烤鸭</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger class="navContainer">
          <Menu theme="light" width="auto">
            <Submenu v-for="(item, Index) in menuData" :key="Index" :name="Index">
              <template slot="title">
                <Icon type="ios-cog" />
                {{item.text}}
              </template>
              <MenuItem v-for="(i, index) in item.children" :key="index" :to="i.url">
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
              text: '子菜单1',
              url: '/item2'
            }
          ]
        },
        {
          text: '菜单2',
          url: '/item2',
          children: [
            {
              text: '子菜单1',
              url: '/item2'
            }
          ]
        },
        {
          text: '菜单3',
          url: '/item3',
          children: [
            {
              text: '子菜单1',
              url: '/item2'
            },
            {
              text: '子菜单1',
              url: '/item3'
            }
          ]
        }
      ]
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
/* .ivu-dropdown .ivu-select-dropdown {
  margin-top: 50px !important;
} */
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
  padding-top: 20px;
  margin-right: 50px;
}
.layout-nav-item {
  width: 100px;
  height: 64px;
  float: right;
  color: white;
  font: 15px bold;
  margin: auto 20px;
}
.layout-infor {
  width: 10%;
  height: 64px;
  float: right;
  /* padding-top: 20px; */
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

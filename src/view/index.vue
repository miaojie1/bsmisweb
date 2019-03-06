<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <Icon type="logo-buffer" size="25" />
            建设监理信息系统
          </div>
          <div class="layout-nav">
            <MenuItem v-for="(item, index) in menuData" :key="index" :to="item.url">
              <Icon type="ios-navigate"></Icon>
              {{item.text}}
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger class="navContainer">
          <Menu theme="light" width="auto">
            <MenuItem v-for="(item, index) in menuData" :key="index" :to="item.url">
              <Icon type="ios-navigate"></Icon>
              {{item.text}}
            </MenuItem>
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
          url: '/item1'
        },
        {
          text: '菜单2',
          url: '/item2'
        },
        {
          text: '菜单3',
          url: '/item3'
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
  height: 100vh
}
.ivu-layout-header {
  padding-left: 20px;
}
.layout-logo{
  width: 200px;
  height: 30px;
  margin: 0px;
  line-height: 30px;
  color: white;
  font: 18px bolder;
  float: left;
  position: relative;
  top: 20px;
  left: 0px;
}
.layout-nav{
  width: 420px;
  margin: 0 auto;
  margin-right: 15px;
}
.contentContainer {
  padding: 24px;
  height: 80vh;
  background: #fff;
  margin: 0px;
}
.navContainer {
  background: #fff;
  height: 90vh;
}
</style>

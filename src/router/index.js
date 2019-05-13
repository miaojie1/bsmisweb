import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  // 去掉路由中的#
  mode: 'history',
  base: '/bsmis',
  routes: [
    {
      path: '/',
      // 重定向到/login
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@/view/login')
    },
    {
      path: '/index',
      component: () => import('@/view/index'),
      children: [
        {
          path: '/home',
          name: '首页',
          component: () => import('@/view/home')
        },
        {
          path: '/item1',
          name: '菜单1',
          component: () => import('@/view/workManage/temp')
        },
        {
          path: '/item2',
          name: '菜单2',
          component: () => import('@/view/workManage/temp')
        },
        {
          path: '/item3',
          name: '菜单3',
          component: () => import('@/view/workProcess/temp')
        },
        {
          path: '/testbtn',
          name: '测试按钮',
          component: () => import('@/view/test')
        },
        {
          path: '/user/listUser',
          name: '用户管理',
          component: () => import('@/view/common/userManage')
        },
        {
          path: '/menu/listMenu',
          name: '用户菜单',
          component: () => import('@/view/common/userMenu')
        },
        {
          path: '/department/listDepartmentPage',
          name: '部门管理',
          component: () => import('@/view/common/departmentManage')
        },
        {
          path: '/menu/listMenuPage',
          name: '菜单管理',
          component: () => import('@/view/common/menuManage')
        },
        {
          path: '/posting/listPostingPage',
          name: '公告管理',
          component: () => import('@/view/common/noticeManage')
        },
        {
          path: '/role/listRolePage',
          name: '角色管理',
          component: () => import('@/view/common/roleManage')
        },
        {
          path: '/posting/announcementDetail:id',
          name: '公告详情',
          component: () => import('@/view/common/announcementDetail')
        },
        {
          path: '/project/listProjects',
          name: '项目管理',
          component: () => import('@/view/workManage/projectManage')
        },
        {
          path: '/supervise/listSuperviseDepartManage',
          name: '监理部管理',
          component: () => import('@/view/workManage/superviseDepartManage')
        },
        {
          path: '/dataBackup',
          name: '数据备份',
          component: () => import('@/view/workManage/dataBackUp')
        }
      ]
    }
  ]
})

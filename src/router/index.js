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
          component: () => import('@/view/common/temp')
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
        }
      ]
    }
  ]
})

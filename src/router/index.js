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
          path: '/item1',
          component: () => import('@/view/common/temp')
        },
        {
          path: '/item2',
          component: () => import('@/view/workManage/temp')
        },
        {
          path: '/item3',
          component: () => import('@/view/workProcess/temp')
        }
      ]
    }
  ]
})

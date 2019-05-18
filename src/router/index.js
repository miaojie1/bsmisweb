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
        },
        {
          path: '/supervisionLog/listLogs',
          name: '监理日志',
          component: () => import('@/view/workResult/supervisionLog')
        },
        {
          path: '/supervisionLog/logRecords',
          name: '监理日志记录',
          component: () => import('@/view/workResult/supLogRecord')
        },
        {
          path: '/document/listDocumentLibraryManage',
          name: '文档库管理',
          component: () => import('@/view/workResult/documentLibraryManage')
        },
        {
          path: '/document/listDocumentDetail:id',
          name: '文档库详情',
          component: () => import('@/view/workResult/documentFolderDetail')
        },
        {
          path: '/fileFolder/listFileFolder',
          name: '知识库管理',
          component: () => import('@/view/workManage/fileFolderManage')
        },
        {
          path: '/knowledge/listKnowledges',
          name: '文件管理',
          component: () => import('@/view/workManage/knowledgeManage')
        },
        {
          path: '/siteAccept/listsiteAcceptances',
          name: '进场验收',
          component: () => import('@/view/workProcess/siteAcceptance')
        },
        {
          path: '/pictureFolder/listPicFolderPage',
          name: '影像资料管理',
          component: () => import('@/view/workResult/pictureFolderManager')
        },
        {
          path: '/pictureFolder/listPictures:id',
          name: '影像资料详情',
          component: () => import('@/view/workResult/pictureManager')
        },
        {
          path: '/documentAudit/listDocumentAudits',
          name: '文件审核',
          component: () => import('@/view/workProcess/documentAudit')
        },
        {
          path: '/conference/listConference',
          name: '监理会议',
          component: () => import('@/view/workProcess/superviseConference')
        },
        {
          path: '/witnessSampling/listWitnessSampling',
          name: '见证取样',
          component: () => import('@/view/workProcess/witnessSampling')
        },
        {
          path: '/patrol/listPatrol',
          name: '巡视',
          component: () => import('@/view/workProcess/patrol')
        },
        {
          path: '/accountRecord/listAccRecords',
          name: '监理台账',
          component: () => import('@/view/workResult/accountRecord')
        },
        {
          path: '/sideStation/listSideStation',
          name: '旁站',
          component: () => import('@/view/workProcess/sideStation')
        },
        {
          path: '/checkAcceptance/listCheckAcceptance',
          name: '检查验收',
          component: () => import('@/view/workProcess/checkAcceptance')
        },
        {
          path: '/parallelTest/listParallelTest',
          name: '平行检验',
          component: () => import('@/view/workProcess/parallelTest')
        }
      ]
    }
  ]
})

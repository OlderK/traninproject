import util from '../libs/util'
import {
  login,
  updatePaswd
} from 'biyi-admin'
/**
 * 配置静态路由
 * 分为两种路由：
 * 1.路由出口在App.vue
 * 2.路由出口在main.vue
 * 注意：为避免不必要的错误，每个路由需设置name属性！！！
 * 注意：为避免不必要的错误，每个路由需设置name属性！！！
 * 注意：为避免不必要的错误，每个路由需设置name属性！！！
 */

// 1.路由出口在App.vue
const singleRoutes = [{
    // 设置初始页面
    path: '',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      // 密码规则校验开关
      validatePaswd: false
    }
  },
  {
    path: '/update-password',
    name: 'update-password',
    component: updatePaswd
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error-pages/404.vue')
  },
]

/**
 * 路由出口在main.vue，包括了菜单项和非菜单页面
 * 若该页面属于菜单页面，需要添加type: 'menu'属性
 */
const staticTree = [{
    path: '/home',
    component: () => import('../views/main/main.vue'),
    children: [{
      path: '',
      name: 'home',
      title: '首页',
      component: () => import('../views/home/home.vue')
    }]
  },
  {
    path: '/customerManage',
    name: 'customer-manage',
    title: '客户管理',
    icon: 'md-contacts',
    type: 'menu',
    component: () => import('../views/main/main.vue'),
    children: [{
        path: '/customerList',
        name: 'customer-list',
        title: '客户列表',
        icon: 'md-contacts',
        type: 'menu',
        component: () => import('../views/customer/customerManage/CustomerList.vue')
      },
      /* {
        path: '/customerFrom',
        name: 'customer-from',
        title: '客户来源',
        // icon: 'ios-paper',
        type: 'menu',
        component: () => import('../views/customer/customerManage/CustomerFrom.vue')
      } */
    ]
  },
  {
    path: '/customerInfo',
    name: 'customer-info-statistic',
    title: '客户信息统计',
    icon: 'ionic',
    type: 'menu',
    component: () => import('../views/main/main.vue'),
    children: [{
      path: '/customerInfo',
      name: 'customer-info-statistic',
      title: '客户信息统计',
      type: 'menu',
      component: () => import('../views/customer/customerInfo/CustomerInfoStatistic.vue')
    }]
  },
]
const staticMenuList = util.getMenuList(staticTree)
const staticMainRoutes = util.getMenuRoutes(staticTree)

// 汇总所有的路由
const staticRoutes = [...staticMainRoutes, ...singleRoutes]

export {
  staticRoutes,
  staticMenuList,
  staticTree
}

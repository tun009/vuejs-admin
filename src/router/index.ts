import { type RouteRecordRaw, createRouter } from 'vue-router'

import { history, flatMultiLevelRoutes } from './helper'

import routeSettings from '@/config/route'
import {
  DASHBOARD_PAGE,
  DOCUMENT_PAGE,
  DOCS_PAGE,
  INVALID_CATEGORY_PAGE,
  LOGIN_PAGE,
  MAIN_PAGE,
  PROFILE_PAGE,
  REDIRECT_PAGE,
  REPORTS_PAGE,
  RULES_PAGE,
  SETTINGS_PAGE,
  UCP_ISBP_PAGE,
  USERS_PAGE,
  _403_PAGE,
  _404_PAGE
} from '@/constants/router'

const Layouts = () => import('@/layouts/index.vue')

/**
 * Permanent routes
 * Except for hidden pages such as redirect/403/404/login, it is recommended to set the Name attribute for other pages
 */
export const constantRoutes: RouteRecordRaw[] = [
  // Public router
  {
    children: [
      {
        component: () => import('@/views/redirect/index.vue'),
        path: ':path(.*)'
      }
    ],
    component: Layouts,
    meta: {
      hidden: true
    },
    path: REDIRECT_PAGE
  },
  {
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true
    },
    path: _403_PAGE
  },
  {
    alias: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true
    },
    path: _404_PAGE
  },
  {
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    },
    path: LOGIN_PAGE
  },

  // Private router
  {
    children: [
      {
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          affix: true,
          svgIcon: 'ic-home',
          title: 'dashboard'
        },
        name: 'Dashboard',
        path: DASHBOARD_PAGE
      },
      {
        component: () => import('@/views/profile/index.vue'),
        meta: {
          hidden: true,
          keepAlive: true,
          title: 'profile'
        },
        name: 'Profile',
        path: PROFILE_PAGE
      }
    ],
    component: Layouts,
    path: MAIN_PAGE,
    redirect: DASHBOARD_PAGE
  },
  {
    children: [
      {
        component: () => import('@/views/docs/documents/index.vue'),
        meta: {
          keepAlive: true,
          title: 'dataProcessing'
        },
        name: 'Data procesing',
        path: DOCS_PAGE + DOCUMENT_PAGE
      },
      {
        component: () => import('@/views/docs/reports/index.vue'),
        meta: {
          keepAlive: true,
          title: 'reports'
        },
        name: 'Reports',
        path: DOCS_PAGE + REPORTS_PAGE
      },
      {
        component: () => import('@/views/docs/settings/index.vue'),
        meta: {
          keepAlive: true,
          title: 'settings'
        },
        name: 'Settings',
        path: DOCS_PAGE + SETTINGS_PAGE
      }
    ],
    component: Layouts,
    meta: {
      svgIcon: 'ic-model-group',
      title: 'document'
    },
    path: DOCS_PAGE,
    redirect: DOCS_PAGE + DOCUMENT_PAGE
  },
  {
    children: [
      {
        component: () => import('@/views/users/index.vue'),
        meta: {
          keepAlive: true,
          svgIcon: 'ic-user-group',
          title: 'users'
        },
        name: 'Users',
        path: 'list'
      }
    ],
    component: Layouts,
    name: 'Users',
    path: USERS_PAGE
  },
  {
    children: [
      {
        component: () => import('@/views/rules/ucp-isbp/index.vue'),
        meta: {
          keepAlive: true,
          title: 'ruleUI'
        },
        name: 'Rule UCP/ISBP',
        path: RULES_PAGE + UCP_ISBP_PAGE
      },
      {
        component: () => import('@/views/rules/invalid-category/index.vue'),
        meta: {
          keepAlive: true,
          title: 'invalidCategory'
        },
        name: 'Invalid category',
        path: RULES_PAGE + INVALID_CATEGORY_PAGE
      }
    ],
    component: Layouts,
    meta: {
      svgIcon: 'ic-round-rule',
      title: 'rules'
    },
    path: RULES_PAGE,
    redirect: RULES_PAGE + UCP_ISBP_PAGE
  }
]

/**
 * Dynamic routing
 * Used to place routes with permissions (Roles attribute)
 * Must have a Name attribute
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/permission',
  //   component: Layouts,
  //   redirect: '/permission/page',
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permissions',
  //     svgIcon: 'lock',
  //     roles: ['admin', 'editor'], // Roles can be set in the root route
  //     alwaysShow: true // The root menu will always be displayed
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page.vue'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page level',
  //         roles: ['admin'] // Or set roles in sub-navigation
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive.vue'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Button level' // If no role is set, it means: the page does not require permission, but will inherit the role of the root route
  //       }
  //     }
  //   ]
  // }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** Reset route */
export function resetRouter() {
  // Note: All dynamic routes must have a Name attribute, otherwise they may not be completely reset
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // Forced browser refresh is also possible, but the interactive experience is not very good
    window.location.reload()
  }
}

export default router

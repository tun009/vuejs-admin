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
  _404_PAGE,
  DOCUMENT_DETAIL_PAGE,
  COMPARE_DOCUMENT_DETAIL_PAGE
} from '@/constants/router'

const Layouts = () => import('@/layouts/index.vue')

/**
 * Permanent routes
 * Except for hidden pages such as redirect/403/404/login, it is recommended to set the Name attribute for other pages
 */
export const constantRoutes: RouteRecordRaw[] = [
  // Public router
  {
    path: REDIRECT_PAGE,
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: _403_PAGE,
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: _404_PAGE,
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true
    },
    alias: '/:pathMatch(.*)*'
  },
  {
    path: LOGIN_PAGE,
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  // Private router
  {
    path: MAIN_PAGE,
    component: Layouts,
    redirect: DASHBOARD_PAGE,
    children: [
      {
        path: DASHBOARD_PAGE,
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          svgIcon: 'ic-home',
          affix: true
        }
      },
      {
        path: PROFILE_PAGE,
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'profile',
          hidden: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: DOCS_PAGE,
    component: Layouts,
    redirect: DOCS_PAGE + DOCUMENT_PAGE,
    meta: {
      title: 'document',
      svgIcon: 'ic-model-group'
    },
    children: [
      {
        path: DOCS_PAGE + DOCUMENT_PAGE,
        component: () => import('@/views/docs/documents/index.vue'),
        meta: {
          breadcrumb: false,
          keepAlive: true,
          title: 'dataProcessing'
        },
        name: 'Data procesing'
      },
      {
        path: DOCS_PAGE + REPORTS_PAGE,
        component: () => import('@/views/docs/reports/index.vue'),
        name: 'Reports',
        meta: {
          title: 'reports',
          keepAlive: true
        }
      },
      {
        path: DOCS_PAGE + SETTINGS_PAGE,
        component: () => import('@/views/docs/settings/index.vue'),
        name: 'Settings',
        meta: {
          title: 'settings',
          keepAlive: true
        }
      },
      {
        component: () => import('@/views/docs/documents/detail/index.vue'),
        meta: {
          hidden: true,
          keepAlive: true,
          title: 'documentDetail'
        },
        name: 'Document detail',
        path: DOCUMENT_DETAIL_PAGE()
      }
    ]
  },
  {
    path: USERS_PAGE,
    component: Layouts,
    name: 'Users',
    children: [
      {
        path: 'list',
        component: () => import('@/views/users/index.vue'),
        name: 'Users',
        meta: {
          title: 'users',
          svgIcon: 'ic-user-group',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: RULES_PAGE,
    redirect: RULES_PAGE + UCP_ISBP_PAGE,
    component: Layouts,
    meta: {
      title: 'rules',
      svgIcon: 'ic-round-rule'
    },
    children: [
      {
        path: RULES_PAGE + UCP_ISBP_PAGE,
        component: () => import('@/views/rules/ucp-isbp/index.vue'),
        name: 'Rule UCP/ISBP',
        meta: {
          title: 'ruleUI',
          keepAlive: true
        }
      },
      {
        path: RULES_PAGE + INVALID_CATEGORY_PAGE,
        component: () => import('@/views/rules/invalid-category/index.vue'),
        name: 'Invalid category',
        meta: {
          title: 'invalidCategory',
          keepAlive: true
        }
      }
    ]
  },
  // {
  //   component: () => import('@/views/docs/documents/DocumentDetail.vue'),
  //   meta: {
  //     hidden: true,
  //     keepAlive: true,
  //     title: 'documentDetail'
  //   },
  //   name: 'Document detail',
  //   path: DOCUMENT_DETAIL_PAGE()
  // }
  {
    path: COMPARE_DOCUMENT_DETAIL_PAGE(),
    component: () => import('@/views/docs/documents/compare/index.vue'),
    meta: {
      hidden: true
    }
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

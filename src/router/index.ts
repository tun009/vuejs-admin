import { type RouteRecordRaw, createRouter } from 'vue-router'
import { history, flatMultiLevelRoutes } from './helper'
import routeSettings from '@/config/route'

const Layouts = () => import('@/layouts/index.vue')

/**
 * Permanent routes
 * Except for hidden pages such as redirect/403/404/login, it is recommended to set the Name attribute for other pages
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
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
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true
    },
    alias: '/:pathMatch(.*)*'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/',
    component: Layouts,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          svgIcon: 'ic-home',
          affix: true
        }
      }
    ]
  },
  {
    path: '/docs',
    meta: {
      title: 'Document',
      svgIcon: 'ic-model-group'
    },
    children: [
      {
        path: 'data-processing',
        component: () => {},
        name: 'Data procesing',
        meta: {
          title: 'Data procesing',
          keepAlive: true
        }
      },
      {
        path: 'reports',
        component: () => {},
        name: 'Reports',
        meta: {
          title: 'Reports',
          keepAlive: true
        }
      },
      {
        path: 'settings',
        component: () => {},
        name: 'Settings',
        meta: {
          title: 'Settings',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/users',
    component: Layouts,
    name: 'Users',
    meta: {
      title: 'Users',
      svgIcon: 'ic-user-group'
    }
  },
  {
    path: '/rules',
    meta: {
      title: 'Rules',
      svgIcon: 'ic-round-rule'
    },
    children: [
      {
        path: 'ucp-isbp',
        component: () => {},
        name: 'Rule UCP/ISBP',
        meta: {
          title: 'Rule UCP/ISBP',
          keepAlive: true
        }
      },
      {
        path: 'invalid-category',
        component: () => {},
        name: 'Invalid category',
        meta: {
          title: 'Invalid category',
          keepAlive: true
        }
      }
    ]
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

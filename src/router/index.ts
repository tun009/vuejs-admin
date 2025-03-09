import { type RouteRecordRaw, createRouter } from 'vue-router'
import { history, flatMultiLevelRoutes } from './helper'
import routeSettings from '@/config/route'
import {
  DASHBOARD_PAGE,
  DOCUMENT_PAGE,
  DOCS_PAGE,
  INVALID_CATEGORY_PAGE,
  LANDING_PAGE,
  LOGIN_PAGE,
  MAIN_PAGE,
  PRODUCT_PAGE,
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
  EXTRACT_PAGE,
  COMPARE_DOCUMENT_DETAIL_PAGE,
  AUTH_CALLBACK,
  PRODUCT_PACKAGE,
  PRODUCT_LIST
} from '@/constants/router'
import { RoleEnum } from '@/@types/pages/users'
import LandingPage from '@/views/landing/index.vue'
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
      hidden: true,
      title: 'login'
    }
  },
  {
    path: LANDING_PAGE,
    component: () => import('@/views/landing/index.vue'),
    meta: {
      hidden: true,
      title: 'landing'
    }
  },
  {
    path: AUTH_CALLBACK,
    component: () => import('@/views/login/CallBackLogin.vue'),
    meta: {
      hidden: true,
      title: 'login'
    }
  },
  {
    path: `${PRODUCT_PAGE}/:slug`,
    component: () => import('@/views/landing/detail/ProductDetail.vue'),
    meta: {
      hidden: true,
      title: 'product-detail'
    }
  },

  // Private router
  {
    path: MAIN_PAGE,
    component: () => import('@/views/landing/index.vue'),
    meta: {
      hidden: true,
      title: 'landing'
    }
  },
  {
    path: DASHBOARD_PAGE,
    component: Layouts,
    children: [
      {
        path: '',
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
    redirect: PRODUCT_LIST,
    meta: {
      title: 'document',
      svgIcon: 'ic-model-group',
      alwaysShow: true
    },
    children: [
      {
        path: PRODUCT_LIST,
        component: () => import('@/views/docs/documents/index.vue'),
        meta: {
          breadcrumb: false,
          keepAlive: true,
          title: 'dataProcessing'
        },
        name: 'Document'
      },
      {
        path: PRODUCT_PACKAGE,
        component: () => import('@/views/docs/settings/index.vue'),
        name: 'Settings',
        meta: {
          title: 'settings',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: MAIN_PAGE,
    component: Layouts,
    redirect: DASHBOARD_PAGE,
    children: [
      {
        path: REPORTS_PAGE,
        component: () => import('@/views/docs/reports/index.vue'),
        name: 'Reports',
        meta: {
          svgIcon: 'ic-report',
          title: 'reports',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: USERS_PAGE,
    component: Layouts,
    name: 'Users',
    meta: {
      roles: [RoleEnum.ADMIN, RoleEnum.CHECKER]
    },
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
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  }
]

/**
 * Dynamic routing
 * Used to place routes with permissions (Roles attribute)
 * Must have a Name attribute
 */
export const dynamicRoutes: RouteRecordRaw[] = []

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

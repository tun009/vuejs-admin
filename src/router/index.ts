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
          svgIcon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  {
    path: '/link',
    meta: {
      title: 'Link',
      svgIcon: 'link'
    },
    children: [
      {
        path: 'https://juejin.cn/post/7089377403717287972',
        component: () => {},
        name: 'Link1',
        meta: {
          title: 'Link1'
        }
      },
      {
        path: 'https://juejin.cn/column/7207659644487139387',
        component: () => {},
        name: 'Link2',
        meta: {
          title: 'Link2'
        }
      }
    ]
  },
  {
    path: '/table',
    component: Layouts,
    redirect: '/table/element-plus',
    name: 'Table',
    meta: {
      title: 'Table',
      elIcon: 'Grid'
    },
    children: [
      {
        path: 'element-plus',
        component: () => import('@/views/table/element-plus/index.vue'),
        name: 'ElementPlus',
        meta: {
          title: 'Element Plus',
          keepAlive: true
        }
      },
      {
        path: 'vxe-table',
        component: () => import('@/views/table/vxe-table/index.vue'),
        name: 'VxeTable',
        meta: {
          title: 'Vxe Table',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/menu',
    component: Layouts,
    redirect: '/menu/menu1',
    name: 'Menu',
    meta: {
      title: 'Menu',
      svgIcon: 'menu'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/menu/menu1/index.vue'),
        redirect: '/menu/menu1/menu1-1',
        name: 'Menu1',
        meta: {
          title: 'menu1'
        },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/menu/menu1/menu1-1/index.vue'),
            name: 'Menu1-1',
            meta: {
              title: 'menu1-1',
              keepAlive: true
            }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/menu/menu1/menu1-2/index.vue'),
            redirect: '/menu/menu1/menu1-2/menu1-2-1',
            name: 'Menu1-2',
            meta: {
              title: 'menu1-2'
            },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/menu/menu1/menu1-2/menu1-2-1/index.vue'),
                name: 'Menu1-2-1',
                meta: {
                  title: 'menu1-2-1',
                  keepAlive: true
                }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/menu/menu1/menu1-2/menu1-2-2/index.vue'),
                name: 'Menu1-2-2',
                meta: {
                  title: 'menu1-2-2',
                  keepAlive: true
                }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/menu/menu1/menu1-3/index.vue'),
            name: 'Menu1-3',
            meta: {
              title: 'menu1-3',
              keepAlive: true
            }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/menu/menu2/index.vue'),
        name: 'Menu2',
        meta: {
          title: 'menu2',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/hook-demo',
    component: Layouts,
    redirect: '/hook-demo/use-fetch-select',
    name: 'HookDemo',
    meta: {
      title: 'Hook',
      elIcon: 'Menu',
      alwaysShow: true
    },
    children: [
      {
        path: 'use-fetch-select',
        component: () => import('@/views/hook-demo/use-fetch-select.vue'),
        name: 'UseFetchSelect',
        meta: {
          title: 'useFetchSelect'
        }
      },
      {
        path: 'use-fullscreen-loading',
        component: () => import('@/views/hook-demo/use-fullscreen-loading.vue'),
        name: 'UseFullscreenLoading',
        meta: {
          title: 'useFullscreenLoading'
        }
      },
      {
        path: 'use-watermark',
        component: () => import('@/views/hook-demo/use-watermark.vue'),
        name: 'UseWatermark',
        meta: {
          title: 'useWatermark'
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
  {
    path: '/permission',
    component: Layouts,
    redirect: '/permission/page',
    name: 'Permission',
    meta: {
      title: 'Permissions',
      svgIcon: 'lock',
      roles: ['admin', 'editor'], // Roles can be set in the root route
      alwaysShow: true // The root menu will always be displayed
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'Page level',
          roles: ['admin'] // Or set roles in sub-navigation
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: 'Button level' // If no role is set, it means: the page does not require permission, but will inherit the role of the root route
        }
      }
    ]
  }
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

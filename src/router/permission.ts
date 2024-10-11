import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'

import router from '@/router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'
import { setRouteChange } from '@/hooks/useRouteListener'
import { useTitle } from '@/hooks/useTitle'
import { getToken } from '@/utils/cache/cookies'
import routeSettings from '@/config/route'
import isWhiteList from '@/config/white-list'
import 'nprogress/nprogress.css'
import i18n from '@/locales/index'

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = getToken()

  // If not logged in
  if (!token) {
    // If in the whitelist without login, enter directly
    if (isWhiteList(to)) return next()
    // Other pages without access rights will be redirected to the login page
    return next('/login')
  }

  // If you are already logged in and are ready to enter the Login page, redirect to the home page
  if (to.path === '/login') {
    return next({ path: '/' })
  }

  // If the user has obtained his permission role
  if (userStore.roles.length !== 0) return next()

  // Otherwise, re-acquire the permission role
  try {
    await userStore.getInfo()
    // Note: Roles must be an array! For example: ["admin"] or ["developer", "editor"]
    const roles = userStore.roles
    // Generate accessible Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // Add "dynamic routes with access rights" to Router
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // Make sure adding routes is complete
    // Set replace: true, so navigation will not leave history
    next({ ...to, replace: true })
  } catch (err: any) {
    // If any error occurs during the process, reset the Token directly and redirect to the login page
    userStore.resetToken()
    ElMessage.error(err.message || 'Error in route guard process')
    next('/login')
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(i18n.global.t('router.' + to.meta.title))
  NProgress.done()
})

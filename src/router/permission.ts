import router from '@/router'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'
// import { ElMessage } from 'element-plus'
import { setRouteChange } from '@/hooks/useRouteListener'
import { useTitle } from '@/hooks/useTitle'
import { getToken } from '@/utils/cache/cookies'
import routeSettings from '@/config/route'
import isWhiteList from '@/config/white-list'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import i18n from '@/locales/index'
import { LOGIN_PAGE, MAIN_PAGE, _403_PAGE } from '@/constants/router'

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
    return next(LOGIN_PAGE)
  }

  // If you are already logged in and are ready to enter the Login page, redirect to the home page
  if (to.path === LOGIN_PAGE) {
    return next({ path: MAIN_PAGE })
  }

  if (userStore?.roles?.[0] && to?.meta?.roles && !to?.meta?.roles.includes(userStore?.roles?.[0]))
    return next(_403_PAGE)

  // If the user has obtained his permission role
  if (userStore.roles.length !== 0) return next()

  // Otherwise, re-acquire the permission role
  try {
    await userStore.getInfo()
    // Note: Roles must be an array! For example: ["admin"]
    const roles = userStore.roles
    // Generate accessible Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // Add "dynamic routes with access rights" to Router
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // Make sure adding routes is complete
    // Set replace: true, so navigation will not leave history
    next({ ...to, replace: true })
  } catch {
    // If any error occurs during the process, reset the Token directly and redirect to the login page
    userStore.resetToken()
    // ElMessage.error(err.message || 'Error in route guard process')
    next(LOGIN_PAGE)
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(i18n.global.t('router.' + to.meta.title))
  NProgress.done()
})

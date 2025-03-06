import { type RouteLocationNormalized } from 'vue-router'
import { LANDING_PAGE, LOGIN_PAGE, MAIN_PAGE, PRODUCT_PAGE } from '@/constants/router'

/** Login-free whitelist (matching route path) */
const whiteListByPath: string[] = [LOGIN_PAGE, LANDING_PAGE, MAIN_PAGE, PRODUCT_PAGE]

/** Login-free whitelist (matching route name) */
const whiteListByName: string[] = ['Login', 'Landing', 'ProductDetail']

/** Determine whether it is in the whitelist */
const isWhiteList = (to: RouteLocationNormalized) => {
  // Either path or name must match.
  return (
    whiteListByPath.indexOf(to.path) !== -1 ||
    whiteListByName.indexOf(to.name as any) !== -1 ||
    to.path.startsWith(PRODUCT_PAGE)
  )
}

export default isWhiteList

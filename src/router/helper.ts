import {
  type Router,
  type RouteRecordNormalized,
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import { cloneDeep, omit } from 'lodash-es'

/** Routing mode */
export const history =
  import.meta.env.VITE_ROUTER_HISTORY === 'hash'
    ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
    : createWebHistory(import.meta.env.VITE_PUBLIC_PATH)

/** Routing downgrade (converting level 3 and above routes to level 2 routes) */
export const flatMultiLevelRoutes = (routes: RouteRecordRaw[]) => {
  const routesMirror = cloneDeep(routes)
  routesMirror.forEach((route) => {
    // If the route is level 3 or above, downgrade it
    isMultipleRoute(route) && promoteRouteLevel(route)
  })
  return routesMirror
}

/** Determine whether the route level is greater than 2 */
const isMultipleRoute = (route: RouteRecordRaw) => {
  const children = route.children
  if (children?.length) {
    // As long as the length of children of a child route is greater than 0, it means that it is a level 3 or higher route
    return children.some((child) => child.children?.length)
  }
  return false
}

/** Generate a secondary route */
const promoteRouteLevel = (route: RouteRecordRaw) => {
  // Create a router instance to obtain all the route information of the currently passed route
  let router: Router | null = createRouter({
    history,
    routes: [route]
  })
  const routes = router.getRoutes()
  // Use the route information obtained above to update the children of route in the addToChildren function
  addToChildren(routes, route.children || [], route)
  router = null
  // After switching to secondary routing, remove children from all subroutes
  route.children = route.children?.map((item) => omit(item, 'children') as RouteRecordRaw)
}

/** Add the given sub-route to the specified route module */
const addToChildren = (routes: RouteRecordNormalized[], children: RouteRecordRaw[], routeModule: RouteRecordRaw) => {
  children.forEach((child) => {
    const route = routes.find((item) => item.name === child.name)
    if (route) {
      // Initialize children of routeModule
      routeModule.children = routeModule.children || []
      // If the route is not included in the children property of routeModule, add it
      if (!routeModule.children.includes(route)) {
        routeModule.children.push(route)
      }
      // If the sub-route has its own sub-routes, recursively call this function to add them as well
      if (child.children?.length) {
        addToChildren(routes, child.children, routeModule)
      }
    }
  })
}

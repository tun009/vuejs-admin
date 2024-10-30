/** Routing Configuration */
interface RouteSettings {
  /**
   * Is the dynamic routing function enabled?
   * 1. After it is enabled, the backend needs to cooperate to return the fields of the current user that can be used to judge and load dynamic routes in the user details query interface (the role field is used in this project)
   * 2. If the project does not need to display different pages according to different users, you should set dynamic: false
   */
  dynamic: boolean
  /** When dynamic routing is disabled：
   * 1. All routes should be written into the resident route (indicating that all logged-in users can access the same pages)
   * 2. The system automatically assigns a default role to the currently logged in user that has no effect.
   */
  defaultRoles: Array<string>
  /**
   * Is the route cache function at level 3 or above enabled?
   * 1. After it is turned on, the routing will be downgraded (the routing at level 3 or above will be converted to level 2 routing)
   * 2. Since they will all be converted to secondary routes, any embedded subroutes in secondary and higher routes will become invalid
   */
  thirdLevelRouteCache: boolean
}

const routeSettings: RouteSettings = {
  dynamic: true,
  defaultRoles: ['MAKER'],
  thirdLevelRouteCache: false
}

export default routeSettings

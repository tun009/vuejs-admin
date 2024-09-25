import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Set the name of the route displayed in the sidebar and breadcrumbs
     */
    title?: string
    /**
     * Set the icon of the route. Remember to import svg into @/icons/svg
     */
    svgIcon?: string
    /**
     * Set the icon of the route. Use Element Plus's Icon directly (when set with svgIcon, svgIcon will take precedence)
     */
    elIcon?: string
    /**
     * Default is false. When set to true, the route will not appear in the sidebar
     */
    hidden?: boolean
    /**
     * Set the role that can enter the route. Multiple roles can be superimposed
     */
    roles?: string[]
    /**
     * Default is true. If set to false, it will not be displayed in the breadcrumbs
     */
    breadcrumb?: boolean
    /**
     * Default is false. If set to true, it will be fixed in tags-view
     */
    affix?: boolean
    /**
     * When the number of children under a route is greater than 1, it will automatically become a nested mode.
     * If there is only one, that child route will be displayed in the sidebar as the root route.
     * If you want to display your root route regardless of the number of children declared under the route,
     * You can set alwaysShow: true, so that the previously defined rules will be ignored and the root route will always be displayed.
     */
    alwaysShow?: boolean
    /**
     * Example: activeMenu: "/xxx/xxx",
     * When this property is set and the route is entered, the sidebar corresponding to the activeMenu property will be highlighted.
     * This property is suitable for use on routes with the hidden: true property
     */
    activeMenu?: string
    /**
     * Whether to cache the route page
     * The default is false. When true, it means that caching is required. At this time, the route and the page need to set the same Name
     */
    keepAlive?: boolean
  }
}

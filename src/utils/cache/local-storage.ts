/** Unified processing of localStorage */

import CacheKey from '@/constants/cache-key'
import { type SidebarOpened, type SidebarClosed } from '@/constants/app-key'
import { type ThemeName } from '@/hooks/useTheme'
import { type LayoutSettings } from '@/config/layouts'

//#region system layout configuration
export const getConfigLayout = () => {
  const json = localStorage.getItem(CacheKey.CONFIG_LAYOUT)
  return json ? (JSON.parse(json) as LayoutSettings) : null
}
export const setConfigLayout = (settings: LayoutSettings) => {
  localStorage.setItem(CacheKey.CONFIG_LAYOUT, JSON.stringify(settings))
}
export const removeConfigLayout = () => {
  localStorage.removeItem(CacheKey.CONFIG_LAYOUT)
}
//#endregion

//#region Sidebar Status
export const getSidebarStatus = () => {
  return localStorage.getItem(CacheKey.SIDEBAR_STATUS)
}
export const setSidebarStatus = (sidebarStatus: SidebarOpened | SidebarClosed) => {
  localStorage.setItem(CacheKey.SIDEBAR_STATUS, sidebarStatus)
}
//#endregion

//#region The name of the theme being applied
export const getActiveThemeName = () => {
  return localStorage.getItem(CacheKey.ACTIVE_THEME_NAME) as ThemeName | null
}
export const setActiveThemeName = (themeName: ThemeName) => {
  localStorage.setItem(CacheKey.ACTIVE_THEME_NAME, themeName)
}
//#endregion
export const getCachedViews = () => {
  const json = localStorage.getItem(CacheKey.CACHED_VIEWS)
  return JSON.parse(json ?? '[]') as string[]
}
export const setCachedViews = (views: string[]) => {
  localStorage.setItem(CacheKey.CACHED_VIEWS, JSON.stringify(views))
}
//#endregion

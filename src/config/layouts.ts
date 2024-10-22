import { getConfigLayout } from '@/utils/cache/local-storage'
import { LayoutModeEnum } from '@/constants/app-key'

export interface LayoutSettings {
  showSettings: boolean
  layoutMode: LayoutModeEnum
  showTagsView: boolean
  showLogo: boolean
  fixedHeader: boolean
  showFooter: boolean
  showNotify: boolean
  showThemeSwitch: boolean
  showScreenfull: boolean
  showSearchMenu: boolean
  cacheTagsView: boolean
  showWatermark: boolean
  showGreyMode: boolean
  showColorWeakness: boolean
  language: 'vi' | 'en'
}

const defaultSettings: LayoutSettings = {
  layoutMode: LayoutModeEnum.Left,
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showFooter: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  showSearchMenu: true,
  cacheTagsView: false,
  showWatermark: false,
  showGreyMode: false,
  showColorWeakness: false,
  language: 'vi'
}

export const layoutSettings: LayoutSettings = { ...defaultSettings, ...getConfigLayout() }

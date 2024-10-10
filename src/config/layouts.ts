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
  cacheTagsView: false,
  fixedHeader: true,
  language: 'vi',
  layoutMode: LayoutModeEnum.Left,
  showColorWeakness: false,
  showFooter: true,
  showGreyMode: false,
  showLogo: true,
  showNotify: true,
  showScreenfull: true,
  showSearchMenu: true,
  showSettings: true,
  showTagsView: true,
  showThemeSwitch: true,
  showWatermark: true
}

export const layoutSettings: LayoutSettings = { ...defaultSettings, ...getConfigLayout() }

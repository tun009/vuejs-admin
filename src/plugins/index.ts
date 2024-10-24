import { type App } from 'vue'
import { loadElementPlus } from './element-plus'
import { loadElementPlusIcon } from './element-plus-icon'
import { loadMultipleLanguage } from './i18n'

export function loadPlugins(app: App) {
  loadElementPlus(app)
  loadElementPlusIcon(app)
  loadMultipleLanguage(app)
}

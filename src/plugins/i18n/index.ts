import { App } from 'vue'

import i18n from '@/locales'
export function loadMultipleLanguage(app: App) {
  app.use(i18n)
}

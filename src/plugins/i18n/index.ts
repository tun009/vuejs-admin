import i18n from '@/locales'
import { App } from 'vue'
export function loadMultipleLanguage(app: App) {
  app.use(i18n)
}

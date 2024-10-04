import { createI18n } from 'vue-i18n'

// User defined lang
import enLocale from './lang/en.json'
import viLocale from './lang/vi.json'
// import { useSettingsStore } from "@/store/modules/settings"
import { getConfigLayout } from '@/utils/cache/local-storage'

const messages = {
  en: {
    ...enLocale
  },
  vi: {
    ...viLocale
  }
}

export const getLocale = () => {
  const settingsStore = getConfigLayout()
  console.log(settingsStore?.language)
  return settingsStore?.language ?? 'vi'
}

const i18n = createI18n({
  locale: getLocale(),
  messages: messages
})

export default i18n

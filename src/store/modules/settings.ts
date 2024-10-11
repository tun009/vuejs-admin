import { type Ref, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { type LayoutSettings, layoutSettings } from '@/config/layouts'
import { setConfigLayout } from '@/utils/cache/local-storage'

type SettingsStore = {
  // Use a mapping type to iterate over the keys of the layoutSettings object
  [Key in keyof LayoutSettings]: Ref<LayoutSettings[Key]>
}

type SettingsStoreKey = keyof SettingsStore

export const useSettingsStore = defineStore('settings', () => {
  /** State object */
  const state = {} as SettingsStore

  /** Get the data to be cached: Convert the state object to the settings object */
  const _getCacheData = () => {
    const settings = {} as LayoutSettings
    for (const [key, value] of Object.entries(state)) {
      // @ts-ignore
      settings[key as SettingsStoreKey] = value.value
    }
    return settings
  }

  // Traverse the key-value pairs of the layoutSettings object
  for (const [key, value] of Object.entries(layoutSettings)) {
    // Use type assertions to specify the type of key, wrap value in a ref function, and create a responsive variable
    const refValue = ref(value)
    // @ts-ignore
    state[key as SettingsStoreKey] = refValue
    // Monitor each responsive variable
    watch(refValue, () => {
      // Cache
      const settings = _getCacheData()
      setConfigLayout(settings)
    })
  }

  return state
})

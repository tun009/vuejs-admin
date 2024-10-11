import { ref } from 'vue'
import store from '@/store'
import { defineStore } from 'pinia'
import { useTagsViewStore } from './tags-view'
import { useSettingsStore } from './settings'
import { getToken, removeToken, setToken } from '@/utils/cache/cookies'
import { resetRouter } from '@/router'
import { loginApi, getUserInfoApi } from '@/api/login'
import { type LoginRequestData } from '@/api/login/types/login'
import routeSettings from '@/config/route'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '')
  const roles = ref<string[]>([])
  const username = ref<string>('')

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** Login */
  const login = async ({ username, password }: LoginRequestData) => {
    const { data } = await loginApi({ username, password })
    setToken(data.token)
    token.value = data.token
  }
  /** Get user details */
  const getInfo = async () => {
    const { data } = await getUserInfoApi()
    username.value = data.username
    // Verify that the returned roles is a non-empty array, otherwise insert a default role that has no effect to prevent the routing guard logic from entering an infinite loop
    roles.value = data.roles?.length > 0 ? data.roles : routeSettings.defaultRoles
  }
  /** Simulate role changes */
  const changeRoles = async (role: string) => {
    const newToken = 'token-' + role
    token.value = newToken
    setToken(newToken)
    // Refresh the page instead of re-login
    window.location.reload()
  }
  /** Sign out */
  const logout = () => {
    removeToken()
    token.value = ''
    roles.value = []
    resetRouter()
    _resetTagsView()
  }
  /** Reset Token */
  const resetToken = () => {
    removeToken()
    token.value = ''
    roles.value = []
  }
  /** Reset Visited Views and Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, roles, username, login, getInfo, changeRoles, logout, resetToken }
})

/** For use outside of setup */
export function useUserStoreHook() {
  return useUserStore(store)
}

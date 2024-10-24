import { LoginFormModel, UserInfoModel } from '@/@types/pages/login'
import { getUserInfoApi, loginApi } from '@/api/login'
import { LOGIN_PAGE } from '@/constants/router'
import router, { resetRouter } from '@/router'
import store from '@/store'
import { getToken, removeToken, setToken } from '@/utils/cache/cookies'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSettingsStore } from './settings'
import { useTagsViewStore } from './tags-view'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '')
  const roles = ref<string[]>([])
  const userInfo = ref<UserInfoModel>({} as UserInfoModel)

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** Login */
  const login = async ({ username, password }: LoginFormModel) => {
    const { data } = await loginApi({ username, password })
    setToken(data.token)
    token.value = data.token
  }
  /** Get user details */
  const getInfo = async () => {
    const { data } = await getUserInfoApi()
    userInfo.value = data
    // Verify that the returned roles is a non-empty array, otherwise insert a default role that has no effect to prevent the routing guard logic from entering an infinite loop
    roles.value = [data.role]
  }
  /** Simulate role changes */
  const changeRoles = async (role: string) => {
    const newToken = 'token-' + role
    token.value = newToken
    setToken(newToken)
    // Refresh the page instead of re-login
    window.location.reload()
  }

  /** Reset Visited Views and Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  /** Sign out */
  const logout = () => {
    removeToken()
    token.value = ''
    roles.value = []
    resetRouter()
    _resetTagsView()
    if (router.currentRoute.value.path !== LOGIN_PAGE) return
    location.reload()
  }
  /** Reset Token */
  const resetToken = () => {
    removeToken()
    token.value = ''
    roles.value = []
  }

  /** Set user info */
  const setUserInfo = (data: UserInfoModel) => {
    userInfo.value = data
  }

  return { token, roles, userInfo, login, getInfo, changeRoles, logout, resetToken, setUserInfo }
})

/** For use outside of setup */
export function useUserStoreHook() {
  return useUserStore(store)
}

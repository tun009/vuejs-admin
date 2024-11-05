import { LoginFormModel, UserInfoModel } from '@/@types/pages/login'
import { RoleEnum } from '@/@types/pages/users'
import { getUserInfoApi, loginApi } from '@/api/login'
import { resetRouter } from '@/router'
import store from '@/store'
import { getToken, removeToken, setToken } from '@/utils/cache/cookies'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '')
  const roles = ref<string[]>([])
  const userInfo = ref<UserInfoModel>({} as UserInfoModel)

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

  /** Sign out */
  const logout = () => {
    removeToken()
    token.value = ''
    roles.value = []
    resetRouter()
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

  const isAdmin = computed(() => userInfo.value.role === RoleEnum.ADMIN)
  const isChecker = computed(() => userInfo.value.role === RoleEnum.CHECKER)
  const isMaker = computed(() => userInfo.value.role === RoleEnum.MAKER)
  const isViewer = computed(() => userInfo.value.role === RoleEnum.VIEWER)

  return {
    token,
    roles,
    userInfo,
    login,
    getInfo,
    changeRoles,
    logout,
    resetToken,
    setUserInfo,
    isAdmin,
    isChecker,
    isMaker,
    isViewer
  }
})

/** For use outside of setup */
export function useUserStoreHook() {
  return useUserStore(store)
}

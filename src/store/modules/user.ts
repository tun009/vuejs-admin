import { LoginFormModel, UserInfoDataModel, UserInfoModel } from '@/@types/pages/login'
import { LonginTypeEnum, RoleEnum } from '@/@types/pages/users'
import { getUserInfoApi, loginApi, logoutApi, refreshTokenApi } from '@/api/login'
import { DATA_LOGIN_DEFAULT } from '@/constants/common'
import { MAIN_PAGE } from '@/constants/router'
import { resetRouter } from '@/router'
import store from '@/store'
import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken
} from '@/utils/cache/cookies'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const route = useRoute()

  const token = ref<string>(getToken() || '')
  const roles = ref<string[]>([])
  const userInfo = ref<UserInfoDataModel>({} as UserInfoDataModel)

  /** Login */
  const login = async ({ username, password }: LoginFormModel) => {
    const defaultValueLogin = {
      grant_type: LonginTypeEnum.PASSWORD,
      client_id: DATA_LOGIN_DEFAULT.customer.client_id,
      client_secret: DATA_LOGIN_DEFAULT.customer.client_secret
    }
    const data = await loginApi({ ...defaultValueLogin, username, password })
    setToken(data.access_token)
    setRefreshToken(data.access_token)
    token.value = data.access_token
  }
  const loginWithAuthorizeCode = async (code: string) => {
    const defaultValueLogin = {
      grant_type: LonginTypeEnum.AUTH_CODE,
      client_id: DATA_LOGIN_DEFAULT.admin.client_id,
      client_secret: DATA_LOGIN_DEFAULT.admin.client_secret,
      code,
      redirect_uri: `${window.location.origin}/auth/callback`
    }
    const data = await loginApi(defaultValueLogin)
    setToken(data.access_token)
    setRefreshToken(data.access_token)
    token.value = data.access_token
  }
  /** Get user details */
  const getInfo = async () => {
    const { data } = await getUserInfoApi()
    userInfo.value = data.user
    // Verify that the returned roles is a non-empty array, otherwise insert a default role that has no effect to prevent the routing guard logic from entering an infinite loop
    roles.value = [data.user.role || RoleEnum.VIEWER]
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
    logoutApi({ id: userInfo.value.id, refreshToken: getRefreshToken() ?? '' })
    removeToken()
    removeRefreshToken()
    token.value = ''
    roles.value = []
    resetRouter()
    if (route.path === MAIN_PAGE) return
    location.reload()
  }

  /** Reset Token */
  const resetToken = () => {
    removeToken()
    token.value = ''
    roles.value = []
  }

  /** Refresh token */
  const refreshToken = async () => {
    try {
      const { data } = await refreshTokenApi({ id: userInfo.value.id, refreshToken: getRefreshToken() ?? '' })
      setToken(data.access_token)
      setRefreshToken(data.refresh_token)
      token.value = data.access_token
    } catch (error) {
      console.error(error)
      logout()
    }
  }
  /** Set user info */
  const setUserInfo = (data: UserInfoModel) => {
    userInfo.value = data.user
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
    refreshToken,
    loginWithAuthorizeCode,
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

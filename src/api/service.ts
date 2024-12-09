import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useUserStoreHook } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { get, merge } from 'lodash-es'
import { getToken } from '../utils/cache/cookies'
import { trimObjectValues } from '@/utils/common'

/** Log out and force refresh the page (will redirect to the login page) */
function logout() {
  useUserStoreHook().logout()
}

function refreshToken() {
  useUserStoreHook().refreshToken()
}

/** Create a request instance */
function createService() {
  // Create an axios instance named service
  const service = axios.create()
  // Request interception
  service.interceptors.request.use(
    (config) => config,
    // Send failed
    (error) => Promise.reject(error)
  )
  // Response interception (can be adjusted according to specific business)
  service.interceptors.response.use(
    (response) => {
      // apiData is the data returned by the api
      const apiData = response.data
      // Binary data is returned directly
      const responseType = response.request?.responseType
      if (responseType === 'blob' || responseType === 'arraybuffer') return response
      // This code is the business code agreed with the backend
      const code = apiData.code
      // If there is no code, it means that this is not an api developed by the project backend
      if (code === undefined) {
        // ElMessage.error('Not the interface of this system')
        // return Promise.reject(new Error('Not the interface of this system'))
        return apiData
      }
      switch (code) {
        case 200:
          // This system uses code === 0 to indicate no business error
          return apiData
        case 401:
          // When the Token expires
          return logout()
        default:
          // Not the correct code
          ElMessage.error(apiData.message || 'Error')
          return Promise.reject(new Error('Error'))
      }
    },
    (error) => {
      // status is the HTTP status code
      const status = get(error, 'response.status')
      const errorCode = get(error, 'code')
      const msg = get(error, 'response.data.msg')
      const msgLocal = errorCode === 'ERR_NETWORK' ? 'Problem connecting to server' : ''
      switch (status) {
        case 400:
          error.message = 'Request error'
          break
        case 401:
          error.message = 'Unauthorized'
          // When the Token expires
          if (!getToken()) break
          refreshToken()
          break
        case 403:
          error.message = 'Access denied'
          break
        case 404:
          error.message = 'Request address error'
          break
        case 408:
          error.message = 'Request timeout'
          break
        case 500:
          error.message = 'Server internal error'
          break
        case 501:
          error.message = 'Service not implemented'
          break
        case 502:
          error.message = 'Gateway error'
          break
        case 503:
          error.message = 'Service unavailable'
          break
        case 504:
          error.message = 'Gateway timeout'
          break
        case 505:
          error.message = 'HTTP version not supported'
          break
        default:
          break
      }
      ElMessage.error(msg ?? error.message ?? msgLocal)
      return Promise.reject(error)
    }
  )
  return service
}

/** Create request method */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig, customConfig?: ApiCustomRequestConfigModel): Promise<T> {
    const token = getToken()
    const exactToken = token ? `Bearer ${token}` : undefined
    const defaultConfig = {
      headers: {
        // Carry Token
        Authorization: customConfig?.notAuth ? undefined : exactToken,
        'Content-Type': config.data instanceof FormData ? 'multipart/form-data' : 'application/json'
      },
      timeout: 30000,
      baseURL: import.meta.env.VITE_BASE_API
      // data: {}
    }
    // Merge the default configuration defaultConfig and the passed-in custom configuration config into mergeConfig
    const mergeConfig = merge(defaultConfig, {
      ...config,
      ...(config?.data ? { data: trimObjectValues(config?.data) } : {})
    })
    return service(mergeConfig)
  }
}

/** Instance for network request */
const service = createService()
/** Method for network request */
export const request = createRequest(service)

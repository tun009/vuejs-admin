import { getToken } from '@/utils/cache/cookies'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_PATH
})

http.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (res) => {
    const { data } = res
    if (data.meta.status !== 200 && data.meta.status !== 201) {
      ElMessage({
        showClose: true,
        message: data.meta.msg,
        type: 'error'
      })
    }
    return res.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

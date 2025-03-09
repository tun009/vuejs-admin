/** All api interface response data should comply with this format */
interface ApiResponseData<T> {
  code: number
  data: T
  msg: string
}

interface ApiCustomRequestConfigModel {
  notAuth?: boolean
  showError?: boolean
}
interface ApiResponseDataNew<T> {
  message: string
  data: T
  success: boolean
}

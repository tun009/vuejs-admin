/** All api interface response data should comply with this format */
interface ApiResponseData<T> {
  code: number
  data: T
  message: string
}

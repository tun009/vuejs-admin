import { RuleModel } from '@/@types/pages/rules'
import { GetRuleRequestModel } from '@/@types/pages/rules/services/RuleRequest'
import { GetRuleResponseModel } from '@/@types/pages/rules/services/RuleResponse'
import { getDataWithPagination } from '@/utils/common'
// import { GetUserResponseModel } from '@/@types/pages/users/service/UserResponse'
// import { request } from '@/api/service'

/** Log in and return token */
// export function getUsers(params: GetUserRequestModel) {
//   return request<GetUserResponseModel>({
//     url: 'users/login',
//     method: 'post',
//     params
//   })
// }
export function getRules(params: GetRuleRequestModel): Promise<GetRuleResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          list: getDataWithPagination(
            Array.from({ length: 3124 }, (_, index) => ({
              id: index + 1,
              stt: index + 1,
              name: 'Commercial Invoice' + ` ${index + 1}`,
              code: 'UCI-001',
              content: 'Nội dung'
            })),
            params.pageNum,
            params.pageSize
          ) as RuleModel[],
          total: 3124,
          pageNum: params.pageNum,
          pageSize: params.pageSize
        },
        msg: 'Meo'
      })
    }, 2000)
  })
}

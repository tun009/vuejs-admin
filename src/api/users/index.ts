import { RoleEnum, UserModel, UserStatusEnum } from '@/@types/pages/users'
import { GetUserRequestModel } from '@/@types/pages/users/services/UserRequest'
import { GetUserResponseModel } from '@/@types/pages/users/services/UserResponse'
import { getDataWithPagination } from '@/utils/common'
// import { GetUserResponseModel } from '@/@types/pages/users/service/UserResponse'
// import { request } from '@/api/service'

// mock data
const ROLE_LIST = [RoleEnum.ADMIN, RoleEnum.MARKER, RoleEnum.CHECKER]
const USER_STATUS_LIST = [UserStatusEnum.ACTIVE, UserStatusEnum.UNACTIVE, UserStatusEnum.BLOCK]

/** Log in and return token */
// export function getUsers(params: GetUserRequestModel) {
//   return request<GetUserResponseModel>({
//     url: 'users/login',
//     method: 'post',
//     params
//   })
// }
export function getUsers(params: GetUserRequestModel): Promise<GetUserResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          list: getDataWithPagination(
            Array.from({ length: 3124 }, (_, index) => ({
              id: index + 1,
              isMe: true,
              name: 'Nguyễn Quốc Thắng' + ` ${index + 1}`,
              role: ROLE_LIST[Math.floor(Math.random() * 3)],
              sol: 'Hội sở',
              solId: 1120,
              status: USER_STATUS_LIST[Math.floor(Math.random() * 3)],
              stt: index + 1,
              username: 'thang.nq'
            })),
            params.pageNum,
            params.pageSize
          ) as UserModel[],
          pageNum: params.pageNum,
          pageSize: params.pageSize,
          total: 3124
        },
        message: 'Meo'
      })
    }, 2000)
  })
}

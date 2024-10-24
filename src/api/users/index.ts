import { ChangePasswordRequestModel, ChangeProfileRequestModel } from '@/@types/pages/profile/services/ProfileRequest'
import {
  ChangePasswordResponseModel,
  ChangeProfileResponseModel
} from '@/@types/pages/profile/services/ProfileResponse'
import { RoleEnum, UserModel, UserStatusEnum } from '@/@types/pages/users'
import { GetUserRequestModel } from '@/@types/pages/users/services/UserRequest'
import { GetUserResponseModel } from '@/@types/pages/users/services/UserResponse'
import { getDataWithPagination } from '@/utils/common'
import { request } from '../service'

// mock data
const ROLE_LIST = [RoleEnum.ADMIN, RoleEnum.MAKER, RoleEnum.CHECKER]
const USER_STATUS_LIST = [UserStatusEnum.ACTIVE, UserStatusEnum.UNACTIVE, UserStatusEnum.BLOCK]

/** Get users */
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
              stt: index + 1,
              name: 'Nguyễn Quốc Thắng' + ` ${index + 1}`,
              username: 'thang.nq',
              role: ROLE_LIST[Math.floor(Math.random() * 3)],
              isMe: true,
              sol: 'Hội sở',
              solId: 1120,
              status: USER_STATUS_LIST[Math.floor(Math.random() * 3)]
            })),
            params.pageNum,
            params.pageSize
          ) as UserModel[],
          total: 3124,
          pageNum: params.pageNum,
          pageSize: params.pageSize
        },
        msg: 'Meo'
      })
    }, 2000)
  })
}

/** Update user */
export function updateUserInfo(data: ChangeProfileRequestModel) {
  return request<ChangeProfileResponseModel>({
    url: 'users',
    method: 'put',
    data
  })
}

/** Change user password */
export function changeUserPassword(data: ChangePasswordRequestModel) {
  return request<ChangePasswordResponseModel>({
    url: 'users/change-password',
    method: 'post',
    data
  })
}

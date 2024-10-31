import { ChangePasswordRequestModel, ChangeProfileRequestModel } from '@/@types/pages/profile/services/ProfileRequest'
import {
  ChangePasswordResponseModel,
  ChangeProfileResponseModel
} from '@/@types/pages/profile/services/ProfileResponse'
import { GetUserResponseModel } from '@/@types/pages/users/services/UserResponse'
import { request } from '../service'
import { AddUserRequestModel, GetUserRequestModel } from '@/@types/pages/users/services/UserRequest'
import { AddUserResponseModel } from '@/@types/pages/users/services/UserResponse'

/** get user */
export function getUsers(data: GetUserRequestModel) {
  return request<GetUserResponseModel>({
    url: 'users/query',
    method: 'post',
    data
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
/** add user */
export function addUser(data: AddUserRequestModel) {
  return request<AddUserResponseModel>({
    url: 'users/register',
    method: 'post',
    data
  })
}

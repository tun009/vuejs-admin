import { ChangePasswordRequestModel, ChangeProfileRequestModel } from '@/@types/pages/profile/services/ProfileRequest'
import {
  ChangePasswordResponseModel,
  ChangeProfileResponseModel
} from '@/@types/pages/profile/services/ProfileResponse'
import {
  AddUserRequestModel,
  GetUserRequestModel,
  UpdateUserRequestModel
} from '@/@types/pages/users/services/UserRequest'
import {
  AddUserResponseModel,
  GetCheckerResponseModel,
  GetUserResponseModel,
  UpdateUserResponseModel,
  DeleteUserResponseModel,
  LockUserResponseModel
} from '@/@types/pages/users/services/UserResponse'
import { request } from '../service'
import { GetBranchResponseModel } from '@/@types/pages/docs/documents/services/DocumentResponse'

/** get user */
export function getUsers(data: GetUserRequestModel) {
  return request<GetUserResponseModel>({
    url: 'users/query',
    method: 'post',
    data
  })
}

/** get checker */
export function getChecker() {
  return request<GetCheckerResponseModel>({
    url: 'users/list-checker',
    method: 'get'
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

export function getBranches() {
  return request<GetBranchResponseModel>({
    url: 'branches',
    method: 'get'
  })
}

/** Update user */
export function updateUser(data: UpdateUserRequestModel) {
  return request<UpdateUserResponseModel>({
    url: 'users',
    method: 'put',
    data
  })
}

/** Delete user */
export function deleteUser(ids: (string | number)[]) {
  return request<DeleteUserResponseModel>({
    url: 'users/delete?' + ids.map((id) => `userIds=${id}`).join('&'),
    method: 'delete'
  })
}

/**Lock user */
export function lockUser(ids: (string | number)[]) {
  return request<LockUserResponseModel>({
    url: 'users/lock?' + ids.map((id) => `userIds=${id}`).join('&'),
    method: 'put'
  })
}

/**Reset password user */
export function resetPasswordUser(id: string | number) {
  return request<LockUserResponseModel>({
    url: 'users/reset-password?' + `userId=${id}`,
    method: 'put'
  })
}

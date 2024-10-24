import { UserInfoModel } from '../../login'
import { UserInfoResponseModel } from '../../login/services/LoginResponse'

export type ChangeProfileResponseModel = Omit<UserInfoResponseModel, 'branch'>

export type ChangePasswordResponseModel = UserInfoModel

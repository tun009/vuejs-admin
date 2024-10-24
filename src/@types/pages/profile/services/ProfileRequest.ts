import { ChangePasswordFormModel, ChangeProfileFormModel } from '..'

export interface ChangeProfileRequestModel extends ChangeProfileFormModel {
  id: number
}

export type ChangePasswordRequestModel = Omit<ChangePasswordFormModel, 'confirmPassword'>

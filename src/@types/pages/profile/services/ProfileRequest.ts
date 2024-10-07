export interface ChangeProfileRequestModel {
  username: string
  name: string
  phoneNumber: string
}

export interface ChangePasswordRequestModel {
  password: string
  newPassword: string
  confirmPassword: string
}

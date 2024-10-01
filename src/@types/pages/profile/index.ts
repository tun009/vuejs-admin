export interface ChangeProfileRequestData {
  username: string
  name: string
  phoneNumber: string
}

export interface ChangePasswordRequestData {
  password: string
  newPassword: string
  confirmPassword: string
}

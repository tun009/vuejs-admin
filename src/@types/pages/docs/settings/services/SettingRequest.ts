import { AutoConfigSettingModel, UpdateInfoExtractFormModel } from '..'

export interface UpdateConfidenceRequestModel {
  id: number
  color: string
  min: number
  max: number
}

export type UpdateCheckConfigRequestModel = AutoConfigSettingModel

export type UpdateInfoExtractRequestModel = UpdateInfoExtractFormModel

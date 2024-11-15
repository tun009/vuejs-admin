import { UpdateInfoExtractFormModel } from '..'

export interface UpdateConfidenceRequestModel {
  id: number
  color: string
  min: number
  max: number
}

export type UpdateInfoExtractRequestModel = UpdateInfoExtractFormModel

export interface UpdateInfoExtractFormModel {
  id: number
  name: string
  key: string
  description: string
  docType: string
}

export interface ConfidenceRequestModel {
  id: number
  color: string
  min: number
  max: number
}

export interface UpdateConfidenceFormModel {
  id: number
  color: string
  min: number
  max: number
}

import { ColumnConfigModel } from '@/@types/common'

export interface SettingModel {
  id: number
  name: string
  key: string
  description: string
  docType: string
}

export interface SettingMD {
  id: number
  name: string
  key: string
  description: string
  docType: string
}

export enum AutoCheckConfigEnum {
  MANUAL = 'MANUAL',
  THRESHOLD = 'THRESHOLD',
  AUTO = 'AUTO'
}

export interface AutoConfigSettingModel {
  id: number
  type: AutoCheckConfigEnum
  autoThreshold: number
}

// export const dataSelectDocs: SelectOptionModel[] = [{ label: 'INVOICE', value: 1519 }]

export const infoListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'STT',
    width: 80
  },
  {
    field: 'name',
    label: 'Tên trường trích xuất'
  },
  {
    field: 'key',
    label: 'Core_key'
  },
  {
    field: 'type',
    label: 'Loại dữ liệu'
  },
  {
    field: 'description',
    label: 'Mô tả'
  },
  {
    field: 'actions',
    label: 'Hành động'
  }
]

export interface UpdateConfidenceFormModel {
  toConfidence1: number
  toConfidence2: number
  toConfidence3: number
  toConfidence4: number
}

export interface UpdateConfidenceColorFormModel {
  color1: string
  color2: string
  color3: string
  color4: string
}

export interface UpdateInfoExtractFormModel {
  id: number
  name: string
  key: string
  description: string
  docType: string
}

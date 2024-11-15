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

// export const dataSelectDocs: SelectOptionModel[] = [{ label: 'INVOICE', value: 1519 }]

export const infoListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'STT'
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
    field: 'docType',
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

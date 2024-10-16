import { ColumnConfigModel, SelectOptionModel } from '@/@types/common'

export interface SettingModel {
  id: number
  stt: number
  fieldName: string
  coreKey: string
  typeData: string
  description: string
}

export const dataSelectDocs: SelectOptionModel[] = [{ label: 'INVOICE', value: 1519 }]

export const infoListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'STT'
  },
  {
    field: 'fieldName',
    label: 'Tên trường trích xuất'
  },
  {
    field: 'coreKey',
    label: 'Core_key'
  },
  {
    field: 'typeData',
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

import { ColumnConfigModel } from '@/@types/common'

export interface RuleModel {
  id: number
  stt: number
  name: string
  code: string
  content: string
}

export interface UpdateRuleRequestModel {
  name: string
  code: string
  content: string
}

export const ruleListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'STT'
  },
  {
    field: 'name',
    label: 'Loại chứng từ'
  },
  {
    field: 'code',
    label: 'Mã'
  },
  {
    field: 'content',
    label: 'Nội dung'
  },
  {
    field: 'actions',
    label: 'Hành động'
  }
]

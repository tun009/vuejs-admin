import { ColumnConfigModel, SelectOptionModel } from '@/@types/common'

export interface RuleModel {
  id: number
  stt: number
  docType: string
  code: string
  en: string
  type: RuleTypeEnum
}

export interface UpdateRuleRequestModel {
  name: string
  code: string
  content: string
}

export const ruleListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'STT',
    width: 80
  },
  {
    field: 'docType',
    label: 'Loại chứng từ',
    width: 250
  },
  {
    field: 'code',
    label: 'Mã',
    width: 200
  },
  {
    field: 'en',
    label: 'Nội dung',
    minWidth: 200
  },
  {
    field: 'actions',
    label: 'Hành động',
    width: 120
  }
]
// document enum
export enum RuleTypeEnum {
  LAW = 'LAW',
  CATEGORY = 'CATEGORY'
}

export enum DocTypeEnum {
  INVOICE = 'INVOICE',
  LETTER_OF_CREDIT = 'LETTER_OF_CREDIT',
  DRAFT = 'DRAFT',
  EXPORT_DOC_PRESENT = 'EXPORT_DOC_PRESENT',
  BILL_OF_LADING = 'BILL_OF_LADING'
}

export const docTypeOptions: SelectOptionModel[] = [
  {
    label: 'Tất cả',
    value: -1
  },
  {
    label: 'Trích xuất invoice',
    value: DocTypeEnum.INVOICE
  },
  {
    label: 'Trích xuất LC',
    value: DocTypeEnum.LETTER_OF_CREDIT
  },
  {
    label: 'Trích xuất Bill Of Exchange',
    value: DocTypeEnum.DRAFT
  },
  {
    label: 'Trích xuất giấy xuất trình giấy tờ',
    value: DocTypeEnum.EXPORT_DOC_PRESENT
  },
  {
    label: 'Trích xuất Bill Of Lading',
    value: DocTypeEnum.BILL_OF_LADING
  }
]
export interface FilterRulesModel {
  type: RuleTypeEnum
  query: string
  docTypeId: number
}
export interface RuleUpdateModel {
  id: number
  type: RuleTypeEnum
  content: string
}

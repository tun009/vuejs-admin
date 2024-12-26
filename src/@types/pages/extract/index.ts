import { SelectOptionModel, StatusColorModel } from '@/@types/common'
import { STATUS_COLORS } from '@/constants/color'

export interface ExtractResultOcrModel {
  id: number
  confidence?: number
  coreKey: string
  name: string
  extractionValue: string
  validatedValue: string
  type: 'list[text]' | 'text' | 'image' | 'structured_table'
  bboxes: number[][][]
  pageId: number
  headers: ExtractResultOcrTableHeaderModel[]
  children: ExtractResultOcrTableChildrenModel[][]
  childrenMapping: ExtractResultOcrTableChildrenModel[][]
  listText?: ExtractResultOcrModel[]
  pageBboxes?: ExtractResultOcrPageBBboxesModel[]
}
export interface ExtractResultOcrPageBBboxesModel {
  bboxes: number[][]
  page: number
}
export interface ExtractResultOcrTableHeaderModel {
  key: string
  name: string
}
export interface ExtractResultOcrTableChildrenModel {
  bboxes: number[]
  confidence: number
  coreKey: string
  extractionValue: string
  id: number
  name: string
  pageId: number
  type: 'list[text]' | 'text' | 'image' | 'structured_table'
  validatedValue: string
  pageBboxes?: ExtractResultOcrPageBBboxesModel[]
}
export interface ExtractDossierTypeModel {
  id: number
  name: string
  key: string
  type: string
}
export interface ExtractDossierModel {
  id: number
  docType: ExtractDossierTypeModel
  status: string | number
  color: StatusColorModel
  docTypeName: string
  pathFile: string
}
export interface ExtractDocumentModel {
  id: number
  docType: string
  pathFile: string
  fileName: string
  result: ExtractResultOcrModel[][]
}
export interface ExtractNoteModel {
  stt: number
  id: number
  content: string
  createdAt: string
  createdBy: string
}
export interface ExtractClassifyResultModel {
  confidence: number
  documentType: string
  pages: number[]
  isLoaded?: boolean
}
export interface ExtractClassifyModel {
  id: number
  fileName: string
  filePath: string
  status: string
  createdAt: string
  createdBy: string
  ocrResults: ExtractClassifyResultModel[]
  pdfEtract: any
}
export enum ExtractHistoryTypeEnum {
  EDIT = 'EDIT',
  COMPARISON = 'COMPARISON',
  DENIED = 'DENIED',
  REPLACE = 'REPLACE',
  OCR = 'OCR'
}
export interface ExtractHistoryModel {
  type: ExtractHistoryTypeEnum
  field?: string
  valueBefore?: string
  valueAfter?: string
  createdBy: string
  role: string
  day: string
  hour: string
}
export interface ExtractHistoryGroupedModel {
  field: string
  valueBefore: string
  valueAfter: string
}

export interface ExtractHistoryGroupedResultModel {
  type: string
  createdBy: string
  role: string
  day: string
  hour: string
  value: ExtractHistoryGroupedModel[]
  fileName?: string
}
export interface ExtractHistoryGroupedDayModel {
  day: string
  actions: ExtractHistoryGroupedResultModel[]
}
export const extractHistoryTypes: SelectOptionModel[] = [
  {
    label: 'Chỉnh sửa',
    value: ExtractHistoryTypeEnum.EDIT,
    color: STATUS_COLORS.VALIDATED
  },
  {
    label: 'Thực hiện đối sánh lại bộ chứng từ',
    value: ExtractHistoryTypeEnum.COMPARISON,
    color: STATUS_COLORS.VALIDATED
  },
  {
    label: 'Từ chối bộ chứng từ',
    value: ExtractHistoryTypeEnum.DENIED,
    color: STATUS_COLORS.ERROR
  },
  {
    label: 'Thay thế chứng từ bởi file ',
    value: ExtractHistoryTypeEnum.REPLACE,
    color: STATUS_COLORS.VALIDATED
  },
  {
    label: 'Thực hiện trích xuất OCR chứng từ',
    value: ExtractHistoryTypeEnum.OCR,
    color: STATUS_COLORS.VALIDATED
  }
]
export interface ExtractNotePostModel {
  id: number
  value: string
  createdBy: string
  createdAt: string
}
export interface DocumentTypeModel {
  id: number
  name: string
  key: string
  type: string
}

import { SelectOptionModel } from '@/@types/common'

export enum DossierStatusEnum {
  ACTIVE,
  UNACTIVE,
  BLOCK
}
export interface ExtractResultOcrModel {
  id: number
  confidence?: number
  coreKey: string
  extractionValue: string
  validatedValue: string
  type: string
  bboxes: number[][][]
  pageId: number
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
}
export interface ExtractDocumentModel {
  id: number
  docType: string
  pathFile: string
  fileName: string
  result: ExtractResultOcrModel[][]
}
export interface ExtractHistoryAction {
  field: string
  before: string
  after: string
  type: string
}
export interface ExtractHistoryDetail {
  time: string
  user: string
  role: string
  actions: ExtractHistoryAction[]
}
// export interface ExtractHistoryModel {
//   date: string
//   histories: ExtractHistoryDetail[]
// }
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
  OCR = 'OCR',
  DENIED = 'DENIED',
  REPLACE = 'REPLACE',
  EXTRACTION = 'EXTRACTION'
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
}
export interface ExtractHistoryGroupedDayModel {
  day: string
  actions: ExtractHistoryGroupedResultModel[]
}
export const extractHistoryTypes: SelectOptionModel[] = [
  {
    label: 'Chỉnh sửa',
    value: ExtractHistoryTypeEnum.EDIT
  },
  {
    label: 'Thực hiện đối sánh lại bộ chứng từ',
    value: ExtractHistoryTypeEnum.OCR
  },
  {
    label: 'Từ chối bộ chứng từ',
    value: ExtractHistoryTypeEnum.DENIED
  },
  {
    label: 'Thay thế chứng từ bởi file ',
    value: ExtractHistoryTypeEnum.REPLACE
  },
  {
    label: 'Thực hiện trích xuất OCR chứng từ',
    value: ExtractHistoryTypeEnum.EXTRACTION
  }
]
export interface ExtractNotePostModel {
  id: number
  value: string
  createdBy: string
  createdAt: string
}

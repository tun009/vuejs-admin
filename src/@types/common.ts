export interface ColumnConfigModel {
  field: string
  label: string
  class?: string
  minWidth?: number
  width?: number
  html?: boolean
  columns?: ColumnConfigModel[]
}

export interface PaginationModel {
  pageNum: number
  pageSize: number
}

export interface BaseListDataResponseModel<T> extends PaginationModel {
  list: T[]
  total: number
  emptyFlag?: boolean
}

export type BaseListResponseModel<T> = ApiResponseData<BaseListDataResponseModel<T>>

export interface StatusColorModel {
  text: string
  backgound: string
}

export interface SelectOptionModel {
  label: string
  value: any
  description?: string
  color?: StatusColorModel
}

export type BaseResponseModel<T> = ApiResponseData<T>

export enum DocumentStatusEnum {
  NEW = 'NEW',
  CLASSIFYING = 'CLASSIFYING',
  CLASSIFIED = 'CLASSIFIED',
  OCRING = 'OCRING',
  OCRED = 'OCRED',
  COMPARING = 'COMPARING',
  WAIT_CHECK = 'WAIT_CHECK',
  CHECKING = 'CHECKING',
  CHECKED = 'CHECKED',
  WAIT_VALIDATE = 'WAIT_VALIDATE',
  VALIDATING = 'VALIDATING',
  ADJUST_REQUESTED = 'ADJUST_REQUESTED',
  VALIDATED = 'VALIDATED',
  DENIED = 'DENIED',
  ERROR = 'ERROR',
  EXTRACTION_ERROR = 'EXTRACTION_ERROR',
  COMPARISON_ERROR = 'COMPARISON_ERROR',
  CLASSIFICATION_ERROR = 'CLASSIFICATION_ERROR',
  CLASSIFY_ERROR = 'CLASSIFY_ERROR',
  OCR_ERROR = 'OCR_ERROR'
}

export const uploadDocumentColumnConfig: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'docs.document.stt',
    width: 60
  },
  {
    field: 'fileName',
    label: 'docs.document.fileName'
  },
  {
    field: 'actions',
    label: 'docs.document.actions',
    width: 110
  }
]

export interface ColumnConfigModel {
  field: string
  label: string
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
}

export type BaseListResponseModel<T> = ApiResponseData<BaseListDataResponseModel<T>>

export interface SelectOptionModel {
  label: string
  value: any
  description?: string
}

export type BaseResponseModel<T> = ApiResponseData<T>
export type TLanguage = 'vi' | 'en'

export enum DocumentStatusEnum {
  NEW,
  CLASSIFYING,
  CLASSIFIED,
  OCRING,
  MATCHED,
  WAIT_FOR_CHECK,
  CHECKING,
  CHECKED,
  WAIT_FOR_APPROVAL,
  NEED_ADJUSTMENT,
  APPROVED,
  REJECTED,
  ERROR
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

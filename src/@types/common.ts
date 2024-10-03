export interface ColumnConfigModel {
  field: string
  label: string
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

import { PaginationModel } from '@/@types/common'

export interface GetReportRequestModel extends PaginationModel {
  searchQuery: string
}

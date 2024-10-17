import { PaginationModel } from '@/@types/common'

export interface GetRuleRequestModel extends PaginationModel {
  searchQuery: string
}

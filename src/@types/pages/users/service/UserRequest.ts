import { PaginationModel } from '@/@types/common'

export interface GetUserRequestModel extends PaginationModel {
  searchQuery: string
}

import { PaginationModel } from '@/@types/common'
import { FilterReportModel } from '..'

export interface GetReportRequestModel extends PaginationModel, Partial<FilterReportModel> {}

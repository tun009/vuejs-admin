import { BaseListResponseModel } from '@/@types/common'
import { ReportModel, ReportDetailModel } from '..'

export type GetReportResponseModel = BaseListResponseModel<ReportModel>
export type GetReportDetailResponseModel = ApiResponseData<ReportDetailModel>

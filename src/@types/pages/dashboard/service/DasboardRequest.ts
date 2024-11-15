import { BusinessTypeEnum } from '../../reports'

export interface GetFieldChangedRequestModel {
  type: string
}
export interface GetDashboardSumaryResponseModel {
  beginDate: string
  endDate: string
  bizType?: BusinessTypeEnum | -1
}
export interface GetDashboardRatioResponseModel extends GetDashboardSumaryResponseModel {
  docTypeId?: number
}

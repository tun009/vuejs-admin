import {
  DasboardBranchResponseModel,
  DasboardOverviewResponseModel,
  DasboardRatioResponseModel
} from '@/@types/pages/dashboard/service/DashboardResponse'
import { request } from '../service'
import {
  GetDashboardRatioResponseModel,
  GetDashboardSumaryResponseModel
} from '@/@types/pages/dashboard/service/DasboardRequest'

export function getDashboardSumaryApi(data: GetDashboardSumaryResponseModel) {
  return request<DasboardOverviewResponseModel>({
    url: 'report/overview',
    method: 'get',
    params: data
  })
}
export function getDashboardRatioApi(data: GetDashboardRatioResponseModel) {
  return request<DasboardRatioResponseModel>({
    url: 'report/edit-ratio',
    method: 'get',
    params: data
  })
}
export function getDashboardBranchApi(data: GetDashboardSumaryResponseModel) {
  return request<DasboardBranchResponseModel>({
    url: 'report/stats-branch',
    method: 'get',
    params: data
  })
}

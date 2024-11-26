// import { ReportModel } from '@/@types/pages/reports'
import { GetReportRequestModel } from '@/@types/pages/reports/services/ReportRequest'
import { GetReportDetailResponseModel, GetReportResponseModel } from '@/@types/pages/reports/services/ReportResponse'
// import { getDataWithPagination } from '@/utils/common'
import { request } from '@/api/service'

/** get document */
export function getReports(data: GetReportRequestModel) {
  return request<GetReportResponseModel>({
    url: 'report/dossier-report',
    method: 'post',
    data
  })
}

/**get detail report */
export function getDetailReport(id: number) {
  return request<GetReportDetailResponseModel>({
    url: `report/${id}`,
    method: 'get'
  })
}

/** download file excel */
export function downloadFileExcel(data: any) {
  return request({
    url: 'report/>download',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

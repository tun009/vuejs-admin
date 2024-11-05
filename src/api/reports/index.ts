import { ReportModel } from '@/@types/pages/reports'
import { GetReportRequestModel } from '@/@types/pages/reports/services/ReportRequest'
import { GetReportResponseModel } from '@/@types/pages/reports/services/ReportResponse'
import { getDataWithPagination } from '@/utils/common'

export function getReports(params: GetReportRequestModel): Promise<GetReportResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          list: getDataWithPagination(
            Array.from({ length: 1000 }, (_, index) => ({
              id: index + 1,
              stt: index + 1,
              name: 'Tên bộ chứng từ' + ` ${index + 1}`,
              type: 'Loại nghiệp vụ',
              status: 'trạng thái',
              result: 'kết quả xử lý',
              sol: 'sol',
              totalTime: 'tổng thời gian xử lý',
              system: 'Hệ thống xử lý',
              maker: 'maker xử lý',
              checker: 'checker xử lý'
            })),
            params.pageNum,
            params.pageSize
          ) as ReportModel[],
          total: 1000,
          pageNum: params.pageNum,
          pageSize: params.pageSize
        },
        msg: 'Meo'
      })
    }, 2000)
  })
}

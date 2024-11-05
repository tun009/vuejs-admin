import { PaginationModel } from '@/@types/common'
import { SettingModel } from '@/@types/pages/docs/settings'
import { GetSettingResponseModel } from '@/@types/pages/docs/settings/services/SettingResponse'
import { getDataWithPagination } from '@/utils/common'

export function getSettings(_params: PaginationModel): Promise<GetSettingResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          list: getDataWithPagination(
            Array.from({ length: 200 }, (_, index) => ({
              coreKey: 'documentName',
              description: 'Tiêu đề ở đây',
              fieldName: 'Tên chứng từ',
              id: index + 1,
              stt: index + 1,
              typeData: 'text'
            })),
            0,
            200
          ) as SettingModel[],
          pageNum: 0,
          pageSize: 200,
          total: 200
        },
        msg: 'Meo'
      })
    }, 2000)
  })
}

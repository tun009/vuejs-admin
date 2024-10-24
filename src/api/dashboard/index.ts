import { GetFieldChangedResponseModel, GetSOLsResponseModel } from '@/@types/pages/dashboard/service/DashboardResponse'
import { FieldChangedModel, SOLModel } from '@/@types/pages/dashboard'
import { FIELD_CHANGED, SOLS } from '@/mocks/dashboard'

export function getFieldsChanged(type: string): Promise<GetFieldChangedResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: (type === '-1' ? FIELD_CHANGED : FIELD_CHANGED.filter((x) => x.name === type)) as FieldChangedModel[],
        msg: ''
      })
    }, 500)
  })
}
export function getSOLs(): Promise<GetSOLsResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: SOLS as SOLModel[],
        msg: ''
      })
    }, 500)
  })
}

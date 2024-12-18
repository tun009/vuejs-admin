import { BranchModel } from '../login'
import { BusinessTypeEnum } from '../reports'

export interface FieldChangedModel {
  name: string
  field: string
  rate: number
}

export interface FilterReportOverviewModel {
  bizType?: BusinessTypeEnum | -1
}

export interface FilterReportRatioModel extends FilterReportOverviewModel {
  docTypeId?: number
}

export const fieldChangedListColumnConfigs = [
  {
    field: 'key',
    label: 'Tên trường'
  },
  {
    field: 'editRatio',
    label: 'Tỉ lệ chỉnh sửa (%)',
    width: 200
  }
]

export const SOLListColumnConfigs = [
  {
    field: 'stt',
    label: '#',
    width: 70,
    class: '!text-center'
  },
  {
    field: 'code',
    label: 'Mã SOL',
    width: 120
  },
  {
    field: 'name',
    label: 'Tên ĐVKD'
  },
  {
    field: 'totalDossierHandle',
    label: 'Số lượng BCT đã xử lý',
    width: 200
  }
]

export interface DasboardOverviewModel {
  [key: string]: number
}

export interface DasboardRatioModel {
  key: string
  editRatio: number | string
  docType: string
}

export interface DasboardBranchModel {
  totalDossierHandle: number
  branch: BranchModel
  stt: number
  name: string
  code: string
}

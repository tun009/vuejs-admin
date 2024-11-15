import { FieldChangedModel, DasboardOverviewModel, DasboardRatioModel, DasboardBranchModel } from '..'

import { BaseResponseModel } from '@/@types/common'

export type GetFieldChangedResponseModel = BaseResponseModel<FieldChangedModel[]>
export type DasboardOverviewResponseModel = ApiResponseData<DasboardOverviewModel>
export type DasboardRatioResponseModel = ApiResponseData<DasboardRatioModel[]>
export type DasboardBranchResponseModel = ApiResponseData<DasboardBranchModel[]>

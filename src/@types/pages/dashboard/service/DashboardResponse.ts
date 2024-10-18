import { SOLModel, FieldChangedModel } from '..'

import { BaseResponseModel } from '@/@types/common'

export type GetFieldChangedResponseModel = BaseResponseModel<FieldChangedModel[]>
export type GetSOLsResponseModel = BaseResponseModel<SOLModel[]>

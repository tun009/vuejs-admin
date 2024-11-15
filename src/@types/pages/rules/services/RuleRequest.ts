import { PaginationModel } from '@/@types/common'
import { RuleTypeEnum } from '..'

export interface GetRuleRequestModel extends PaginationModel {
  type?: RuleTypeEnum
  query?: string
  docTypeId?: number
}

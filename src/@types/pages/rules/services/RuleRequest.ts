import { PaginationModel } from '@/@types/common'
import { DocTypeEnum, RuleTypeEnum } from '..'

export interface GetRuleRequestModel extends PaginationModel {
  type?: RuleTypeEnum
  query?: string
  documentType?: DocTypeEnum
}

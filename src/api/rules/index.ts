import { RuleUpdateModel } from '@/@types/pages/rules'
import { GetRuleRequestModel } from '@/@types/pages/rules/services/RuleRequest'
import { GetRuleResponseModel } from '@/@types/pages/rules/services/RuleResponse'
import { request } from '../service'

export function getRules(data: GetRuleRequestModel) {
  return request<GetRuleResponseModel>({
    url: 'dictionaries/list',
    method: 'post',
    data
  })
}
export function updateRule(data: RuleUpdateModel) {
  const { id, ...otherValue } = data
  return request<GetRuleResponseModel>({
    url: `dictionaries/${id}`,
    method: 'put',
    data: otherValue
  })
}

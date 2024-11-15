import { GetSettingResponseModel } from '@/@types/pages/docs/settings/services/SettingResponse'
import { request } from '@/api/service'
import {
  UpdateConfidenceRequestModel,
  UpdateInfoExtractRequestModel
} from '@/@types/pages/docs/settings/services/SettingRequest'

export function getDocDataField(id: number | string) {
  return request<GetSettingResponseModel>({
    url: id != '' ? 'doc-data-fields?' + `docTypeId=${id}` : 'doc-data-fields',
    method: 'get'
  })
}

export function updateInfoExtract(data: UpdateInfoExtractRequestModel) {
  return request({
    url: 'doc-data-fields',
    method: 'put',
    data
  })
}

export function getConfidence() {
  return request<GetSettingResponseModel>({
    url: 'confidence-config',
    method: 'get'
  })
}

export function updateConfidence(data: UpdateConfidenceRequestModel[]) {
  return request({
    url: 'confidence-config',
    method: 'put',
    data
  })
}

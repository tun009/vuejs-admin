import { request } from '@/utils/service'
import type * as Table from './types/table'

/** create */
export function createTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  return request({
    url: 'table',
    method: 'post',
    data
  })
}

/** delete */
export function deleteTableDataApi(id: string) {
  return request({
    url: `table/${id}`,
    method: 'delete'
  })
}

/** update */
export function updateTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  return request({
    url: 'table',
    method: 'put',
    data
  })
}

/** get */
export function getTableDataApi(params: Table.TableRequestData) {
  return request<Table.TableResponseData>({
    url: 'table',
    method: 'get',
    params
  })
}

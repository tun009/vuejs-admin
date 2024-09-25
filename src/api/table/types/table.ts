export interface CreateOrUpdateTableRequestData {
  id?: string
  username: string
  password?: string
}

export interface TableRequestData {
  /** Current page number */
  currentPage: number
  /** Query the number of items */
  size: number
  /** Query parameters: username */
  username?: string
  /** Query parameters: mobile phone number */
  phone?: string
}

export interface TableData {
  createTime: string
  email: string
  id: string
  phone: string
  roles: string
  status: boolean
  username: string
}

export type TableResponseData = ApiResponseData<{
  list: TableData[]
  total: number
}>

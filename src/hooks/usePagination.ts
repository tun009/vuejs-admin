import { reactive } from 'vue'

interface DefaultPaginationData {
  total: number
  currentPage: number
  pageSizes: number[]
  pageSize: number
  layout: string
}

interface PaginationData {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

/** Default paging parameters */
const defaultPaginationData: DefaultPaginationData = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: 'total, sizes, prev, pager, next, jumper'
}

export function usePagination(initialPaginationData: PaginationData = {}) {
  /** Merge paging parameters */
  const paginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })
  /** Change the current page number */
  const handleCurrentChange = (value: number) => {
    paginationData.currentPage = value
  }
  /** Change page size */
  const handleSizeChange = (value: number) => {
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}

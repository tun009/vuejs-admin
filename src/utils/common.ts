export const getDataWithPagination = (array: any[], pageNum: number, pageSize: number) => {
  const start = pageNum * pageSize
  return array.slice(start, start + pageSize)
}

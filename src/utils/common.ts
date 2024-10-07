import { SelectOptionModel } from '@/@types/common'
import { ElMessageBox } from 'element-plus'

export const getDataWithPagination = <T>(array: T[], pageNum: number, pageSize: number): T[] => {
  const start = pageNum * pageSize
  return array.slice(start, start + pageSize)
}

export const handleComingSoon = () => {
  ElMessageBox.confirm('Coming soon...')
}

export const renderLabelByValue = (options: SelectOptionModel[], value: string | number): string => {
  if (!options || !options.length) return ''
  return options.find((i) => i.value === value)?.label ?? ''
}

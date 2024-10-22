import { SelectOptionModel } from '@/@types/common'
import { ElMessageBox } from 'element-plus'
import DOMPurify from 'dompurify'

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

export const truncateFileName = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex === -1) {
    return fileName
  }

  const namePart = fileName.slice(0, dotIndex)
  const extension = fileName.slice(dotIndex)

  if (namePart.length > 20) {
    return namePart.slice(0, 20) + '…' + extension
  }

  return fileName
}

export const scrollIntoViewParent = (id: string) => {
  const element = document.getElementById(id)
  if (!element) return
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function resetNullUndefinedFields(obj: Record<string, any>): void {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      obj[key] = ''
    }
  })
}

export const sanitizeString = (symbolId: string) => {
  return DOMPurify.sanitize(symbolId)
}

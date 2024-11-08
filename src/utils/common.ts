import { SelectOptionModel, StatusColorModel } from '@/@types/common'
import { ElMessageBox } from 'element-plus'
import DOMPurify from 'dompurify'
import { BranchModel } from '@/@types/pages/login'

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

export const renderColorByValue = (options: SelectOptionModel[], value: string | number): StatusColorModel => {
  if (!options || !options.length) return {} as StatusColorModel
  return options.find((i) => i.value === value)?.color ?? ({} as StatusColorModel)
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

export function resetNullUndefinedFields(obj: Record<string, any>, defaultValue: string | number | boolean = ''): void {
  const result: any = { ...obj }
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      result[key] = defaultValue
    }
  })
  return result
}

export const sanitizeString = (symbolId: string) => {
  return DOMPurify.sanitize(symbolId)
}

export const withAllSelection = (options: SelectOptionModel[]): SelectOptionModel[] => {
  return [{ label: 'Tất cả', value: -1 }, ...options]
}

export const omitPropertyFromObject = (
  obj: Record<string, any>,
  filterValue: string | number | boolean
): Record<string, any> => {
  const newObj: Record<string, any> = {}
  for (const key in obj) {
    if (obj[key] !== filterValue) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}
export const groupByField = <T>(data: T[], key: keyof T): Record<string, T[]> => {
  return data.reduce((acc: Record<string, T[]>, item: T) => {
    const groupKey = item[key] as unknown as string
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {})
}
export const mappingBranches = (branches: BranchModel[]): SelectOptionModel[] => {
  return branches.map((b: BranchModel) => ({
    label: b.name,
    value: b.id,
    description: b.code
  }))
}
export const formatNumberConfidence = (num: number) => {
  if (Number.isInteger(num * 100)) {
    return (num * 100).toString()
  } else {
    return Math.round(num * 10 * 100) / 10
  }
}

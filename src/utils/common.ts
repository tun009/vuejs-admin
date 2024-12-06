import { ColumnConfigModel, SelectOptionModel, StatusColorModel } from '@/@types/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import DOMPurify from 'dompurify'
import { BranchModel } from '@/@types/pages/login'
import { BLOB_EXPORT_TYPES, TABLE_COLUMN_WIDTH_DEFAULT } from '@/constants/common'
import { regexContentDispositionFileName } from '@/constants/regex'
import { DocumentExportFileEnum } from '@/@types/pages/docs/documents'
import { UpdateConfidenceRequestModel } from '@/@types/pages/docs/settings/services/SettingRequest'

export const getDataWithPagination = <T>(array: T[], pageNum: number, pageSize: number): T[] => {
  const start = pageNum * pageSize
  return array.slice(start, start + pageSize)
}

export const handleComingSoon = () => {
  ElMessageBox.confirm('Coming soon...')
}

export const renderLabelByValue = (options: SelectOptionModel[] | undefined, value: string | number): string => {
  if (!options || !options.length) return ''
  return options.find((i) => i.value === value)?.label ?? ''
}

export const renderColorByValue = (
  options: SelectOptionModel[] | undefined,
  value: string | number
): StatusColorModel => {
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
    return namePart.slice(0, 20) + '...' + extension
  }

  return fileName
}

export const truncateString = (string: string) => {
  if (string.length > 20) {
    return string.slice(0, 20) + '...'
  }

  return string
}

export const scrollIntoViewParent = (id: string) => {
  const element = document.getElementById(id)
  if (!element) return
  element?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
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

export const withAllSelection = (options?: SelectOptionModel[] | null): SelectOptionModel[] => {
  return [{ label: 'Tất cả', value: -1 }, ...(options ?? [])]
}

export const omitPropertyFromObject = (
  obj: Record<string, any>,
  filterValue?: string | number | boolean | null
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

export const mappingBranches = (branches?: BranchModel[] | null): SelectOptionModel[] => {
  if (!branches) return []
  return branches.map((b: BranchModel) => ({
    label: b.name ?? '',
    value: b.id,
    description: b.code
  }))
}

export const formatNumberConfidence = (num: number) => {
  if (Number.isInteger(num * 100)) {
    return (num * 100).toString()
  } else {
    return (Math.round(num * 10 * 100) / 10).toString()
  }
}

export function sortObjectsByMultipleFields(array: any[], fields: string[], sortOrder = 'asc') {
  if (!Array.isArray(array)) {
    throw new TypeError('Input must be an array.')
  }

  if (!Array.isArray(fields)) {
    throw new TypeError('Fields must be an array of strings.')
  }

  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    throw new Error('Sort order must be either "asc" or "desc".')
  }

  return array.slice().sort((a, b) => {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i]
      const aValue = a[field]
      const bValue = b[field]

      // Determine if the values are strings or numbers
      const isString = typeof aValue === 'string' && typeof bValue === 'string'
      const isNumber = typeof aValue === 'number' && typeof bValue === 'number'

      if (isString) {
        // Remove leading space characters
        const trimmedAValue = aValue.trimLeft()
        const trimmedBValue = bValue.trimLeft()

        const comparison = trimmedAValue.localeCompare(trimmedBValue)

        if (comparison !== 0) {
          return sortOrder === 'asc' ? comparison : -comparison
        }
      } else if (isNumber) {
        const comparison = aValue - bValue

        if (comparison !== 0) {
          return sortOrder === 'asc' ? comparison : -comparison
        }
      } else {
        // Handle other data types as needed (e.g., dates, booleans)
        throw new Error(`Unsupported data type for field "${field}": ${typeof aValue}`)
      }
    }

    return 0
  })
}

export const createColumnConfigs = (object: { [key: string]: string | number }): ColumnConfigModel[] => {
  if (!object) return []
  const keys = Object.keys(object)
  return keys.map((k) => ({
    field: k,
    label: k,
    minWidth: k === 'stt' ? 50 : TABLE_COLUMN_WIDTH_DEFAULT
  }))
}

export const convertFileUrl = (path: string) => {
  return import.meta.env.VITE_BASE_API + '/files?src=' + path
}

export function getFileNameFromContentDisposition(contentDisposition: string = '') {
  const match = contentDisposition.match(regexContentDispositionFileName)

  if (match) {
    const fileNameWithExtension = match[1]
    const fileNameWithoutExtension = fileNameWithExtension?.split('.')?.[0]
    return fileNameWithoutExtension
  }

  return 'file'
}

export const downloadFileCommon = (response: any, type: DocumentExportFileEnum = DocumentExportFileEnum.DOCX) => {
  const blob = new Blob([response?.data as BlobPart], {
    type: BLOB_EXPORT_TYPES?.[type]
  })
  console.log(response?.headers)
  const fileName = getFileNameFromContentDisposition(response?.headers?.['content-disposition'])
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()

  ElMessage({
    message: 'Download file thành công',
    showClose: true,
    type: 'success'
  })
}

// Hàm lấy văn bản từ HTML string và xóa phần tử tạm thời sau khi sử dụng
export function getTextFromHtml(html: string): string {
  const tempElement = document.createElement('div') // Tạo phần tử div tạm thời
  tempElement.innerHTML = html // Chèn HTML vào phần tử này

  const textContent = tempElement.innerText || tempElement.textContent || '' // Lấy văn bản

  // Xóa phần tử div tạm thời
  tempElement.remove()

  return textContent
}

export const withDefaultString = (value: string | null, defaultString: string = '-') => {
  return value ? value : defaultString
}

export const renderColorByConfidence = (conf: number = 0, settings: UpdateConfidenceRequestModel[]): string => {
  conf = parseFloat(conf.toFixed(3))
  let color = '#7a8da5'
  settings.forEach((item) => {
    if (conf >= item.min && conf <= item.max) color = item.color
  })
  return color
}

export const trimObjectValues = (obj: Record<string, any>): Record<string, any> => {
  // Lặp qua tất cả các thuộc tính của đối tượng
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    // Nếu giá trị là string, thực hiện trim
    if (typeof value === 'string') {
      obj[key] = value.trim()
    } else if (typeof value === 'object' && value !== null) {
      // Nếu giá trị là object thì gọi đệ quy để xử lý trường hợp object con
      obj[key] = trimObjectValues(value)
    }
  })
  return obj
}

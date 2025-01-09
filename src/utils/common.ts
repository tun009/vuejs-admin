import { ColumnConfigModel, DocumentStatusEnum, SelectOptionModel, StatusColorModel } from '@/@types/common'
import {
  CompareHistoryActionModel,
  CompareHistoryCustomModel,
  CompareHistoryModel,
  DocumentExportFileEnum,
  DocumentModel,
  mappingLabelCompare
} from '@/@types/pages/docs/documents'
import { UpdateConfidenceRequestModel } from '@/@types/pages/docs/settings/services/SettingRequest'
import { BranchModel } from '@/@types/pages/login'
import { RoleEnum } from '@/@types/pages/users'
import { BLOB_EXPORT_TYPES, SOCKET_PATH, TABLE_COLUMN_WIDTH_DEFAULT } from '@/constants/common'
import { regexContentDispositionFileName } from '@/constants/regex'
import { useUserStore } from '@/store/modules/user'
import DOMPurify from 'dompurify'
import { ElMessage, ElMessageBox } from 'element-plus'

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

/* NOSONAR */
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
    for (const field of fields) {
      const aValue = a[field]
      const bValue = b[field]

      const isString = typeof aValue === 'string' && typeof bValue === 'string'
      const isNumber = typeof aValue === 'number' && typeof bValue === 'number'

      if (isString) {
        const trimmedAValue = aValue.trimStart()
        const trimmedBValue = bValue.trimStart()

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
        throw new Error(`Unsupported data type for field "${field}": ${typeof aValue}`)
      }
    }

    return 0
  })
}

export const createColumnConfigs = (object?: { [key: string]: string | number } | null): ColumnConfigModel[] => {
  if (!object) return []
  const keys = Object.keys(object)
  return keys.map((k) => {
    const _index = mappingLabelCompare.findIndex((m) => m.field?.toLowerCase() === k?.toLowerCase())
    return {
      field: k,
      label: _index === -1 ? k : mappingLabelCompare?.[_index]?.label,
      minWidth: k.toLowerCase() === 'stt' ? 80 : TABLE_COLUMN_WIDTH_DEFAULT,
      ...(k.toLowerCase() === 'stt' ? { width: 80 } : {})
    }
  })
}

export const convertFileUrl = (path: string) => {
  return import.meta.env.VITE_BASE_API + '/files?src=' + path
}

export function getFileNameFromContentDisposition(contentDisposition: string = '') {
  const match = contentDisposition.match(regexContentDispositionFileName)

  if (match) {
    const fileNameWithExtension = match[1]
    return fileNameWithExtension
  }

  return 'file'
}

export const downloadFileCommon = (response: any, type: DocumentExportFileEnum = DocumentExportFileEnum.DOCX) => {
  const blob = new Blob([response?.data as BlobPart], {
    type: BLOB_EXPORT_TYPES?.[type]
  })
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

export const renderColorByConfidence = (conf: number, settings: UpdateConfidenceRequestModel[]): string => {
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

export const formatNumberWithCommas = (num: number | string): string => {
  return Number(num).toLocaleString()
}

export const removeDuplicateItemInArray = <T>(arr: T[], key: keyof T): T[] => {
  const seen = new Set()
  return arr.filter((item) => {
    if (seen.has(item[key])) {
      return false
    } else {
      seen.add(item[key])
      return true
    }
  })
}

export const groupByKey = (arr: any[], field: string) => {
  const grouped: { [key: string]: number[] } = {}

  arr.forEach((item) => {
    if (!grouped?.[item?.[field]]) {
      grouped[item?.[field]] = []
    }
    grouped[item?.[field]].push(item.stt)
  })

  return Object.keys(grouped).map((key) => ({
    key,
    stt: grouped[key]
  }))
}

export const buildUrlSocket = ({
  baseUrl = import.meta.env.VITE_BASE_SOCKET_URL ?? '',
  path = SOCKET_PATH,
  query
}: {
  baseUrl?: string
  path?: string
  query: any
}) => {
  const queries = new URLSearchParams(query)
  const queryString = queries.toString()
  return baseUrl + '/' + path + '?' + queryString
}

export const getDocumentSwitchStatus = (row: DocumentModel) => {
  let status: DocumentStatusEnum | null = null
  const { isAdmin, isChecker, isMaker, userInfo } = useUserStore()

  if (row.status === DocumentStatusEnum.WAIT_CHECK) {
    if (isMaker && row.createdBy?.username === userInfo.username) {
      status = DocumentStatusEnum.CHECKING
    } else if (isAdmin) {
      status = row.createdBy?.role === RoleEnum.MAKER ? DocumentStatusEnum.CHECKING : DocumentStatusEnum.VALIDATING
    } else if (isChecker && row.createdBy?.username === userInfo.username) {
      status = DocumentStatusEnum.VALIDATING
    }
  } else if (row.status === DocumentStatusEnum.WAIT_VALIDATE && (isChecker || isAdmin)) {
    if (
      isAdmin ||
      (isChecker && (userInfo.username === row.createdBy?.username || userInfo?.username === row.approveBy?.username))
    ) {
      status = DocumentStatusEnum.VALIDATING
    }
  } else if (
    row.status === DocumentStatusEnum.ADJUST_REQUESTED &&
    (isAdmin || (isMaker && row.createdBy?.username === userInfo.username))
  ) {
    status = DocumentStatusEnum.CHECKING
  }
  return status
}

export const handleConvertDocumentHistory = (data: CompareHistoryModel): CompareHistoryCustomModel[] => {
  const result: CompareHistoryCustomModel[] = []

  data.forEach((item) => {
    item.forEach((action) => {
      const { day, hour, createdBy, role, type, title, valueBefore, valueAfter } = action

      let dayEntry = result.find((entry) => entry.day === day)
      if (!dayEntry) {
        dayEntry = { day, hours: [] }
        result.push(dayEntry)
      }

      let hourEntry = dayEntry.hours.find((entry) => entry.hour === hour)
      if (!hourEntry) {
        hourEntry = { hour, createdBy, role, type, actions: [] }
        dayEntry.hours.push(hourEntry)
      }

      hourEntry.actions.push({
        title,
        valueBefore: valueBefore ?? null,
        valueAfter: valueAfter ?? null
      } as CompareHistoryActionModel)
    })
  })

  return result
}

export function customSort<T>(array: T[], key: keyof T, order: string[]): T[] {
  const orderMap: { [key: string]: number } = order.reduce(
    (acc, item, index) => {
      acc[item] = index
      return acc
    },
    {} as { [key: string]: number }
  )

  return array.sort((a, b) => {
    const valueA = a[key] as unknown as string
    const valueB = b[key] as unknown as string

    const indexA = orderMap[valueA] !== undefined ? orderMap[valueA] : Infinity
    const indexB = orderMap[valueB] !== undefined ? orderMap[valueB] : Infinity

    return indexA - indexB
  })
}
export const convertDocTypeName = (name: string): string => {
  return name.replace(/^(Trích xuất|Commercial)\s+/i, '').replace(/^[a-záàảãạăâbcd...z]/i, (char) => char.toUpperCase())
}

export const hasDuplicateField = (array: { [key: string]: any }[], fieldName: string): boolean => {
  const valueSet = new Set<any>()

  for (const obj of array) {
    if (obj[fieldName] === undefined) {
      throw new Error(`Field "${fieldName}" not found in object`)
    }

    if (valueSet.has(obj[fieldName])) {
      return true
    }

    valueSet.add(obj[fieldName])
  }

  return false
}

import { formatDDMMYYYY } from '@/constants/date'
import { regexDateYyyyMmDd } from '@/constants/regex'
import dayjs from 'dayjs'

export const getDateRangeByDistance = (distance: number) => {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * distance)
  return [start, end]
}

export const defaultDateRange = () => {
  const today = dayjs()
  const sevenDaysAgo = dayjs().subtract(7, 'day')

  return [sevenDaysAgo.format(formatDDMMYYYY), today.format(formatDDMMYYYY)]
}

export const formatDateExactFormat = (dateString: string, fromFormat: string, toFormat: string) => {
  return dayjs(dateString, fromFormat).format(toFormat)
}

export const formatDate = (date: string, format: string) => {
  return dayjs(date).format(format)
}

export const addOneDayToDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDateOcrLC = (input: string): string => {
  if (input.length !== 6) return '-'
  const day = input.substring(0, 2)
  const month = input.substring(2, 4)
  const year = '20' + input.substring(4, 6)

  return `${day}/${month}/${year}`
}

export const convertOcrToDateFormat = (input: string): string => {
  if (!regexDateYyyyMmDd.test(input)) return '-'
  const [year, month, day] = input.split('-')
  return `${day}/${month}/${year}`
}

import { formatYYYYMMDD } from '@/constants/date'
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

  return [sevenDaysAgo.format(formatYYYYMMDD), today.format(formatYYYYMMDD)]
}

export const formatDate = (date: string, format: string) => {
  return dayjs(date).format(format)
}

import { getDateRangeByDistance } from '@/utils/date'

export const formatYYYYMMDDHHmmss = 'YYYY-MM-DD HH:mm:ss'
export const formatYYYYMMDD = 'YYYY-MM-DD'
export const formatYYYYMMDD_HHMM = 'YYYY/MM/DD HH:MM'

export const TIME_FIRST_DAY = 'T00:00:00Z'
export const TIME_LAST_DAY = 'T23:59:59Z'

export const shortcutsDateRange = [
  {
    text: 'Last 7 days',
    value: () => getDateRangeByDistance(30)
  },
  {
    text: 'Last 30 days',
    value: () => getDateRangeByDistance(60)
  },
  {
    text: 'Last 90 days',
    value: () => getDateRangeByDistance(90)
  }
]

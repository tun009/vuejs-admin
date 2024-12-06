import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import {
  getDateRangeByDistance,
  defaultDateRange,
  formatDateExactFormat,
  formatDate,
  addOneDayToDate
} from '@/utils/date'

describe('date.ts', () => {
  describe('getDateRangeByDistance', () => {
    it('should return a date range for the given distance', () => {
      const distance = 5
      const [start, end] = getDateRangeByDistance(distance)
      expect(start).toBeInstanceOf(Date)
      expect(end).toBeInstanceOf(Date)
      const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) // tính số ngày
      expect(diff).toBe(5)
    })
  })

  describe('defaultDateRange', () => {
    it('should return a range of the last 7 days', () => {
      const [sevenDaysAgo] = defaultDateRange()

      expect(dayjs(sevenDaysAgo).isSame(dayjs().subtract(7, 'day'), 'day')).toBe(false)
    })
  })
  describe('formatDateExactFormat', () => {
    it('should format the date correctly from one format to another', () => {
      const dateString = '2024-12-05'
      const fromFormat = 'YYYY-MM-DD'
      const toFormat = 'DD/MM/YYYY'
      const formattedDate = formatDateExactFormat(dateString, fromFormat, toFormat)
      expect(formattedDate).toBe('05/12/2024')
    })
  })

  describe('formatDate', () => {
    it('should format the date correctly', () => {
      const date = '2024-12-05'
      const format = 'DD/MM/YYYY'
      const formattedDate = formatDate(date, format)
      expect(formattedDate).toBe('05/12/2024')
    })
  })

  describe('addOneDayToDate', () => {
    it('should add one day to the given date', () => {
      const dateStr = '2024-12-05'
      const newDate = addOneDayToDate(dateStr)
      expect(newDate).toBe('2024-12-06')
    })

    it('should handle edge case for month change', () => {
      const dateStr = '2024-12-31'
      const newDate = addOneDayToDate(dateStr)
      expect(newDate).toBe('2025-01-01')
    })

    it('should handle leap year February 28 to March 1', () => {
      const dateStr = '2024-02-28'
      const newDate = addOneDayToDate(dateStr)
      expect(newDate).toBe('2024-02-29')
    })
  })
})

import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import {
  getDateRangeByDistance,
  formatDateExactFormat,
  formatDate,
  addOneDayToDate,
  convertOcrToDateFormat,
  formatDateOcrLC
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
    it('should format a valid date correctly', () => {
      const date = '2024-12-18T12:34:56Z' // ISO 8601 format
      const format = 'YYYY-MM-DD HH:mm:ss'
      const result = formatDate(date, format)
      expect(result).toBe(dayjs(date).format(format))
    })

    it('should handle invalid date formats', () => {
      const date = 'invalid-date' // Invalid date string
      const format = 'YYYY-MM-DD'
      const result = formatDate(date, format)
      expect(result).toBe('Invalid Date')
    })

    it('should return the formatted date with the provided format', () => {
      const date = '2024-12-18T12:34:56Z'
      const format = 'dddd, MMMM D, YYYY'
      const result = formatDate(date, format)
      expect(result).toBe(dayjs(date).format(format))
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

describe('formatDateOcrLC', () => {
  it('should return formatted date for valid 6-character input', () => {
    const result = formatDateOcrLC('180924') // DDMMYY
    expect(result).toBe('18/09/2024')
  })

  it('should return "-" for input not exactly 6 characters', () => {
    expect(formatDateOcrLC('1809')).toBe('-')
    expect(formatDateOcrLC('1809245')).toBe('-')
    expect(formatDateOcrLC('')).toBe('-')
  })

  it('should correctly handle edge cases with different valid inputs', () => {
    expect(formatDateOcrLC('010101')).toBe('01/01/2001')
    expect(formatDateOcrLC('311299')).toBe('31/12/2099')
  })
})

describe('convertOcrToDateFormat', () => {
  it('should return formatted date for valid YYYY-MM-DD input', () => {
    const result = convertOcrToDateFormat('2024-12-18') // YYYY-MM-DD
    expect(result).toBe('18/12/2024')
  })

  it('should return "-" for input not matching YYYY-MM-DD format', () => {
    expect(convertOcrToDateFormat('18/12/2024')).toBe('-')
    expect(convertOcrToDateFormat('2024-12')).toBe('-')
    expect(convertOcrToDateFormat('abcd-ef-gh')).toBe('-')
    expect(convertOcrToDateFormat('2024/12/18')).toBe('-')
  })

  it('should return formatted date correctly for edge cases', () => {
    expect(convertOcrToDateFormat('1999-01-01')).toBe('01/01/1999')
    expect(convertOcrToDateFormat('2000-12-31')).toBe('31/12/2000')
  })
})

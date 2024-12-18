import { formatDateTime, removeAccents, removeAccentsAndReplaceSpaces } from '@/utils'
import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'

// Mock global functions
vi.mock('@/utils/cache/local-storage', () => ({
  removeConfigLayout: vi.fn()
}))

describe('Utility Functions Tests', () => {
  describe('formatDateTime', () => {
    it('should format date correctly', () => {
      const time = '2023-12-18T10:00:00'
      const result = formatDateTime(time)
      const expected = dayjs(new Date(time)).format('YYYY-MM-DD HH:mm:ss') // Assuming 'YYYY-MM-DD HH:mm:ss' format
      expect(result).toBe(expected)
    })
  })

  describe('removeAccents', () => {
    it('should remove accents from string correctly', () => {
      const input = 'áéíóú'
      const result = removeAccents(input)
      expect(result).toBe('aeiou')
    })

    it('should replace certain characters with specific replacements', () => {
      const input = 'đấủ'
      const result = removeAccents(input)
      expect(result).toBe('dau')
    })

    it('should return the input if no accents are present', () => {
      const input = 'normal'
      const result = removeAccents(input)
      expect(result).toBe('normal')
    })
  })

  describe('removeAccentsAndReplaceSpaces', () => {
    it('should remove accents and replace spaces with underscores', () => {
      const input = 'Từ có dấu và có khoảng cách'
      const result = removeAccentsAndReplaceSpaces(input)
      expect(result).toBe('tu_co_dau_va_co_khoang_cach')
    })

    it('should handle input without spaces correctly', () => {
      const input = 'tudau'
      const result = removeAccentsAndReplaceSpaces(input)
      expect(result).toBe('tudau')
    })

    it('should handle input without accents correctly', () => {
      const input = 'normal text'
      const result = removeAccentsAndReplaceSpaces(input)
      expect(result).toBe('normal_text')
    })
  })
})

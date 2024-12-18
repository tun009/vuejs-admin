import {
  formatDateTime,
  getCssVariableValue,
  removeAccents,
  removeAccentsAndReplaceSpaces,
  setCssVariableValue
} from '@/utils'
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

  describe('getCssVariableValue', () => {
    it('should return a valid CSS variable value', () => {
      const cssVariableName = '--primary-color'
      // Mock `getComputedStyle`
      vi.stubGlobal('getComputedStyle', () => ({
        getPropertyValue: vi.fn().mockReturnValue('rgb(255, 0, 0)')
      }))

      const result = getCssVariableValue(cssVariableName)
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('should return an empty string if no CSS variable is found or if there is an error', () => {
      vi.stubGlobal('getComputedStyle', () => {
        throw new Error('Test error')
      })

      const result = getCssVariableValue('--non-existing-variable')
      expect(result).toBe('')
    })
  })

  describe('setCssVariableValue', () => {
    it('should set a CSS variable', () => {
      const cssVariableName = '--primary-color'
      const cssVariableValue = 'rgb(0, 255, 0)'

      // Mock `setProperty`
      vi.stubGlobal('document', {
        documentElement: {
          style: {
            setProperty: vi.fn()
          }
        }
      })

      setCssVariableValue(cssVariableName, cssVariableValue)

      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(cssVariableName, cssVariableValue)
    })

    it('should catch errors when setting CSS variable fails', () => {
      vi.stubGlobal('document', {
        documentElement: {
          style: {
            setProperty: vi.fn().mockImplementation(() => {
              throw new Error('Test error')
            })
          }
        }
      })

      // Ensure no error is thrown
      setCssVariableValue('--primary-color', 'rgb(0, 255, 0)')
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

import { ExtractHistoryTypeEnum, extractHistoryTypes } from '@/@types/pages/extract'
import { STATUS_COLORS } from '@/constants/color'
import { describe, it, expect } from 'vitest'

describe('ExtractHistoryTypeEnum', () => {
  it('should have the correct values for each type', () => {
    expect(ExtractHistoryTypeEnum.EDIT).toBe('EDIT')
    expect(ExtractHistoryTypeEnum.COMPARISON).toBe('COMPARISON')
    expect(ExtractHistoryTypeEnum.DENIED).toBe('DENIED')
    expect(ExtractHistoryTypeEnum.REPLACE).toBe('REPLACE')
    expect(ExtractHistoryTypeEnum.OCR).toBe('OCR')
  })
})

describe('extractHistoryTypes', () => {
  it('should contain the correct options', () => {
    // Validate each option in the extractHistoryTypes array
    expect(extractHistoryTypes).toHaveLength(5)

    // Check individual elements in the array
    expect(extractHistoryTypes[0]).toEqual({
      label: 'Chỉnh sửa',
      value: ExtractHistoryTypeEnum.EDIT,
      color: STATUS_COLORS.VALIDATED
    })

    expect(extractHistoryTypes[1]).toEqual({
      label: 'Thực hiện đối sánh lại bộ chứng từ',
      value: ExtractHistoryTypeEnum.COMPARISON,
      color: STATUS_COLORS.VALIDATED
    })

    expect(extractHistoryTypes[2]).toEqual({
      label: 'Từ chối bộ chứng từ',
      value: ExtractHistoryTypeEnum.DENIED,
      color: STATUS_COLORS.ERROR
    })

    expect(extractHistoryTypes[3]).toEqual({
      label: 'Thay thế chứng từ bởi file ',
      value: ExtractHistoryTypeEnum.REPLACE,
      color: STATUS_COLORS.VALIDATED
    })

    expect(extractHistoryTypes[4]).toEqual({
      label: 'Thực hiện trích xuất OCR chứng từ',
      value: ExtractHistoryTypeEnum.OCR,
      color: STATUS_COLORS.VALIDATED
    })
  })

  it('should have correct color mapping', () => {
    // Check if color values match the correct values from STATUS_COLORS
    expect(extractHistoryTypes[0].color).toBe(STATUS_COLORS.VALIDATED)
    expect(extractHistoryTypes[1].color).toBe(STATUS_COLORS.VALIDATED)
    expect(extractHistoryTypes[2].color).toBe(STATUS_COLORS.ERROR)
    expect(extractHistoryTypes[3].color).toBe(STATUS_COLORS.VALIDATED)
    expect(extractHistoryTypes[4].color).toBe(STATUS_COLORS.VALIDATED)
  })

  it('should contain correct enum values for each type', () => {
    // Validate the value fields are correct enum values
    expect(extractHistoryTypes[0].value).toBe(ExtractHistoryTypeEnum.EDIT)
    expect(extractHistoryTypes[1].value).toBe(ExtractHistoryTypeEnum.COMPARISON)
    expect(extractHistoryTypes[2].value).toBe(ExtractHistoryTypeEnum.DENIED)
    expect(extractHistoryTypes[3].value).toBe(ExtractHistoryTypeEnum.REPLACE)
    expect(extractHistoryTypes[4].value).toBe(ExtractHistoryTypeEnum.OCR)
  })
})

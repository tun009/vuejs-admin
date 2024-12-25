import { DocumentStatusEnum } from '@/@types/common'
import {
  BusinessTypeEnum,
  businessTypeOptions,
  docListColumnConfigs,
  reportStatusOptions
} from '@/@types/pages/reports'
import { STATUS_COLORS } from '@/constants/color'
import { describe, it, expect } from 'vitest'

describe('BusinessTypeEnum', () => {
  it('should have correct values for each key', () => {
    expect(BusinessTypeEnum.NA).toBe('NA')
    expect(BusinessTypeEnum.LC_IN).toBe('LC_IN')
    expect(BusinessTypeEnum.LC_OUT).toBe('LC_OUT')
  })

  it('should have correct keys and values', () => {
    const enumValues = Object.values(BusinessTypeEnum)
    const expectedValues = ['NA', 'LC_IN', 'LC_OUT']

    expect(enumValues).toEqual(expectedValues)
  })

  it('should ensure all values are strings', () => {
    const enumValues = Object.values(BusinessTypeEnum)
    enumValues.forEach((value) => {
      expect(typeof value).toBe('string')
    })
  })
})

describe('docListColumnConfigs', () => {
  it('should have the correct structure for each item', () => {
    const item = docListColumnConfigs[0]
    expect(item).toHaveProperty('field')
    expect(item).toHaveProperty('label')
    expect(item).toHaveProperty('width')
    expect(typeof item.field).toBe('string')
    expect(typeof item.label).toBe('string')
    expect(typeof item.width).toBe('number')
  })

  it('should contain the correct fields', () => {
    const expectedFields = [
      'stt',
      'name',
      'bizType',
      'status',
      'result',
      'comparisonTimes',
      'branch',
      'totalTimeProcessHandle',
      'timeSystemHandle',
      'timeMakerHandle',
      'timeCheckerHandle'
    ]

    const fields = docListColumnConfigs.map((item) => item.field)

    expectedFields.forEach((field) => {
      expect(fields).toContain(field)
    })
  })
})

describe('reportStatusOptions', () => {
  it('should have the correct number of items', () => {
    expect(reportStatusOptions).toHaveLength(14) // Verify that the array has 14 elements
  })

  it('should have correct structure for each item', () => {
    reportStatusOptions.forEach((item) => {
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('value')
      expect(item).toHaveProperty('color')
      expect(typeof item.label).toBe('string')
      expect(item.value).toBeDefined() // value should exist and be valid enum
      expect(typeof item.color).toBe('object') // color should be a string
    })
  })

  it('should have valid value corresponding to DocumentStatusEnum', () => {
    const validValues = Object.values(DocumentStatusEnum)

    reportStatusOptions.forEach((item) => {
      expect(validValues).toContain(item.value) // Ensure value is valid enum value
    })
  })

  it('should have valid colors corresponding to STATUS_COLORS', () => {
    const validColors = Object.values(STATUS_COLORS)

    reportStatusOptions.forEach((item) => {
      expect(validColors).toContain(item.color) // Ensure color is valid color value
    })
  })

  it('should correctly map labels to values', () => {
    const labelValueMapping: any = {
      Mới: DocumentStatusEnum.NEW,
      'Đang phân loại': DocumentStatusEnum.CLASSIFYING,
      'Đã phân loại': DocumentStatusEnum.CLASSIFIED,
      'Đang xử lý OCR': DocumentStatusEnum.OCRING,
      'Đã trích xuất': DocumentStatusEnum.OCRED,
      'Chờ kiểm tra': DocumentStatusEnum.WAIT_CHECK,
      'Đang kiểm tra': DocumentStatusEnum.CHECKING,
      'Đã kiểm tra': DocumentStatusEnum.CHECKED,
      'Chờ phê duyệt': DocumentStatusEnum.WAIT_VALIDATE,
      'Đang phê duyệt': DocumentStatusEnum.VALIDATING,
      'YC điều chỉnh': DocumentStatusEnum.ADJUST_REQUESTED,
      'Đã phê duyệt': DocumentStatusEnum.VALIDATED,
      'Từ chối': DocumentStatusEnum.DENIED,
      Lỗi: DocumentStatusEnum.ERROR
    }

    reportStatusOptions.forEach((item) => {
      expect(labelValueMapping[item.label]).toBe(item.value) // Ensure label matches its value
    })
  })
})

describe('businessTypeOptions', () => {
  it('should have the correct number of items', () => {
    expect(businessTypeOptions).toHaveLength(3) // Verify that the array has 3 elements
  })

  it('should have the correct structure for each item', () => {
    businessTypeOptions.forEach((item) => {
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('value')
      expect(typeof item.label).toBe('string')
      expect(item.value).toBeDefined() // value should exist and be valid enum
    })
  })

  it('should have valid value corresponding to BusinessTypeEnum', () => {
    const validValues = Object.values(BusinessTypeEnum)

    businessTypeOptions.forEach((item) => {
      expect([...validValues, -1]).toContain(item.value) // Ensure value is valid enum value
    })
  })

  it('should correctly map labels to values', () => {
    const labelValueMapping: any = {
      'Tất cả': -1,
      'LC Xuất': BusinessTypeEnum.LC_OUT,
      'LC Nhập': BusinessTypeEnum.LC_IN
    }

    businessTypeOptions.forEach((item) => {
      expect(labelValueMapping[item.label]).toBe(item.value) // Ensure label matches its value
    })
  })
})

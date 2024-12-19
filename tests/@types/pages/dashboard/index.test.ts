import { fieldChangedListColumnConfigs, SOLListColumnConfigs } from '@/@types/pages/dashboard'
import { describe, it, expect } from 'vitest'

describe('fieldChangedListColumnConfigs', () => {
  it('should contain objects with correct field, label, and width properties', () => {
    fieldChangedListColumnConfigs.forEach((config) => {
      expect(config).toHaveProperty('field')
      expect(config).toHaveProperty('label')
      if (Object.prototype.hasOwnProperty.call(config, 'width')) {
        expect(typeof config.width).toBe('number')
      }
    })
  })

  it('should have correct field values', () => {
    expect(fieldChangedListColumnConfigs[0].field).toBe('key')
    expect(fieldChangedListColumnConfigs[1].field).toBe('editRatio')
  })

  it('should have correct label values', () => {
    expect(fieldChangedListColumnConfigs[0].label).toBe('Tên trường')
    expect(fieldChangedListColumnConfigs[1].label).toBe('Tỉ lệ chỉnh sửa (%)')
  })

  it('should have width property for the second item', () => {
    expect(fieldChangedListColumnConfigs[1]).toHaveProperty('width', 200)
  })
})

describe('SOLListColumnConfigs', () => {
  it('should contain objects with correct field, label, width, and class properties', () => {
    SOLListColumnConfigs.forEach((config) => {
      expect(config).toHaveProperty('field')
      expect(config).toHaveProperty('label')
      if (Object.prototype.hasOwnProperty.call(config, 'width')) {
        expect(typeof config.width).toBe('number')
      }
      if (Object.prototype.hasOwnProperty.call(config, 'class')) {
        expect(typeof config.class).toBe('string')
      }
    })
  })

  it('should have correct field values', () => {
    expect(SOLListColumnConfigs[0].field).toBe('stt')
    expect(SOLListColumnConfigs[1].field).toBe('code')
    expect(SOLListColumnConfigs[2].field).toBe('name')
    expect(SOLListColumnConfigs[3].field).toBe('totalDossierHandle')
  })

  it('should have correct label values', () => {
    expect(SOLListColumnConfigs[0].label).toBe('#')
    expect(SOLListColumnConfigs[1].label).toBe('Mã SOL')
    expect(SOLListColumnConfigs[2].label).toBe('Tên ĐVKD')
    expect(SOLListColumnConfigs[3].label).toBe('Số lượng BCT đã xử lý')
  })

  it('should have width properties where applicable', () => {
    expect(SOLListColumnConfigs[0]).toHaveProperty('width', 70)
    expect(SOLListColumnConfigs[1]).toHaveProperty('width', 120)
    expect(SOLListColumnConfigs[3]).toHaveProperty('width', 200)
  })

  it('should have class property for the first item', () => {
    expect(SOLListColumnConfigs[0]).toHaveProperty('class', '!text-center')
  })
})

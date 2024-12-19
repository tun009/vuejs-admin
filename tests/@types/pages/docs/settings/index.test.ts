import { AutoCheckConfigEnum, infoListColumnConfigs } from '@/@types/pages/docs/settings'
import { describe, it, expect } from 'vitest'

describe('AutoCheckConfigEnum', () => {
  it('should have correct values for MANUAL, THRESHOLD, and AUTO', () => {
    expect(AutoCheckConfigEnum.MANUAL).toBe('MANUAL')
    expect(AutoCheckConfigEnum.THRESHOLD).toBe('THRESHOLD')
    expect(AutoCheckConfigEnum.AUTO).toBe('AUTO')
  })
})

describe('infoListColumnConfigs', () => {
  it('should contain objects with correct field, label, and width properties', () => {
    infoListColumnConfigs.forEach((config) => {
      expect(config).toHaveProperty('field')
      expect(config).toHaveProperty('label')
      if (Object.prototype.hasOwnProperty.call(config, 'width')) {
        expect(typeof config.width).toBe('number')
      }
    })
  })

  it('should have correct field values', () => {
    expect(infoListColumnConfigs[0].field).toBe('stt')
    expect(infoListColumnConfigs[1].field).toBe('name')
    expect(infoListColumnConfigs[2].field).toBe('key')
    expect(infoListColumnConfigs[3].field).toBe('type')
    expect(infoListColumnConfigs[4].field).toBe('description')
    expect(infoListColumnConfigs[5].field).toBe('actions')
  })

  it('should have correct label values', () => {
    expect(infoListColumnConfigs[0].label).toBe('STT')
    expect(infoListColumnConfigs[1].label).toBe('Tên trường trích xuất')
    expect(infoListColumnConfigs[2].label).toBe('Core_key')
    expect(infoListColumnConfigs[3].label).toBe('Loại dữ liệu')
    expect(infoListColumnConfigs[4].label).toBe('Mô tả')
    expect(infoListColumnConfigs[5].label).toBe('Hành động')
  })

  it('should have width property for the first item', () => {
    expect(infoListColumnConfigs[0]).toHaveProperty('width', 80)
  })

  it('should not have width property for other items', () => {
    expect(infoListColumnConfigs[1]).not.toHaveProperty('width')
    expect(infoListColumnConfigs[2]).not.toHaveProperty('width')
    expect(infoListColumnConfigs[3]).not.toHaveProperty('width')
    expect(infoListColumnConfigs[4]).not.toHaveProperty('width')
    expect(infoListColumnConfigs[5]).not.toHaveProperty('width')
  })
})

import { CONFIDENCES, CONFIDENCE_COLOR_FORM_DEFAULT } from '@/constants/setting'
import { describe, it, expect } from 'vitest'

describe('Constants Tests', () => {
  describe('CONFIDENCES', () => {
    it('should have correct values for toConfidence1', () => {
      expect(CONFIDENCES.toConfidence1).toBe(24.9)
    })

    it('should have correct values for toConfidence2', () => {
      expect(CONFIDENCES.toConfidence2).toBe(49.9)
    })

    it('should have correct values for toConfidence3', () => {
      expect(CONFIDENCES.toConfidence3).toBe(74.9)
    })

    it('should have correct values for toConfidence4', () => {
      expect(CONFIDENCES.toConfidence4).toBe(100)
    })
  })

  describe('CONFIDENCE_COLOR_FORM_DEFAULT', () => {
    it('should have correct color1 value', () => {
      expect(CONFIDENCE_COLOR_FORM_DEFAULT.color1).toBe('#EF0606')
    })

    it('should have correct color2 value', () => {
      expect(CONFIDENCE_COLOR_FORM_DEFAULT.color2).toBe('#EF0606')
    })

    it('should have correct color3 value', () => {
      expect(CONFIDENCE_COLOR_FORM_DEFAULT.color3).toBe('#EF0606')
    })

    it('should have correct color4 value', () => {
      expect(CONFIDENCE_COLOR_FORM_DEFAULT.color4).toBe('#01B516')
    })
  })
})

import { describe, expect, it } from 'vitest'
import {
  isArray,
  isString,
  isUrl,
  isUrlPort,
  isDomain,
  isVersion,
  is24H,
  isPhoneNumber,
  isChineseIdCard,
  isEmail,
  isMAC
} from '@/utils/validate'

describe('isArray', () => {
  it('String', () => {
    expect(isArray('')).toBe(false)
  })
  it('Number', () => {
    expect(isArray(1)).toBe(false)
  })
  it('Boolean', () => {
    expect(isArray(true)).toBe(false)
  })
  it('Null', () => {
    expect(isArray(null)).toBe(false)
  })
  it('Undefined', () => {
    expect(isArray(undefined)).toBe(false)
  })
  it('Symbol', () => {
    expect(isArray(Symbol())).toBe(false)
  })
  it('BigInt', () => {
    expect(isArray(BigInt(1))).toBe(false)
  })
  it('Object', () => {
    expect(isArray({})).toBe(false)
  })
  it('Array Object', () => {
    expect(isArray([])).toBe(true)
  })
})

describe('isString', () => {
  it('should return true for string primitive', () => {
    expect(isString('hello')).toBe(true)
  })

  it('should return true for String object', () => {
    expect(isString(new String('hello'))).toBe(true)
  })

  it('should return false for number', () => {
    expect(isString(123)).toBe(false)
  })

  it('should return false for boolean', () => {
    expect(isString(true)).toBe(false)
  })

  it('should return false for null', () => {
    expect(isString(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isString(undefined)).toBe(false)
  })

  it('should return false for object', () => {
    expect(isString({})).toBe(false)
  })

  it('should return false for array', () => {
    expect(isString(['a', 'b', 'c'])).toBe(false)
  })
})
describe('isUrl', () => {
  it('should return true for valid URL', () => {
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('http://example.com')).toBe(true)
  })

  it('should return false for invalid URL', () => {
    expect(isUrl('invalid-url')).toBe(false)
  })
})

describe('isUrlPort', () => {
  it('should return true for valid URL with port', () => {
    expect(isUrlPort('https://example.com:8080')).toBe(true)
    expect(isUrlPort('http://example.com:3000')).toBe(true)
  })

  it('should return false for invalid URL with port', () => {
    expect(isUrlPort('https://example.com')).toBe(false)
    expect(isUrlPort('invalid-url')).toBe(false)
  })
})

describe('isDomain', () => {
  it('should return true for valid domain name', () => {
    expect(isDomain('example.com')).toBe(true)
  })

  it('should return false for invalid domain name', () => {
    expect(isDomain('invalid-domain')).toBe(false)
  })
})

describe('isVersion', () => {
  it('should return true for valid version format X.Y.Z', () => {
    expect(isVersion('1.2.3')).toBe(true)
    expect(isVersion('10.20.30')).toBe(true)
  })

  it('should return false for invalid version format', () => {
    expect(isVersion('1.2')).toBe(false)
    expect(isVersion('1.2.3.4')).toBe(false)
  })
})

describe('is24H', () => {
  it('should return true for valid 24-hour time format', () => {
    expect(is24H('14:30:00')).toBe(true)
    expect(is24H('00:00:00')).toBe(true)
  })

  it('should return false for invalid 24-hour time format', () => {
    expect(is24H('25:00:00')).toBe(false)
    expect(is24H('12:60:00')).toBe(false)
  })
})

describe('isPhoneNumber', () => {
  it('should return true for valid phone number', () => {
    expect(isPhoneNumber('0381234567')).toBe(true)
  })

  it('should return false for invalid phone number', () => {
    expect(isPhoneNumber('123')).toBe(false)
    expect(isPhoneNumber('invalid-phone')).toBe(false)
  })
})

describe('isChineseIdCard', () => {
  it('should return true for valid Chinese ID card number', () => {
    expect(isChineseIdCard('110101199003077512')).toBe(true)
  })

  it('should return false for invalid Chinese ID card number', () => {
    expect(isChineseIdCard('123456789')).toBe(false)
  })
})

describe('isEmail', () => {
  it('should return true for valid email', () => {
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('test@domain.cn')).toBe(true)
  })

  it('should return false for invalid email', () => {
    expect(isEmail('invalid-email')).toBe(false)
  })
})

describe('isMAC', () => {
  it('should return true for valid MAC address', () => {
    expect(isMAC('00:14:22:01:23:45')).toBe(true)
  })

  it('should return false for invalid MAC address', () => {
    expect(isMAC('invalid-mac')).toBe(false)
  })
})

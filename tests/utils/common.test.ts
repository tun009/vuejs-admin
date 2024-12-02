import { SelectOptionModel } from '@/@types/common'
import {
  formatNumberConfidence,
  getDataWithPagination,
  groupByField,
  handleComingSoon,
  mappingBranches,
  omitPropertyFromObject,
  renderColorByValue,
  renderLabelByValue,
  resetNullUndefinedFields,
  scrollIntoViewParent,
  sortObjectsByMultipleFields,
  truncateFileName,
  withAllSelection
} from '@/utils/common'
import { ElMessageBox } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'

// getDataWithPagination
describe('getDataWithPagination', () => {
  it('should return a paginated array based on pageNum and pageSize', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(getDataWithPagination(data, 1, 3)).toEqual([4, 5, 6])
  })

  it('should return an empty array when pageNum is too large', () => {
    const data = [1, 2, 3]
    expect(getDataWithPagination(data, 5, 2)).toEqual([])
  })

  it('should handle an empty array', () => {
    expect(getDataWithPagination([], 1, 2)).toEqual([])
  })

  it('should return all items if pageNum is 0 and pageSize is greater than array length', () => {
    const data = [1, 2, 3]
    expect(getDataWithPagination(data, 0, 10)).toEqual([1, 2, 3])
  })

  it('should return only one item if pageSize is 1', () => {
    const data = [1, 2, 3]
    expect(getDataWithPagination(data, 1, 1)).toEqual([2])
  })
})

// handleComingSoon
vi.mock('element-plus', () => ({
  ElMessageBox: {
    confirm: vi.fn()
  }
}))

describe('handleComingSoon', () => {
  it('should show a coming soon message box', () => {
    handleComingSoon()
    expect(ElMessageBox.confirm).toHaveBeenCalledWith('Coming soon...')
  })
})

// renderLabelByValue
describe('renderLabelByValue', () => {
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 }
  ]

  it('should return the correct label for the given value', () => {
    expect(renderLabelByValue(options, 1)).toBe('Option 1')
  })

  it('should return an empty string when value is not in the options', () => {
    expect(renderLabelByValue(options, 3)).toBe('')
  })

  it('should return an empty string if options is an empty array', () => {
    expect(renderLabelByValue([], 1)).toBe('')
  })

  it('should handle undefined options gracefully', () => {
    expect(renderLabelByValue(undefined, 1)).toBe('')
  })

  it('should return the correct label for string values', () => {
    const optionsString = [
      { label: 'Apple', value: 'A' },
      { label: 'Banana', value: 'B' }
    ]
    expect(renderLabelByValue(optionsString, 'A')).toBe('Apple')
  })
})

// renderColorByValue
describe('renderColorByValue', () => {
  const options = [
    { label: 'Option 1', value: 1, color: { text: 'red', backgound: 'red' } },
    { label: 'Option 2', value: 2, color: { text: 'blue', backgound: 'blue' } }
  ]

  it('should return the color for the given value', () => {
    expect(renderColorByValue(options, 1)).toStrictEqual({ text: 'red', backgound: 'red' })
  })

  it('should return an empty object if value is not found', () => {
    expect(renderColorByValue(options, 3)).toEqual({})
  })

  it('should handle undefined options gracefully', () => {
    expect(renderColorByValue(undefined, 1)).toEqual({})
  })

  it('should return an empty object if options is an empty array', () => {
    expect(renderColorByValue([], 1)).toEqual({})
  })

  it('should handle string values', () => {
    const optionsString = [
      { label: 'Red Option', value: 'red', color: { text: 'red', backgound: 'red' } },
      { label: 'Blue Option', value: 'blue', color: { text: 'blue', backgound: 'blue' } }
    ]
    expect(renderColorByValue(optionsString, 'blue')).toStrictEqual({ text: 'blue', backgound: 'blue' })
  })
})

// truncateFileName
describe('truncateFileName', () => {
  it('should truncate file name if length exceeds 20 characters', () => {
    const longFileName = 'verylongfilenamethatexceeds20characters.txt'
    expect(truncateFileName(longFileName)).toBe('verylongfilenamethat....txt')
  })

  it('should not truncate file name if length is less than or equal to 20 characters', () => {
    const shortFileName = 'shortname.txt'
    expect(truncateFileName(shortFileName)).toBe('shortname.txt')
  })

  it('should return the original file name if there is no extension', () => {
    const noExtensionFileName = 'filenamewithoutextension'
    expect(truncateFileName(noExtensionFileName)).toBe('filenamewithoutextension')
  })

  it('should truncate file name and preserve the extension', () => {
    const fileName = 'reallylongfilenamefortestingextension.js'
    expect(truncateFileName(fileName)).toBe('reallylongfilenamefo....js')
  })

  it('should handle file names that are exactly 20 characters long', () => {
    const exactFileName = 'twentycharacters.txt'
    expect(truncateFileName(exactFileName)).toBe('twentycharacters.txt')
  })
})

//scrollIntoViewParent
describe('scrollIntoViewParent', () => {
  it('should call scrollIntoView if element exists', () => {
    const mockScrollIntoView = vi.fn()
    document.getElementById = vi.fn().mockReturnValue({ scrollIntoView: mockScrollIntoView })

    scrollIntoViewParent('existingElement')
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('should not call scrollIntoView if element does not exist', () => {
    document.getElementById = vi.fn().mockReturnValue(null)

    scrollIntoViewParent('nonExistentElement')
    expect(document.getElementById).toHaveBeenCalledWith('nonExistentElement')
  })

  it('should handle when document.getElementById is undefined', () => {
    const mockScrollIntoView = vi.fn()
    document.getElementById = vi.fn().mockReturnValue(undefined)

    scrollIntoViewParent('someElement')
    expect(mockScrollIntoView).not.toHaveBeenCalled()
  })

  it('should not throw an error if element is not found', () => {
    document.getElementById = vi.fn().mockReturnValue(null)

    expect(() => scrollIntoViewParent('nonExistentElement')).not.toThrow()
  })

  it('should do nothing if no element found and console does not throw', () => {
    document.getElementById = vi.fn().mockReturnValue(null)

    expect(() => scrollIntoViewParent('nonExistentElement')).not.toThrow()
  })

  it('should handle edge case of passing empty string as id', () => {
    document.getElementById = vi.fn().mockReturnValue(null)

    scrollIntoViewParent('')
    expect(document.getElementById).toHaveBeenCalledWith('')
  })

  it('should handle invalid id format without breaking', () => {
    document.getElementById = vi.fn().mockReturnValue(null)

    scrollIntoViewParent('!!@#invalidId')
    expect(document.getElementById).toHaveBeenCalledWith('!!@#invalidId')
  })

  it('should handle valid element and different scroll options', () => {
    const mockScrollIntoView = vi.fn()
    document.getElementById = vi.fn().mockReturnValue({ scrollIntoView: mockScrollIntoView })

    scrollIntoViewParent('validElement')
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('should handle multiple calls correctly', () => {
    const mockScrollIntoView = vi.fn()
    document.getElementById = vi.fn().mockReturnValue({ scrollIntoView: mockScrollIntoView })

    scrollIntoViewParent('firstElement')
    scrollIntoViewParent('secondElement')
    expect(mockScrollIntoView).toHaveBeenCalledTimes(2)
  })
})

// resetNullUndefinedFields
describe('resetNullUndefinedFields', () => {
  it('should replace null with default value', () => {
    const obj = { a: null, b: 2 }
    const result = resetNullUndefinedFields(obj, 'default')
    expect(result).toEqual({ a: 'default', b: 2 })
  })

  it('should replace undefined with default value', () => {
    const obj = { a: undefined, b: 3 }
    const result = resetNullUndefinedFields(obj, 'default')
    expect(result).toEqual({ a: 'default', b: 3 })
  })

  it('should not change properties that are already defined', () => {
    const obj = { a: 'value', b: 2 }
    const result = resetNullUndefinedFields(obj, 'default')
    expect(result).toEqual({ a: 'value', b: 2 })
  })

  it('should handle empty objects', () => {
    const obj = {}
    const result = resetNullUndefinedFields(obj, 'default')
    expect(result).toEqual({})
  })

  it('should use default value as empty string if not provided', () => {
    const obj = { a: null, b: undefined }
    const result = resetNullUndefinedFields(obj)
    expect(result).toEqual({ a: '', b: '' })
  })

  it('should replace null and undefined with boolean false', () => {
    const obj = { a: null, b: undefined }
    const result = resetNullUndefinedFields(obj, false)
    expect(result).toEqual({ a: false, b: false })
  })

  it('should replace null and undefined with number 0', () => {
    const obj = { a: null, b: undefined }
    const result = resetNullUndefinedFields(obj, 0)
    expect(result).toEqual({ a: 0, b: 0 })
  })

  it('should handle nested objects and reset null/undefined properties', () => {
    const obj = { a: { b: null, c: undefined }, d: null }
    const result = resetNullUndefinedFields(obj, 'default')
    expect(result).toEqual({ a: { b: null, c: undefined }, d: 'default' })
  })

  it('should not modify properties with empty strings', () => {
    const obj = { a: '', b: 2 }
    const result = resetNullUndefinedFields(obj, 'default')
    expect(result).toEqual({ a: '', b: 2 })
  })

  it('should handle large objects efficiently', () => {
    const obj = { a: null, b: undefined, c: 2, d: 'test' }
    const result = resetNullUndefinedFields(obj, 'default')
    expect(result).toEqual({ a: 'default', b: 'default', c: 2, d: 'test' })
  })
})

// withAllSelection
describe('withAllSelection', () => {
  it('should add "Tất cả" option to the beginning of the list', () => {
    const options = [{ label: 'Option 1', value: 1 }]
    const result = withAllSelection(options)
    expect(result).toEqual([
      { label: 'Tất cả', value: -1 },
      { label: 'Option 1', value: 1 }
    ])
  })

  it('should handle empty options list', () => {
    const options: SelectOptionModel[] = []
    const result = withAllSelection(options)
    expect(result).toEqual([{ label: 'Tất cả', value: -1 }])
  })

  it('should work with multiple options', () => {
    const options = [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 }
    ]
    const result = withAllSelection(options)
    expect(result).toEqual([
      { label: 'Tất cả', value: -1 },
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 }
    ])
  })

  it('should handle non-numeric values in options', () => {
    const options = [{ label: 'Apple', value: 'A' }]
    const result = withAllSelection(options)
    expect(result).toEqual([
      { label: 'Tất cả', value: -1 },
      { label: 'Apple', value: 'A' }
    ])
  })

  it('should return default value when options are undefined', () => {
    const result = withAllSelection(undefined)
    expect(result).toEqual([{ label: 'Tất cả', value: -1 }])
  })

  it('should handle null options list', () => {
    const result = withAllSelection(null)
    expect(result).toEqual([{ label: 'Tất cả', value: -1 }])
  })

  it('should not add "Tất cả" if options already have a -1 value', () => {
    const options = [{ label: 'Tất cả', value: -1 }]
    const result = withAllSelection(options)
    expect(result).toStrictEqual([
      { label: 'Tất cả', value: -1 },
      { label: 'Tất cả', value: -1 }
    ])
  })

  it('should work with a large list of options', () => {
    const options = Array(1000)
      .fill(null)
      .map((_, index) => ({ label: `Option ${index + 1}`, value: index + 1 }))
    const result = withAllSelection(options)
    expect(result.length).toBe(1001) // Including "Tất cả"
  })

  it('should handle mixed types of values', () => {
    const options = [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 'A' },
      { label: 'Option 3', value: true }
    ]
    const result = withAllSelection(options)
    expect(result).toEqual([
      { label: 'Tất cả', value: -1 },
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 'A' },
      { label: 'Option 3', value: true }
    ])
  })

  it('should handle deeply nested options correctly', () => {
    const options = [{ label: 'Option 1', value: { nested: 'value' } }]
    const result = withAllSelection(options)
    expect(result).toEqual([
      { label: 'Tất cả', value: -1 },
      { label: 'Option 1', value: { nested: 'value' } }
    ])
  })
})

// omitPropertyFromObject
describe('omitPropertyFromObject', () => {
  it('should omit properties with the specified filter value', () => {
    const obj = { a: 1, b: 2, c: 2 }
    const result = omitPropertyFromObject(obj, 2)
    expect(result).toEqual({ a: 1 })
  })

  it('should return the object unchanged if no properties match the filter value', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omitPropertyFromObject(obj, 4)
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle empty objects gracefully', () => {
    const obj = {}
    const result = omitPropertyFromObject(obj, 1)
    expect(result).toEqual({})
  })

  it('should remove properties that are set to a specific value, including null and undefined', () => {
    const obj = { a: null, b: undefined, c: 2 }
    const result = omitPropertyFromObject(obj, null)
    expect(result).toEqual({ b: undefined, c: 2 })
  })

  it('should not omit properties that do not match the filter value', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omitPropertyFromObject(obj, 3)
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should omit undefined properties when filter value is undefined', () => {
    const obj = { a: undefined, b: 1, c: undefined }
    const result = omitPropertyFromObject(obj, undefined)
    expect(result).toEqual({ b: 1 })
  })

  it('should handle objects with different types of filter values', () => {
    const obj = { a: 'value', b: 2, c: false }
    const result = omitPropertyFromObject(obj, false)
    expect(result).toEqual({ a: 'value', b: 2 })
  })

  it('should return the object unchanged if the filter value does not match any key', () => {
    const obj = { a: 'value', b: 2, c: true }
    const result = omitPropertyFromObject(obj, 'non-existent')
    expect(result).toEqual({ a: 'value', b: 2, c: true })
  })

  it('should correctly omit numeric values', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omitPropertyFromObject(obj, 2)
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('should handle complex objects with nested structures', () => {
    const obj = { a: { x: 1, y: 2 }, b: 3 }
    const result = omitPropertyFromObject(obj, 2)
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 3 })
  })
})

// groupByField
describe('groupByField', () => {
  it('should group array of objects by specified field', () => {
    const data = [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' }
    ]
    const result = groupByField(data, 'category')
    expect(result).toEqual({
      A: [
        { id: 1, category: 'A' },
        { id: 3, category: 'A' }
      ],
      B: [{ id: 2, category: 'B' }]
    })
  })

  it('should return an empty object for an empty array', () => {
    const result = groupByField([], 'category')
    expect(result).toEqual({})
  })

  it('should handle cases where the group field does not exist in all items', () => {
    const data = [{ id: 1, category: 'A' }, { id: 2 }]
    const result = groupByField(data, 'category')
    expect(result).toEqual({
      A: [{ id: 1, category: 'A' }],
      undefined: [{ id: 2 }]
    })
  })

  it('should group by numeric field values', () => {
    const data = [
      { id: 1, category: 1 },
      { id: 2, category: 2 },
      { id: 3, category: 1 }
    ]
    const result = groupByField(data, 'category')
    expect(result).toEqual({
      1: [
        { id: 1, category: 1 },
        { id: 3, category: 1 }
      ],
      2: [{ id: 2, category: 2 }]
    })
  })

  it('should group array with boolean field values', () => {
    const data = [
      { id: 1, active: true },
      { id: 2, active: false },
      { id: 3, active: true }
    ]
    const result = groupByField(data, 'active')
    expect(result).toEqual({
      true: [
        { id: 1, active: true },
        { id: 3, active: true }
      ],
      false: [{ id: 2, active: false }]
    })
  })

  it('should return object with single group if all data has the same field value', () => {
    const data = [
      { id: 1, category: 'A' },
      { id: 2, category: 'A' }
    ]
    const result = groupByField(data, 'category')
    expect(result).toEqual({
      A: [
        { id: 1, category: 'A' },
        { id: 2, category: 'A' }
      ]
    })
  })

  it('should handle a large dataset efficiently', () => {
    const data = Array(1000)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        category: (index % 10).toString()
      }))
    const result = groupByField(data, 'category')
    expect(Object.keys(result).length).toBe(10)
  })
})

// mappingBranches
describe('mappingBranches', () => {
  it('should map branches correctly to select options', () => {
    const branches = [
      { id: 1, name: 'Branch 1', code: 'B1' },
      { id: 2, name: 'Branch 2', code: 'B2' }
    ]
    const result = mappingBranches(branches)
    expect(result).toEqual([
      { label: 'Branch 1', value: 1, description: 'B1' },
      { label: 'Branch 2', value: 2, description: 'B2' }
    ])
  })

  it('should return an empty array for an empty branches list', () => {
    const result = mappingBranches([])
    expect(result).toEqual([])
  })

  it('should handle single branch input correctly', () => {
    const branches = [{ id: 1, name: 'Branch 1', code: 'B1' }]
    const result = mappingBranches(branches)
    expect(result).toEqual([{ label: 'Branch 1', value: 1, description: 'B1' }])
  })

  it('should map branches with numeric IDs', () => {
    const branches = [{ id: 100, name: 'Branch A', code: 'A' }]
    const result = mappingBranches(branches)
    expect(result).toEqual([{ label: 'Branch A', value: 100, description: 'A' }])
  })

  it('should map branches with non-alphabetic codes', () => {
    const branches = [{ id: 1, name: 'Branch 1', code: '1' }]
    const result = mappingBranches(branches)
    expect(result).toEqual([{ label: 'Branch 1', value: 1, description: '1' }])
  })

  it('should handle missing name field gracefully', () => {
    const branches = [{ id: 1, code: 'B1', name: '' }]
    const result = mappingBranches(branches)
    expect(result).toEqual([{ label: '', value: 1, description: 'B1' }])
  })

  it('should handle missing code field gracefully', () => {
    const branches = [{ id: 1, name: 'Branch 1', code: '' }]
    const result = mappingBranches(branches)
    expect(result).toEqual([{ label: 'Branch 1', value: 1, description: '' }])
  })

  it('should return an empty array for undefined input', () => {
    const result = mappingBranches(undefined)
    expect(result).toEqual([])
  })

  it('should return an empty array for null input', () => {
    const result = mappingBranches(null)
    expect(result).toEqual([])
  })

  it('should map branches with mixed types of code (strings, numbers)', () => {
    const branches = [
      { id: 1, name: 'Branch 1', code: 'B1' },
      { id: 2, name: 'Branch 2', code: '123' }
    ]
    const result = mappingBranches(branches)
    expect(result).toEqual([
      { label: 'Branch 1', value: 1, description: 'B1' },
      { label: 'Branch 2', value: 2, description: '123' }
    ])
  })
})

// formatNumberConfidence
describe('formatNumberConfidence', () => {
  it('should return a percentage string when the number is an integer', () => {
    const result = formatNumberConfidence(0.75)
    expect(result).toBe('75')
  })

  it('should return a rounded percentage string when the number is a decimal', () => {
    const result = formatNumberConfidence(0.756)
    expect(result).toBe('75.6')
  })

  it('should round to one decimal place when the number is a decimal', () => {
    const result = formatNumberConfidence(0.123)
    expect(result).toBe('12.3')
  })

  it('should return "0" for 0 confidence', () => {
    const result = formatNumberConfidence(0)
    expect(result).toBe('0')
  })

  it('should return "100" for 1 confidence', () => {
    const result = formatNumberConfidence(1)
    expect(result).toBe('100')
  })

  it('should handle values greater than 1 correctly', () => {
    const result = formatNumberConfidence(1.5)
    expect(result).toBe('150')
  })

  it('should handle negative values gracefully', () => {
    const result = formatNumberConfidence(-0.5)
    expect(result).toBe('-50')
  })

  it('should return a valid percentage for very small values', () => {
    const result = formatNumberConfidence(0.0001)
    expect(result).toBe('0')
  })

  it('should handle very large values correctly', () => {
    const result = formatNumberConfidence(1000)
    expect(result).toBe('100000')
  })

  it('should handle non-numeric values by returning "NaN"', () => {
    const result = formatNumberConfidence(NaN)
    expect(result).toBe('NaN')
  })
})

// sortObjectsByMultipleFields
describe('sortObjectsByMultipleFields', () => {
  it('should sort by a single string field in ascending order', () => {
    const array = [
      { name: 'Banana', value: 2 },
      { name: 'Apple', value: 1 }
    ]
    const result = sortObjectsByMultipleFields(array, ['name'], 'asc')
    expect(result).toEqual([
      { name: 'Apple', value: 1 },
      { name: 'Banana', value: 2 }
    ])
  })

  it('should sort by a single string field in descending order', () => {
    const array = [
      { name: 'Banana', value: 2 },
      { name: 'Apple', value: 1 }
    ]
    const result = sortObjectsByMultipleFields(array, ['name'], 'desc')
    expect(result).toEqual([
      { name: 'Banana', value: 2 },
      { name: 'Apple', value: 1 }
    ])
  })

  it('should sort by multiple fields in ascending order', () => {
    const array = [
      { name: 'Banana', value: 2, age: 20 },
      { name: 'Apple', value: 2, age: 25 },
      { name: 'Banana', value: 1, age: 15 }
    ]
    const result = sortObjectsByMultipleFields(array, ['value', 'age'], 'asc')
    expect(result).toEqual([
      { name: 'Banana', value: 1, age: 15 },
      { name: 'Banana', value: 2, age: 20 },
      { name: 'Apple', value: 2, age: 25 }
    ])
  })

  it('should sort by multiple fields in descending order', () => {
    const array = [
      { name: 'Banana', value: 2, age: 20 },
      { name: 'Apple', value: 2, age: 25 },
      { name: 'Banana', value: 1, age: 15 }
    ]
    const result = sortObjectsByMultipleFields(array, ['value', 'age'], 'desc')
    expect(result).toEqual([
      { name: 'Apple', value: 2, age: 25 },
      { name: 'Banana', value: 2, age: 20 },
      { name: 'Banana', value: 1, age: 15 }
    ])
  })

  it('should handle arrays with mixed types (numbers and strings)', () => {
    const array = [
      { name: 'Banana', value: '2' },
      { name: 'Apple', value: '1' }
    ]
    const result = sortObjectsByMultipleFields(array, ['value'], 'asc')
    expect(result).toEqual([
      { name: 'Apple', value: '1' },
      { name: 'Banana', value: '2' }
    ])
  })

  it('should handle invalid sort order gracefully', () => {
    const result = () => sortObjectsByMultipleFields([], ['name'], 'invalid')
    expect(result).toThrow(Error)
  })

  it('should return the same array if all objects have equal values for the sorted fields', () => {
    const array = [
      { name: 'Banana', value: 2 },
      { name: 'Apple', value: 2 }
    ]
    const result = sortObjectsByMultipleFields(array, ['value'], 'asc')
    expect(result).toEqual([
      { name: 'Banana', value: 2 },
      { name: 'Apple', value: 2 }
    ])
  })
})

import { describe, expect, it } from 'vitest'

/**
 * @description All examples in this file are intended to demonstrate the most basic usage of Vitest
 * @link https://cn.vitest.dev/api
 * @api describe: forms a scope
 * @api test/it: defines a set of methods about test expectations, which receive the test name and a function containing test expectations
 * @api expect: used to create assertions
 * @api toBe: can be used to assert whether primitive types are equal or whether objects share the same reference
 * @api toEqual: asserts whether the actual value is equal to the received value or has the same structure (if it is an object, recursively compare them)
 */

const author1 = {
  name: 'pany',
  email: '939630029@qq.com',
  url: 'https://github.com/pany-ang'
}

const author2 = {
  name: 'pany',
  email: '939630029@qq.com',
  url: 'https://github.com/pany-ang'
}

describe('Enter the scope name here', () => {
  it('Testing basic data types', () => {
    expect(1 + 1).toBe(2)
  })
  it('Testing Reference Types', () => {
    expect(author1).toEqual(author2)
  })
})

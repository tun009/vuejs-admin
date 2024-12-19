import isWhiteList from '@/config/white-list'
import { describe, it, expect } from 'vitest'
import { RouteLocationNormalized } from 'vue-router'

describe('isWhiteList', () => {
  it('should return true when the path is in the whiteListByPath', () => {
    const route = { path: '/login', name: 'Home' } as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(true)
  })

  it('should return true when the name is in the whiteListByName', () => {
    const route = { path: '/dashboard', name: 'Login' } as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(true)
  })

  it('should return true when both path and name match the whitelist', () => {
    const route = { path: '/login', name: 'Login' } as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(true)
  })

  it('should return false when neither path nor name match the whitelist', () => {
    const route = { path: '/dashboard', name: 'Dashboard' } as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(false)
  })

  it('should return false when path is null and name is not in the whitelist', () => {
    const route = { path: null, name: 'Home' } as unknown as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(false)
  })

  it('should return false when name is null and path is not in the whitelist', () => {
    const route = { path: '/profile', name: null } as unknown as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(false)
  })

  it('should return true when path is an empty string and name is in the whitelist', () => {
    const route = { path: '', name: 'Login' } as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(true)
  })

  it('should return false when path is not in the whitelist and name is empty', () => {
    const route = { path: '/settings', name: '' } as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(false)
  })

  it('should return false when path is not in the whitelist and name is undefined', () => {
    const route = { path: '/profile', name: undefined } as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(false)
  })

  it('should return true when path is in the whitelist and name is undefined', () => {
    const route = { path: '/login', name: undefined } as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(true)
  })

  it('should return false if path is in whitelist but name is undefined or null', () => {
    const route = { path: '/login', name: null } as unknown as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(true)

    const route2 = { path: '/login', name: undefined } as RouteLocationNormalized
    expect(isWhiteList(route2)).toBe(true)
  })

  it('should return false if path is not in whitelist and name is undefined or null', () => {
    const route = { path: '/logout', name: null } as unknown as RouteLocationNormalized
    expect(isWhiteList(route)).toBe(false)

    const route2 = { path: '/logout', name: undefined } as RouteLocationNormalized
    expect(isWhiteList(route2)).toBe(false)
  })
})

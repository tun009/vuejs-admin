import EIBLoading from '@/components/common/EIBLoading.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('EIBLoading', () => {
  it('should render an SVG element with correct properties', () => {
    const wrapper = mount(EIBLoading)

    const svg = wrapper.find('svg')

    // Kiểm tra thuộc tính của svg
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('viewBox')).toBe('0 0 100 101')
    expect(svg.classes()).toContain('inline')
    expect(svg.classes()).toContain('w-6')
    expect(svg.classes()).toContain('h-6')
    expect(svg.classes()).toContain('animate-spin')
    expect(svg.classes()).toContain('text-gray-200')
    expect(svg.classes()).toContain('dark:text-gray-600')
    expect(svg.classes()).toContain('fill-blue-600')
  })

  it('should have a div with role="status"', () => {
    const wrapper = mount(EIBLoading)

    const div = wrapper.find('div[role="status"]')

    // Kiểm tra xem div có role="status" không
    expect(div.exists()).toBe(true)
    expect(div.attributes('role')).toBe('status')
  })

  it('should render a span with the correct text for screen readers', () => {
    const wrapper = mount(EIBLoading)

    const span = wrapper.find('span.sr-only')

    // Kiểm tra xem span có chứa "Loading..." cho screen readers không
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe('Loading...')
  })

  it('should render the SVG with correct fill color', () => {
    const wrapper = mount(EIBLoading)

    const svg = wrapper.find('svg')

    // Kiểm tra xem màu sắc trong fill có đúng như mong đợi không
    expect(svg.find('path').attributes('fill')).toBe('currentColor')
  })

  it('should render the inner paths of the SVG correctly', () => {
    const wrapper = mount(EIBLoading)

    const paths = wrapper.findAll('path')

    // Kiểm tra xem số lượng các path trong SVG có đúng không
    expect(paths.length).toBe(2)
    expect(paths[0].attributes('fill')).toBe('currentColor')
    expect(paths[1].attributes('fill')).toBe('currentFill')
  })
})

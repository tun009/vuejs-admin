import EIBList from '@/components/common/EIBList.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('EIBList', () => {
  it('should render the correct number of items based on data array', () => {
    const data = ['Item 1', 'Item 2', 'Item 3']
    const wrapper = mount(EIBList, {
      props: { data }
    })

    // Kiểm tra số lượng items trong danh sách
    expect(wrapper.findAll('div.flex.flex-row').length).toBe(data.length)
  })

  it('should apply the passed color prop correctly', () => {
    const data = ['Item 1', 'Item 2']
    const color = 'red'
    const wrapper = mount(EIBList, {
      props: { data, color }
    })

    // Kiểm tra xem color prop đã được áp dụng đúng chưa
    const firstItemColor = wrapper.find('span').attributes('style')
    expect(firstItemColor).toContain('color: red')
  })

  it('should render items with the correct text content', () => {
    const data = ['Item 1', 'Item 2', 'Item 3']
    const wrapper = mount(EIBList, {
      props: { data }
    })

    // Kiểm tra xem nội dung văn bản có đúng không
    const items = wrapper.findAll('span')
    items.forEach((item, index) => {
      expect(item.text()).toBe(data[index].toString())
    })
  })

  it('should render the correct background color for items', () => {
    const data = ['Item 1', 'Item 2']
    const color = 'blue'
    const wrapper = mount(EIBList, {
      props: { data, color }
    })

    // Kiểm tra xem background color có được áp dụng đúng không
    const firstItemBackgroundColor = wrapper.find('div.h-1').attributes('style')
    expect(firstItemBackgroundColor).toContain('background-color: blue')
  })

  it('should correctly handle an empty data array', () => {
    const data: (string | number)[] = []
    const wrapper = mount(EIBList, {
      props: { data }
    })

    // Kiểm tra xem không có item nào được render
    expect(wrapper.findAll('div.flex.flex-row').length).toBe(0)
  })

  it('should apply default styling to the divs', () => {
    const data = ['Item 1']
    const wrapper = mount(EIBList, {
      props: { data }
    })

    // Kiểm tra xem div có lớp "flex" và "flex-col" không
    expect(wrapper.classes()).toContain('flex')
    expect(wrapper.classes()).toContain('flex-col')
  })

  it('should correctly bind the data and style for multiple items', () => {
    const data = [1, 2, 3]
    const color = 'green'
    const wrapper = mount(EIBList, {
      props: { data, color }
    })

    // Kiểm tra tất cả các item và style color
    const spans = wrapper.findAll('span')
    spans.forEach((span) => {
      expect(span.attributes('style')).toContain('color: green')
    })
  })
})

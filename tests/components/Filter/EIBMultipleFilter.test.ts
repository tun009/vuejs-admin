import EIBMultipleFilter from '@/components/Filter/EIBMultipleFilter.vue'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('element-plus', () => ({
  ElPopover: true, // Mocking ElPopover for simplicity
  ElCheckbox: true,
  ElCheckboxGroup: true,
  ElCheckboxButton: true
}))

describe('EIBMultipleFilter', () => {
  let wrapper: any
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 }
  ]

  beforeEach(() => {
    wrapper = mount(EIBMultipleFilter, {
      global: {
        mocks: {
          $t: (key: string) => key // Mock translation function
        },
        stubs: {
          ArrowDownBold
        }
      },
      props: {
        title: 'Test Title',
        modelValue: [1], // Set initial modelValue to [1]
        options
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render component correctly', () => {
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('+1')
  })
})

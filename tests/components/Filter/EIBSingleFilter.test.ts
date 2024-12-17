import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ArrowDownBold, Check } from '@element-plus/icons-vue'
import { mount } from '@vue/test-utils'
import EIBSingleFilter from '@/components/Filter/EIBSingleFilter.vue'

vi.mock('element-plus', () => ({
  ElPopover: true, // Mocking ElPopover for simplicity
  ElText: true,
  ElIcon: true
}))

describe('EIBSingleFilter', () => {
  let wrapper: any

  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 }
  ]

  beforeEach(() => {
    wrapper = mount(EIBSingleFilter, {
      global: {
        mocks: {
          $t: (key: string) => key // Mock translation function
        },
        stubs: {
          ArrowDownBold,
          Check
        }
      },
      props: {
        title: 'Test Title',
        modelValue: 1, // Set initial modelValue to 1
        options
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render component with correct title and modelValue', () => {
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Option 1')
  })

  it('should display the correct label based on modelValue', async () => {
    // Test that the label corresponds to the selected value (Option 1)
    expect(wrapper.text()).toContain('Option 1')

    // Change modelValue to Option 2
    await wrapper.setProps({ modelValue: 2 })
    expect(wrapper.text()).toContain('Option 2')
  })

  it('should emit "update:model-value" when an option is selected', async () => {
    const option = wrapper.findAll('.cursor-pointer.group')[1]
    await option.trigger('click')

    expect(wrapper.emitted()['update:model-value']).toBeDefined()
    expect(wrapper.emitted()['update:model-value'][0]).toEqual([2]) // Option 2 was clicked
  })

  it('should show the check icon for the selected option', async () => {
    const options = wrapper.findAll('.cursor-pointer.group')

    // Ensure that the first option has a check icon
    const checkIcon = options[0].findComponent(Check)
    expect(checkIcon.exists()).toBe(true)

    // Change the selected model value
    await wrapper.setProps({ modelValue: 2 })

    // Ensure that the check icon appears on the second option now
    const newCheckIcon = options[1].findComponent(Check)
    expect(newCheckIcon.exists()).toBe(true)
  })
})

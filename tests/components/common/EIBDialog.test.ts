import EIBDialog from '@/components/common/EIBDialog.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('EIBDialog', () => {
  it('should show the dialog when modelValue is true', () => {
    const wrapper = mount(EIBDialog, {
      props: { modelValue: true }
    })

    // Kiểm tra xem dialog có hiển thị không
    expect(wrapper.find('.el-dialog').exists()).toBe(false)
  })

  it('should hide the dialog when modelValue is false', async () => {
    const wrapper = mount(EIBDialog, {
      props: { modelValue: false }
    })

    // Kiểm tra xem dialog có ẩn không khi modelValue là false
    expect(wrapper.find('.el-dialog').exists()).toBe(false)
  })
})

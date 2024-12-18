import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ElMessageBox } from 'element-plus'
import { confirmButtonDeleteClass } from '@/constants/common'
import { useConfirmModal } from '@/hooks/useConfirm'

// Mocking the necessary dependencies
vi.mock('element-plus', () => ({
  ElMessageBox: {
    confirm: vi.fn(),
    prompt: vi.fn(),
    alert: vi.fn()
  },
  ElMessage: vi.fn()
}))

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => key) // Return key as the translation
  }))
}))

describe('useConfirmModal', () => {
  let showConfirmModal: any

  beforeEach(() => {
    // Initialize useConfirmModal and extract showConfirmModal function
    const { showConfirmModal: showModal } = useConfirmModal()
    showConfirmModal = showModal
  })

  it('should call ElMessageBox.confirm for confirm type', async () => {
    const options = {
      message: 'Are you sure?',
      title: 'Confirmation',
      type: 'confirm',
      successCallback: vi.fn(),
      onConfirm: vi.fn()
    }

    // Call the method
    await showConfirmModal(options)

    // Ensure ElMessageBox.confirm is called
    expect(ElMessageBox.confirm).toHaveBeenCalledWith('Are you sure?', 'Confirmation', expect.any(Object))
  })

  it('should call ElMessageBox.prompt for prompt type', async () => {
    const options = {
      message: 'Enter a value:',
      title: 'Prompt',
      type: 'prompt',
      successCallback: vi.fn(),
      onConfirm: vi.fn()
    }

    // Call the method
    await showConfirmModal(options)

    // Ensure ElMessageBox.prompt is called
    expect(ElMessageBox.prompt).toHaveBeenCalledWith('Enter a value:', 'Prompt', expect.any(Object))
  })

  it('should handle delete confirmation with the correct class for the confirm button', async () => {
    const options = {
      message: 'Delete this item?',
      title: 'Delete Confirmation',
      isDelete: true,
      successCallback: vi.fn(),
      onConfirm: vi.fn((instance, done) => {
        // Simulate the confirm button action
        done()
      })
    }

    // Call the method
    await showConfirmModal(options)

    // Ensure ElMessageBox.confirm is called with the correct options
    expect(ElMessageBox.confirm).toHaveBeenCalledWith(
      'Delete this item?',
      'Delete Confirmation',
      expect.objectContaining({
        confirmButtonClass: confirmButtonDeleteClass
      })
    )
  })
})

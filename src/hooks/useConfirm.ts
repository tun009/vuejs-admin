import { ElMessageBox, ElMessage, MessageBoxState, ElMessageBoxOptions } from 'element-plus'
import { useI18n } from 'vue-i18n'

export function useConfirmModal() {
  const { t } = useI18n()

  const showConfirmModal = ({
    message,
    title,
    successCallback,
    onConfirm,
    options = {}
  }: {
    message?: string
    title?: string
    successCallback?: () => void
    onConfirm?: (instance: MessageBoxState, done: () => void) => void
    options?: Partial<ElMessageBoxOptions>
  }) => {
    ElMessageBox.confirm(message, title, {
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = 'Loading...'
          onConfirm?.(instance, done)
        } else {
          done()
        }
      },
      cancelButtonText: t('button.cancel_1'),
      confirmButtonText: t('button.confirm'),
      dangerouslyUseHTMLString: true,
      draggable: true,
      ...options
    }).then(() => {
      successCallback?.()
      ElMessage({
        message: 'Thao tác thành công! ⚡',
        type: 'success'
      })
    })
  }

  return {
    showConfirmModal
  }
}

import { ElMessageBox, ElMessage, MessageBoxState, ElMessageBoxOptions, MessageBoxType } from 'element-plus'
import { useI18n } from 'vue-i18n'

export function useConfirmModal() {
  const { t } = useI18n()
  const messageBoxMethods: Record<MessageBoxType, typeof ElMessageBox.confirm> = {
    confirm: ElMessageBox.confirm,
    prompt: ElMessageBox.prompt,
    alert: ElMessageBox.alert,
    '': ElMessageBox.confirm
  }
  const showConfirmModal = ({
    message,
    title,
    successCallback,
    onConfirm,
    options = {},
    type = 'confirm'
  }: {
    message?: string
    title?: string
    successCallback?: () => void
    onConfirm?: (instance: MessageBoxState, done: () => void) => void
    options?: Partial<ElMessageBoxOptions>
    type?: MessageBoxType
  }) => {
    const messageBoxMethod = messageBoxMethods[type]
    messageBoxMethod(message, title, {
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

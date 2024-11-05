import { ElNotification } from 'element-plus'
import i18n from '@/locales'

//#region Notification
export const successNotification = (message: string) => {
  ElNotification({
    title: i18n.global.t('notification.title.success'),
    type: 'success',
    message: i18n.global.t(message)
  })
}

export const warningNotification = (message: string) => {
  ElNotification({
    title: i18n.global.t('notification.title.warning'),
    type: 'warning',
    message: i18n.global.t(message)
  })
}

export const errorNotification = (message: string) => {
  ElNotification({
    title: i18n.global.t('notification.title.error'),
    type: 'error',
    message: i18n.global.t(message)
  })
}

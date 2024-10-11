import { ElNotification } from 'element-plus'

import i18n from '@/locales'

export const successNotification = (message: string) => {
  ElNotification({
    message,
    title: i18n.global.t('notification.title.success'),
    type: 'success'
  })
}

export const warningNotification = (message: string) => {
  ElNotification({
    message,
    title: i18n.global.t('notification.title.warning'),
    type: 'warning'
  })
}

export const errorNotification = (message: string) => {
  ElNotification({
    message,
    title: i18n.global.t('notification.title.error'),
    type: 'error'
  })
}

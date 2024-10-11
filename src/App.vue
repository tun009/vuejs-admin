<script lang="ts" setup>
import { ElNotification } from 'element-plus'
// Set Element Plus language to Vietnamese
import vi from 'element-plus/es/locale/lang/vi'
import { useI18n } from 'vue-i18n'

import { useTheme } from '@/hooks/useTheme'

const { initTheme } = useTheme()
const { t } = useI18n({ useScope: 'global' })
/** Initialize theme */
initTheme()

/** The author's thoughts */
ElNotification({
  dangerouslyUseHTMLString: true,
  duration: 0,
  message: `<a style='color: teal' target='_blank' href='https://www.youtube.com/watch?v=jfpQHBsPzkU'>${t('notification.description.joinWeb')}</a>`,
  title: t('notification.title.joinWeb'),
  type: 'success'
})
</script>

<template>
  <el-config-provider :locale="vi">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useTheme } from '@/hooks/useTheme'
import { ElNotification } from 'element-plus'
// Set Element Plus language to Vietnamese
import vi from 'element-plus/es/locale/lang/vi'
import { useI18n } from 'vue-i18n'

const { initTheme } = useTheme()
const { t } = useI18n({ useScope: 'global' })
/** Initialize theme */
initTheme()

/** The author's thoughts */
ElNotification({
  title: t('notification.title.joinWeb'),
  type: 'success',
  dangerouslyUseHTMLString: true,
  message: t('notification.description.joinWeb'),
  duration: 0
})
</script>

<template>
  <el-config-provider :locale="vi">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useTheme } from '@/hooks/useTheme'
// Set Element Plus language to Vietnamese
import vi from 'element-plus/es/locale/lang/vi'
import { useI18n } from 'vue-i18n'
import { successNotification } from './utils/notification'

const { initTheme } = useTheme()
const { t } = useI18n({ useScope: 'global' })
/** Initialize theme */
initTheme()

/** The author's thoughts */
successNotification(t('notification.description.joinWeb'))
</script>

<template>
  <el-config-provider :locale="vi">
    <router-view />
  </el-config-provider>
</template>

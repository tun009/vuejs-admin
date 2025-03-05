<script lang="ts" setup>
import { useTheme } from '@/hooks/useTheme'
// Set Element Plus language to Vietnamese
import vi from 'element-plus/es/locale/lang/vi'

const { initTheme } = useTheme()
/** Initialize theme */
initTheme()

/** The author's thoughts */
</script>

<template>
  <el-config-provider :locale="vi">
    <!-- <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view> -->
    <router-view />
  </el-config-provider>
</template>

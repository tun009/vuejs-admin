<script lang="ts" setup>
import ErrorPageLayout from './components/ErrorPageLayout.vue'
import Svg403 from '@/assets/error-page/403.svg?component' // Functions of vite-svg-loader plugin
</script>

<template>
  <ErrorPageLayout>
    <Svg403 />
  </ErrorPageLayout>
</template>

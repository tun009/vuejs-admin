<template>
  <!--  eslint-disable-next-line -->
  <!-- //NOSONAR -->
  <div v-html="sanitizeString(html)" />
</template>

<script setup lang="ts">
import { sanitizeString } from '@/utils/common'

interface Props {
  html?: string
}

withDefaults(defineProps<Props>(), {
  html: ''
})
</script>

<template>
  <div :dangerouslySetInnerHTML="{ __html: sanitizeString(html) }" />
</template>

<script setup lang="ts">
import { sanitizeString } from '@/utils/common'

interface Props {
  html: string
}

defineProps<Props>()
</script>

<script lang="ts" setup>
import { sanitizeString } from '@/utils/common'
import { computed } from 'vue'

interface Props {
  prefix?: string
  name: string
  className?: string
  size?: number | string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
  className: '',
  size: 16,
  title: ''
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<template>
  <svg class="svg-icon" :class="className" :style="{ width: size, height: size }" aria-hidden="true">
    <title>{{ title }}</title>
    <!--  eslint-disable-next-line -->
    <!-- //NOSONAR --><use :href="sanitizeString(symbolId)" />
  </svg>
</template>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>

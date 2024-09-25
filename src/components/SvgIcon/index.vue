<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  prefix?: string
  name: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
  className: ''
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<template>
  <svg class="svg-icon" :class="className" aria-hidden="true">
    <use :href="symbolId" />
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

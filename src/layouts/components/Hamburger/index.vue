<script lang="ts" setup>
import { Expand, Fold } from '@element-plus/icons-vue'

interface Props {
  isActive?: boolean
  color?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  size: 20
})

/** Vue 3.3+ defineEmits syntax*/
const emit = defineEmits<{
  toggleClick: []
}>()

const toggleClick = () => {
  emit('toggleClick')
}
</script>

<template>
  <div @click="toggleClick" class="cursor-pointer">
    <el-icon :size="size" class="icon hamburger-icon">
      <Fold v-if="props.isActive" :style="{ color }" />
      <Expand v-else :style="{ color }" />
    </el-icon>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  vertical-align: middle;
  color: var(--prefix-hamburger-text-color);
}
</style>

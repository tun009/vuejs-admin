<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'

interface Props {
  minWidth?: number
  defaultLeftWidth?: number
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  minWidth: 100,
  defaultLeftWidth: 350
})

const leftWidth = ref(`${props.defaultLeftWidth}px`)
const rightWidth = ref(`calc(100% - ${props.defaultLeftWidth}px)`)
const dragging = ref(false)
const startX = ref(0)
const initialLeftWidth = ref(0)

const startDrag = (_event: MouseEvent) => {
  dragging.value = true
  startX.value = _event.pageX
  initialLeftWidth.value = parseInt(leftWidth.value)

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (event: MouseEvent) => {
  if (!dragging.value) return
  const deltaX = event.pageX - startX.value
  let newLeftWidth = 0
  if (initialLeftWidth.value + deltaX > window.innerWidth - props.minWidth) {
    newLeftWidth = window.innerWidth - props.minWidth
  } else if (initialLeftWidth.value + deltaX < props.minWidth) {
    newLeftWidth = props.minWidth
  } else {
    newLeftWidth = initialLeftWidth.value + deltaX
  }

  if (newLeftWidth >= 0 && newLeftWidth <= window.innerWidth) {
    leftWidth.value = `${newLeftWidth}px`
    rightWidth.value = `calc(100% - ${newLeftWidth}px)`
  }
}

const stopDrag = () => {
  dragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div class="flex">
    <div
      :style="{ width: leftWidth }"
      class="p-5 overflow-x-hidden hidden-scrollbar"
      :class="customClass && customClass"
    >
      <slot name="left" />
    </div>
    <div class="w-0.5 hover:w-1 transition-all bg-[#e9ecef] cursor-col-resize" @mousedown="startDrag" />
    <div
      :style="{ width: rightWidth }"
      class="p-5 overflow-x-hidden resizable-block"
      :class="customClass && customClass"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.resizable-block {
  @extend %scrollbar;
}
</style>

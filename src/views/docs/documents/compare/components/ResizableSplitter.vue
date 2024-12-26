<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted, computed } from 'vue'

interface Props {
  minWidth?: number
  defaultLeftWidth?: number
  customClass?: string
  customId?: string
}

const props = withDefaults(defineProps<Props>(), {
  minWidth: 200,
  defaultLeftWidth: 350,
  customId: ''
})

const id = computed(() => (props.customId ? 'resizable-splitter' : `resizable-splitter-${props.customId}`))
const resizableSplitter = ref<number>(0)
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
  if (initialLeftWidth.value + deltaX > resizableSplitter.value - props.minWidth) {
    newLeftWidth = resizableSplitter.value - props.minWidth
  } else if (initialLeftWidth.value + deltaX < props.minWidth) {
    newLeftWidth = props.minWidth
  } else {
    newLeftWidth = initialLeftWidth.value + deltaX
  }

  if (newLeftWidth >= 0 && newLeftWidth <= resizableSplitter.value - props.minWidth) {
    leftWidth.value = `${newLeftWidth}px`
    rightWidth.value = `calc(100% - ${newLeftWidth}px)`
  }
}

const stopDrag = () => {
  dragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const handleGetWidth = () => {
  const element = document.getElementById(id.value)
  const width = element?.offsetWidth ?? 0
  resizableSplitter.value = Number(width.toFixed(0))
}

onMounted(() => {
  handleGetWidth()
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div class="flex w-full" :id="id">
    <div
      :style="{ width: leftWidth }"
      class="p-5 overflow-x-hidden hidden-scrollbar resizable-block resizable-block-left"
      :class="customClass"
    >
      <slot name="left" />
    </div>
    <div class="w-4 flex justify-center items-center cursor-col-resize" @mousedown="startDrag">
      <div class="w-0.5 hover:w-1 h-full transition-all bg-[#e9ecef]" />
    </div>
    <div
      :style="{ width: rightWidth }"
      class="p-5 overflow-x-hidden resizable-block resizable-block-right"
      :class="customClass"
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

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  scale: number
  idFullScreen: string
}>()

const emit = defineEmits<{
  (e: 'update:scale', value: number): void
}>()
const zoomIn = () => {
  scale.value = parseFloat(scale.value.toString())
  if (scale.value < 2.5) {
    scale.value = Math.min(scale.value + 0.1, 2.5)
  }
  emit('update:scale', scale.value)
}
const zoomOut = () => {
  scale.value = parseFloat(scale.value.toString())
  if (scale.value > 0.1) {
    scale.value = Math.max(scale.value - 0.1, 0.1)
  }
  emit('update:scale', scale.value)
}
const scale = ref(props.scale)
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'F11') {
    event.preventDefault()
    toggleFullScreen()
  }
}
const toggleFullScreen = () => {
  const pdfContainer = document.getElementById(props.idFullScreen)
  if (pdfContainer) {
    if (!document.fullscreenElement) {
      pdfContainer.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }
}
const handleMouseWheel = (event: WheelEvent) => {
  if (event.ctrlKey) {
    event.preventDefault()
    if (event.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('wheel', handleMouseWheel, { passive: false })
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('wheel', handleMouseWheel)
})
watch(
  () => props.scale,
  (value) => {
    scale.value = value
  }
)
</script>
<template>
  <div
    class="bg-[#4a5c6f] flex lg:w-[320px] md:w-[280px] sm:w-[250px] h-[40px] text-[#fff] rounded-[4px] justify-start items-start gap-2.5 p-2.5 px-5 pt-2.5 pl-4"
  >
    <SvgIcon title="Thu nhỏ" name="zoom-out" class="cursor-pointer !h-[22px] !w-[30px]" @click="zoomOut()" />
    <input
      class="w-full cursor-pointer h-full accent-[#7f8b98]"
      type="range"
      min="0.1"
      max="2.5"
      step="0.1"
      v-model="scale"
      @update:model-value="(value: number) => emit('update:scale', value)"
    />
    <SvgIcon title="Phóng to" name="zoom-in" class="cursor-pointer !h-[22px] !w-[30px]" @click="zoomIn()" />
    <span class="text-[14px]">{{ (scale * 100).toFixed(0) }}%</span>
    <slot name="button" />
    <SvgIcon
      title="Toàn màn hình"
      name="full-screen"
      class="cursor-pointer !h-[22px] !w-[30px]"
      @click="toggleFullScreen"
    />
  </div>
</template>

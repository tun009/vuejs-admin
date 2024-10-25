<script lang="ts" setup>
import { ref } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  url?: string
}>()
const emit = defineEmits<{
  (e: 'loaded-data'): void
}>()
const scale = ref(1)
const currentPage = ref(1)
const rotation = ref(1)
const { pdf, pages } = usePDF(props.url)
const scrollToPage = () => {
  const currentView = document.getElementById('view-pdf')
  if (currentView) {
    currentPage.value = Math.round(currentView.scrollTop / (currentView.scrollHeight / pages.value) + 1)
  }
}
const zoomIn = () => {
  if (scale.value < 2) {
    scale.value = Math.min(scale.value + 0.1, 2)
  }
}
const zoomOut = () => {
  if (scale.value > 0.1) {
    scale.value = Math.max(scale.value - 0.1, 0.1)
  }
}
const onLoadedPDF = () => {
  emit('loaded-data')
}
const tagLabelToPage = (boxInfos: number[][][], pageNum: number) => {
  const listActivesRemove = document.querySelectorAll('.box-label')
  listActivesRemove.forEach((element) => {
    element.remove()
  })
  const pElement = document.createElement('p')
  const elementPage = document.getElementById('page-' + (pageNum + 1))
  if (boxInfos.length > 0) {
    boxInfos.forEach((boxInfo, index) => {
      pElement.className = 'box-label'
      pElement.style.width = caculatorDistance(getRectangle(boxInfo, 'width'))
      pElement.style.height = caculatorDistance(getRectangle(boxInfo, 'height'))
      pElement.style.top = caculatorDistance(getRectangle(boxInfo, 'top'))
      pElement.style.left = caculatorDistance(getRectangle(boxInfo, 'left'))
      pElement.style.backgroundColor = 'rgba(240, 91, 91, 0.3) '
      pElement.style.border = '1px solid #e03'
      pElement.style.position = 'absolute'
      if (elementPage) elementPage.appendChild(pElement)
      if (index === 0) {
        const elementScrollTo = pElement ?? elementPage
        elementScrollTo.scrollIntoView({ behavior: 'smooth' })
      }
    })
  } else elementPage?.scrollIntoView({ behavior: 'smooth' })
}
const caculatorDistance = (unit: number) => {
  return `${unit.toString()}%`
}
const getRectangle = (bbox: number[][], style: string) => {
  const result: any = {}
  const listX = []
  const listY = []
  for (const point of bbox) {
    listX.push(point[0])
    listY.push(point[1])
  }
  const xmin = Math.min.apply(null, listX)
  const ymin = Math.min.apply(null, listY)
  const xmax = Math.max.apply(null, listX)
  const ymax = Math.max.apply(null, listY)
  result.width = (xmax - xmin) * 100
  result.height = (ymax - ymin) * 100
  result.top = ymin * 100
  result.left = xmin * 100
  if (style === 'top') {
    return result.top
  } else if (style === 'left') {
    return result.left
  } else if (style === 'width') {
    return result.width
  } else if (style === 'height') {
    return result.height
  }
}
interface ExtractPdfViewExpose {
  tagLabelToPage: (boxInfo: number[][][], pageNum: number) => void
}
defineExpose<ExtractPdfViewExpose>({
  tagLabelToPage
})
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'F11') {
    event.preventDefault()
    toggleFullScreen()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
const toggleFullScreen = () => {
  const pdfContainer = document.getElementById('view-pdf')
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
</script>

<template>
  <div class="flex justify-between my-2 pdf-view-component">
    <div
      class="bg-[#4a5c6f] flex w-[320px] h-[40px] text-[#fff] rounded-[4px] justify-start items-start gap-2.5 p-2.5 px-5 pt-2.5 pl-4"
    >
      <SvgIcon title="Thu nhỏ" name="zoom-out" class="cursor-pointer !h-[22px] !w-[22px]" @click="zoomOut()" />
      <input
        class="w-full cursor-pointer h-full accent-[#7f8b98]"
        type="range"
        min="0.1"
        max="2.5"
        step="0.1"
        v-model="scale"
        @input="scale = Number(($event?.target as HTMLInputElement)?.value)"
      />
      <SvgIcon title="Phóng to" name="zoom-in" class="cursor-pointer !h-[22px] !w-[22px]" @click="zoomIn()" />
      <span class="text-[14px]">{{ (scale * 100).toFixed(0) }}%</span>
      <SvgIcon
        title="Toàn màn hình"
        name="full-screen"
        class="cursor-pointer !h-[22px] !w-[22px]"
        @click="toggleFullScreen"
      />
    </div>
    <div>
      Trang {{ currentPage }} /
      {{ pages }}
    </div>
  </div>
  <div class="overflow-auto h-[calc(100vh-58px)]" id="view-pdf" @scroll="scrollToPage()">
    <div v-for="page in pages" :key="page" class="mx-auto relative w-fit">
      <VuePDF
        :id="'page-' + page"
        :pdf="pdf"
        :page="page"
        :scale="scale"
        :rotation="rotation"
        @loaded="onLoadedPDF()"
      />
      <div class="text-center my-2">Trang {{ page }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-pdf > div {
  width: fit-content;
}
.custom-input-range {
  accent-color: #7f8b98;
}
</style>

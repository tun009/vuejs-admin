<script lang="ts" setup>
import { ref } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import ControlSlider from './ControlSlider.vue'
import { RefreshRight } from '@element-plus/icons-vue'
const props = defineProps<{
  url?: string
}>()
const emit = defineEmits<{
  (e: 'loaded-data'): void
}>()
const idFullScreen = 'view-pdf'
const scale = ref(1)
const currentPage = ref(1)
const rotation = ref(0)
const { pdf, pages } = usePDF(props.url)
const scrollToPage = () => {
  const currentView = document.getElementById('view-pdf')
  if (currentView) {
    currentPage.value = Math.round(currentView.scrollTop / (currentView.scrollHeight / pages.value) + 1)
  }
}
const rotationPage = () => {
  rotation.value += 90
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
  if (boxInfos?.length > 0) {
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
        const elementScrollTo = elementPage ?? pElement
        elementScrollTo.scrollIntoView({ behavior: 'smooth' })
      }
    })
  } else elementPage?.scrollIntoView({ behavior: 'smooth' })
}
const goToPageView = (page: number) => {
  const elementPage = document.getElementById('page-' + (page + 1))
  if (elementPage) elementPage?.scrollIntoView({ behavior: 'smooth' })
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
  goToPageView: (pageNum: number) => void
}
defineExpose<ExtractPdfViewExpose>({
  tagLabelToPage,
  goToPageView
})
</script>

<template>
  <div class="flex justify-between my-2 pdf-view-component">
    <ControlSlider
      :scale="scale"
      :id-full-screen="idFullScreen"
      @update:scale="
        (val: number) => {
          scale = val
        }
      "
    >
      <template #button>
        <el-icon title="Xoay" size="16" class="mt-[3px] cursor-pointer" @click="rotationPage()"
          ><RefreshRight
        /></el-icon>
      </template>
    </ControlSlider>
    <div>
      Trang {{ currentPage }} /
      {{ pages }}
    </div>
  </div>
  <div class="overflow-auto h-[calc(100vh-58px)]" :id="idFullScreen" @scroll="scrollToPage()">
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

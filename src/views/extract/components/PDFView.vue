<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import ControlSlider from './ControlSlider.vue'
import { RefreshRight, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

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
const { pdf, pages } = usePDF('http://vmc-web-stg.idp.vn/uat/vmc-app/api/file?src=1559/1559.pdf' || props.url)
const isScrolling = ref(false)
const scrollToPage = () => {
  if (isScrolling.value) return
  const currentView = document.getElementById(idFullScreen)
  if (currentView) {
    const clientHeight = currentView.clientHeight
    const scrollTop = currentView.scrollTop
    const scrollHeight = currentView.scrollHeight
    const currentPageMin = scrollTop / (scrollHeight / pages.value)
    const currentPageMax = ((scrollTop + clientHeight) * pages.value) / scrollHeight
    if (scale.value < 1.3) currentPage.value = Math.round(currentPageMin + 1)
    else currentPage.value = getClosestFloor(currentPageMin, currentPageMax) + 1
  }
}
const getClosestFloor = (num1: number, num2: number) => {
  const middle = Math.round((num1 + num2) / 2)
  const dist1 = Math.abs(num1 - middle)
  const dist2 = Math.abs(num2 - middle)
  if (dist1 < dist2) {
    return Math.floor(num2)
  } else {
    return Math.floor(num1)
  }
}
const rotationPage = () => {
  rotation.value += 90
  // const listActives = document.querySelectorAll('.box-label')
  // listActives.forEach((elm: any) => {
  // const angle = rotation.value % 360
  // const width = elm.style.width
  // const height = elm.style.height
  // const top = elm.style.top
  // const left = elm.style.left
  // elm.style.top = ''
  // elm.style.left = ''
  // elm.style.width = ''
  // elm.style.height = ''
  // elm.style.bottom = ''
  // elm.style.right = ''
  // const positions = {
  //   0: () => {
  //     elm.style.width = width
  //     elm.style.height = height
  //     elm.style.top = top
  //     elm.style.left = left
  //   },
  //   90: () => {
  //     elm.style.width = height
  //     elm.style.height = width
  //     elm.style.top = left
  //     elm.style.right = top
  //   },
  //   180: () => {
  //     elm.style.width = width
  //     elm.style.height = height
  //     elm.style.bottom = top
  //     elm.style.right = left
  //   },
  //   270: () => {
  //     elm.style.width = height
  //     elm.style.height = width
  //     elm.style.left = top
  //     elm.style.bottom = left
  //   }
  // }
  // if (positions[angle]) {
  //   positions[angle]()
  // }
  // })
}
const onLoadedPDF = () => {
  emit('loaded-data')
}
const renderElementByRotation = (elm: HTMLElement, box: number[][]) => {
  if (rotation.value % 360 === 0) {
    elm.style.width = caculatorDistance(getRectangle(box, 'width'))
    elm.style.height = caculatorDistance(getRectangle(box, 'height'))
    elm.style.top = caculatorDistance(getRectangle(box, 'top'))
    elm.style.left = caculatorDistance(getRectangle(box, 'left'))
  } else if (rotation.value % 360 === 90) {
    elm.style.height = caculatorDistance(getRectangle(box, 'width'))
    elm.style.width = caculatorDistance(getRectangle(box, 'height'))
    elm.style.right = caculatorDistance(getRectangle(box, 'top'))
    elm.style.top = caculatorDistance(getRectangle(box, 'left'))
  } else if (rotation.value % 360 === 180) {
    elm.style.width = caculatorDistance(getRectangle(box, 'width'))
    elm.style.height = caculatorDistance(getRectangle(box, 'height'))
    elm.style.bottom = caculatorDistance(getRectangle(box, 'top'))
    elm.style.right = caculatorDistance(getRectangle(box, 'left'))
  } else if (rotation.value % 360 === 270) {
    elm.style.height = caculatorDistance(getRectangle(box, 'width'))
    elm.style.width = caculatorDistance(getRectangle(box, 'height'))
    elm.style.left = caculatorDistance(getRectangle(box, 'top'))
    elm.style.bottom = caculatorDistance(getRectangle(box, 'left'))
  }
}
const tagLabelToPage = (boxInfos: number[][][], pageNum: number) => {
  const listActivesRemove = document.querySelectorAll('.box-label')
  listActivesRemove.forEach((element) => {
    element.remove()
  })
  const pElement = document.createElement('p')
  const elementPage = document.getElementById('page-' + (pageNum + 1)) as HTMLElement
  if (boxInfos?.length > 0) {
    boxInfos.forEach((boxInfo, index) => {
      pElement.className = 'box-label'
      renderElementByRotation(pElement, boxInfo)
      // pElement.style.width = caculatorDistance(getRectangle(boxInfo, 'width'))
      // pElement.style.height = caculatorDistance(getRectangle(boxInfo, 'height'))
      // pElement.style.top = caculatorDistance(getRectangle(boxInfo, 'top'))
      // pElement.style.left = caculatorDistance(getRectangle(boxInfo, 'left'))
      pElement.style.backgroundColor = 'rgba(240, 91, 91, 0.3) '
      pElement.style.border = '1px solid #e03'
      pElement.style.position = 'absolute'
      if (elementPage) elementPage.appendChild(pElement)
      if (index === 0) {
        const elementScrollTo = elementPage ?? pElement
        scrollToElement(elementScrollTo)
      }
    })
  } else scrollToElement(elementPage)
}
const scrollToElement = (elm: HTMLElement | null, mode: ScrollBehavior = 'smooth') => {
  if (elm) {
    isScrolling.value = true
    elm.scrollIntoView({ behavior: mode })
    updateObserver()
  }
}
const goToPageView = (page: number, mode: ScrollBehavior = 'smooth') => {
  const elementPage = document.getElementById('page-' + (page + 1))
  scrollToElement(elementPage, mode)
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
const goBackPage = debounce(() => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
    const elementPage = document.getElementById('page-' + currentPage.value)
    scrollToElement(elementPage)
  }
}, 100)
const goNextPage = debounce(() => {
  if (currentPage.value < pages.value) {
    currentPage.value += 1
    const elementPage = document.getElementById('page-' + currentPage.value)
    scrollToElement(elementPage)
  }
}, 100)
const observer = ref<IntersectionObserver | null>(null)
// Observe the element to scroll into view
const initializeObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // When element scrolls into view
          isScrolling.value = false
        }
      })
    },
    {
      // element must appear to be considered complete scroll
      threshold: 0.92
    }
  )
  const elementPage = document.getElementById('page-' + currentPage.value)
  if (elementPage && observer.value) {
    observer.value.observe(elementPage)
  }
}
const updateObserver = () => {
  initializeObserver()
}
onMounted(() => {
  initializeObserver()
})
onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
  <div class="flex justify-between my-2 pdf-view-component">
    {{ rotation }}
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
    <div class="flex items-center justify-center gap-[5px] mr-[10px]">
      Trang
      <el-icon
        size="16"
        class="cursor-pointer ml-[6px]"
        @click="goBackPage()"
        :class="{ 'pointer-events-none opacity-50': currentPage <= 1 }"
        ><ArrowUp
      /></el-icon>
      <el-input
        v-model="currentPage"
        class="input-go-page w-[40px]"
        type="number"
        :min="1"
        :max="pages"
        @blur="goToPageView(Number(currentPage) - 1, 'auto')"
        @keydown.enter="goToPageView(Number(currentPage) - 1)"
      />
      /
      {{ pages }}
      <el-icon size="16" class="cursor-pointer" :class="{ 'pointer-events-none opacity-50': currentPage >= pages }"
        ><ArrowDown @click="goNextPage()"
      /></el-icon>
    </div>
  </div>
  <div class="overflow-auto h-[calc(100%-58px)]" :id="idFullScreen" @scroll="scrollToPage()">
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
<style>
.input-go-page {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
  .el-input__wrapper {
    padding: 1px 6px;
  }
}
</style>

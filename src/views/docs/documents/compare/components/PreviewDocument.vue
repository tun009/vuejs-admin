<script lang="ts" setup>
import ControlSlider from '@/views/extract/components/ControlSlider.vue'
import ExtractOcrLoading from '@/views/extract/components/ExtractOcrLoading.vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps<{
  url?: string
  isLoadingOcr?: boolean
}>()

const emit = defineEmits<{
  (e: 'loaded-data'): void
}>()

const idFullScreen = 'view-pdf'
const scale = ref(1)
const currentPage = ref(1)
const rotation = ref(0)
const { pdf, pages } = usePDF(props.url)
const isScrolling = ref(false)

const onLoadedPDF = () => {
  emit('loaded-data')
}

const observer = ref<IntersectionObserver | null>(null)
const initializeObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isScrolling.value = false
        }
      })
    },
    {
      threshold: 0.92
    }
  )
  const elementPage = document.getElementById('page-' + currentPage.value)
  if (elementPage && observer.value) {
    observer.value.observe(elementPage)
  }
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
  <div class="bg-[#f3f7fd]">
    <div class="flex justify-between my-2 pdf-view-component">
      <ControlSlider
        class="!w-[250px]"
        :scale="scale"
        :id-full-screen="idFullScreen"
        @update:scale="
          (val: number) => {
            scale = val
          }
        "
      />
      <slot name="right-header" />
    </div>
    <div class="overflow-auto scroll-block h-[calc(100vh-212px)] relative" :id="idFullScreen">
      <div v-for="page in pages" :key="page" class="mx-auto relative w-fit">
        <VuePDF
          :id="'page-' + page"
          :pdf="pdf"
          :page="page"
          :scale="scale"
          :rotation="rotation"
          @loaded="onLoadedPDF()"
        >
          <el-skeleton-item variant="image" class="w-full h-[calc(100vh-300px)] mx-auto" />
        </VuePDF>
        <div class="text-center my-2">Trang {{ page }}</div>
      </div>
      <ExtractOcrLoading v-if="isLoadingOcr" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.scroll-block {
  @extend %scrollbar;
}
.page-pdf > div {
  width: fit-content;
}
.custom-input-range {
  accent-color: #7f8b98;
}
</style>

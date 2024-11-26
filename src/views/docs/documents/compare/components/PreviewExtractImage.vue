<template>
  <!-- Hiển thị ảnh cắt -->
  <img v-if="imageData" :src="imageData" alt="Extracted Image" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'

interface Props {
  url: string
  page: number
  bboxes: number[][][]
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  page: 1
})

const getRectangle = (bbox: number[][], style: string): number => {
  if (!bbox?.length) return 0
  const result: { [key: string]: number } = {}
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
  result.width = xmax - xmin
  result.height = ymax - ymin
  result.top = ymin
  result.left = xmin
  if (style === 'top') {
    return result.top
  } else if (style === 'left') {
    return result.left
  } else if (style === 'width') {
    return result.width
  } else if (style === 'height') {
    return result.height
  }
  return 0
}

const imageData = ref<string>('')

const extractImage = async () => {
  const pdf = await pdfjs.getDocument(props.url).promise
  const page = await pdf.getPage(props.page)

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const viewport = page.getViewport({ scale: 1.0 })

  const top = getRectangle(props.bboxes?.[0], 'top') * viewport.height
  const left = getRectangle(props.bboxes?.[0], 'left') * viewport.width
  const width = getRectangle(props.bboxes?.[0], 'width') * viewport.width
  const height = getRectangle(props.bboxes?.[0], 'height') * viewport.height

  canvas.width = width
  canvas.height = height

  const renderContext = {
    canvasContext: context as CanvasRenderingContext2D,
    viewport: page.getViewport({ scale: 1 }),
    transform: [1, 0, 0, 1, -left, -top]
  }

  await page.render(renderContext).promise

  imageData.value = canvas.toDataURL('image/png')
}

onMounted(() => {
  extractImage()
})
</script>

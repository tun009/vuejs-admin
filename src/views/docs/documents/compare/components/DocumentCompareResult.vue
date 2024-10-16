<script lang="ts" setup>
import EIBList from '@/components/common/EIBList.vue'
import Table from '@/components/common/EIBTable.vue'
import { DocumentCompareResultModel } from '@/mocks/document'
import { debounce } from 'lodash-es'
import { onMounted, ref } from 'vue'
import MultipleLaguageResult from './MultipleLaguageResult.vue'

interface Props {
  conditionSelect: number
  configs: DocumentCompareResultModel[]
}

interface Emits {
  (event: 'update:condition', condition: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const scrollBlock = ref<HTMLElement | null>(null)

const onScroll = debounce(() => {
  checkElementsInView()
}, 50)

const checkElementsInView = () => {
  const children = scrollBlock.value?.children

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement
      const rect = child.getBoundingClientRect()
      const parentRect = scrollBlock.value!.getBoundingClientRect()

      if (rect.bottom > parentRect.top && rect.top < parentRect.bottom) {
        if (props.conditionSelect === i) return
        emits('update:condition', i)
      }
    }
  }
}

onMounted(() => {})
</script>

<template>
  <div
    class="flex flex-col gap-6 pl-2 mt-3 h-[calc(100vh_-_200px)] overflow-y-auto scroll-block"
    ref="scrollBlock"
    @scroll="onScroll"
  >
    <div v-for="(compareResult, index) in configs" :key="index" class="relative" :id="`document-compare-${index}`">
      <div class="c-text-title-primary sticky top-0 py-2 dark:bg-[#121212] bg-white shadow-transparent z-[5]">
        {{ index + 1 }}. {{ compareResult?.label }}
      </div>
      <div class="w-full h-[1px] bg-[#ebebeb] mt-2 mb-4" />
      <div v-for="(child, idx) in compareResult?.childrens" :key="idx">
        <p v-if="child?.label" class="my-3 font-semibold text-base">{{ `${index + 1}.${idx + 1} ` + child.label }}</p>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-2" v-for="(block, i) in child?.blocks" :key="i">
            <template v-if="!block.type">
              <span class="c-text-des">{{ block?.label }}</span>
              <p class="text-base">{{ block?.value }}</p>
            </template>
            <template v-else-if="block?.type === 'html'">
              <span class="c-text-des">{{ block?.label }}</span>
              <div class="text-base" v-html="block?.value" />
            </template>
            <template v-else-if="block?.type === 'table'">
              <span class="c-text-des">{{ block?.label }}</span>
              <Table
                :column-configs="block.columnConfigs"
                :data="block?.dataTable"
                hidden-checked
                hidden-pagination
                height="unset"
              />
            </template>
            <template v-else-if="block?.type === 'img'">
              <span class="c-text-des">{{ block?.label }}</span>
              <el-image :src="block?.src ?? ''" class="h-40 w-auto" fit="contain" loading="lazy" alt="" />
            </template>
            <template v-else-if="block?.type === 'list'">
              <span class="c-text-des">{{ block?.label }}</span>
              <EIBList :data="block?.list ?? []" />
            </template>
          </div>
        </div>
        <MultipleLaguageResult :result="child.result" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.scroll-block {
  @extend %scrollbar;
}

.el-image {
  :deep(.el-image__inner) {
    width: fit-content;
  }
}
</style>

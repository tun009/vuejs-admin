<script lang="ts" setup>
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBList from '@/components/common/EIBList.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { DocumentCompareResultModel } from '@/mocks/document'
import { Plus } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { ref } from 'vue'
import AddCompareContentForm from './AddCompareContentForm.vue'
import MultipleLaguageResult from './MultipleLaguageResult.vue'
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer.vue'

interface Props {
  conditionSelect: number
  configs: DocumentCompareResultModel[]
}

interface Emits {
  (event: 'update:condition', condition: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const addCompareContentFormRef = ref<InstanceType<typeof AddCompareContentForm>>()
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
</script>

<template>
  <EIBDialog
    title="Bổ sung nội dung đối sánh"
    v-model="dialogVisible"
    :loading="loadingConfirm"
    @on-confirm="addCompareContentFormRef?.onConfirm"
  >
    <AddCompareContentForm
      ref="addCompareContentFormRef"
      @update:loading="(loading: boolean) => (loadingConfirm = loading)"
      @update:visible="(visible: boolean) => (dialogVisible = visible)"
    />
  </EIBDialog>
  <div
    class="flex flex-col gap-6 px-2 mt-3 h-[calc(100vh_-_200px)] overflow-y-auto scroll-block"
    ref="scrollBlock"
    @scroll="onScroll"
  >
    <div v-for="(compareResult, index) in configs" :key="index" class="relative" :id="`document-compare-${index}`">
      <div
        class="c-text-title-primary sticky top-0 py-2 dark:bg-[#121212] bg-white shadow-transparent z-[5] flex justify-between"
      >
        <span>{{ index + 1 }}. {{ compareResult?.label }}</span>
        <el-button :icon="Plus" color="#005d98" plain @click="dialogVisible = true" />
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
              <SafeHtmlRenderer class="text-base" :html="block?.value ?? ''" />
            </template>
            <template v-else-if="block?.type === 'table'">
              <span class="c-text-des">{{ block?.label }}</span>
              <EIBTable
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

<style lang="scss">
@import '@/styles/mixins.scss';

.scroll-block {
  @extend %scrollbar;
}

.el-image__inner {
  width: fit-content;
}
</style>

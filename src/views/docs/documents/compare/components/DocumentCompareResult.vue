<script lang="ts" setup>
import EIBDialog from '@/components/common/EIBDialog.vue'
// import EIBList from '@/components/common/EIBList.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { useUserStore } from '@/store/modules/user'
import { Plus } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { ref } from 'vue'
import AddCompareContentForm from './AddCompareContentForm.vue'
// import MultipleLaguageResult from './MultipleLaguageResult.vue'
import { CompareReasonResultModel, DocumentCompareModel } from '@/@types/pages/docs/documents'
import { createColumnConfigs } from '@/utils/common'

interface Props {
  conditionSelect: number
  configs: DocumentCompareModel[]
}

interface Emits {
  (event: 'update:condition', condition: number): void
  (event: 'scroll-by-index', index: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { isViewer } = useUserStore()

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

const getCompareOn = (reasons: CompareReasonResultModel[]): string[] => {
  let result: string[] = []
  reasons.forEach((r) => {
    result = result.concat(r.compareOn)
  })
  return result
}
</script>

<template>
  <EIBDialog
    :title="$t('docs.compare.addCompareContent')"
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
        @click.stop="() => emits('scroll-by-index', index)"
        class="c-text-title-primary cursor-pointer sticky top-0 py-2 dark:bg-[#121212] bg-white shadow-transparent z-[5] flex justify-between"
      >
        <span>{{ compareResult?.title }}</span>
        <el-button v-if="!isViewer" :icon="Plus" color="#005d98" plain @click="dialogVisible = true" />
      </div>
      <div class="w-full h-[1px] bg-[#ebebeb] mt-2 mb-4" />
      <div v-for="(child, idx) in Object.keys(compareResult.comparisonResults)" :key="idx">
        <p v-if="Object.keys(compareResult.comparisonResults).length > 1" class="my-3 font-semibold text-base">
          {{ compareResult.comparisonResults?.[child]?.title }}
        </p>
        <div class="flex flex-col gap-3">
          <div
            class="flex flex-col gap-2"
            v-for="(block, i) in compareResult.comparisonResults?.[child]?.comparisonInputResults"
            :key="i"
          >
            <span class="c-text-des">{{ block?.title }}</span>
            <div v-for="(v, v_i) in block.comparisonResultInputValues" :key="v_i">
              <template v-if="v?.type === 'table' && Array.isArray(v?.value)">
                <EIBTable
                  :column-configs="createColumnConfigs(v?.value?.[0])"
                  :data="v?.value"
                  hidden-checked
                  hidden-pagination
                  height="unset"
                />
              </template>
              <template v-else-if="v?.type === 'image' && typeof v?.value === 'string'">
                <el-image :src="v?.value ?? ''" class="h-40 w-auto" fit="contain" loading="lazy" alt="" />
              </template>
              <!-- <template v-else-if="v?.type === 'list'">
                <EIBList :data="v?.list ?? []" />
              </template> -->
              <template v-else>
                <p class="text-base">
                  {{ v?.prefixValue ? `${v?.prefixValue}: ` : ''
                  }}<span
                    :class="{
                      'text-[#c92a2a]': getCompareOn(
                        compareResult.comparisonResults?.[child]?.comparisonReasonResults
                      )?.includes(v?.key)
                    }"
                    >{{ v?.value }}</span
                  >
                </p>
              </template>
            </div>
          </div>
        </div>
        <!-- <MultipleLaguageResult :result="compareResult.comparisonResults?.[child]" /> -->
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

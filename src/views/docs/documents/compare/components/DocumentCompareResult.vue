<script lang="ts" setup>
// import EIBList from '@/components/common/EIBList.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { useUserStore } from '@/store/modules/user'
import { Plus } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { ref } from 'vue'
import AddCompareContentForm from './AddCompareContentForm.vue'
// import MultipleLaguageResult from './MultipleLaguageResult.vue'
import { CompareReasonResultModel, DocumentCompareModel, DocumentResultEnum } from '@/@types/pages/docs/documents'
import { convertFileUrl, createColumnConfigs } from '@/utils/common'
import MultipleLaguageResult from './MultipleLaguageResult.vue'
import PreviewExtractImage from './PreviewExtractImage.vue'
import { RuleModel } from '@/@types/pages/rules'
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'

interface Props {
  conditionSelect: number
  categories: RuleModel[]
  rules: RuleModel[]
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

const convertTableDataCompare = (compareResult: DocumentCompareModel) => {
  const response = compareResult.comparisonRowResults.map((c) => {
    const result: { [key: string]: string | number } = {
      stt: c.stt,
      fieldName: c.fieldName
    }
    c.comparisonCellResults.map((d) => {
      if (typeof d.value === 'string') {
        result[d.doc] = d.value
      } else {
        result[d.doc] = d.value.join(', ')
      }
    })
    return result
  })
  return response
}

const convertTableDataCompareError = (compareResult: DocumentCompareModel) => {
  const response: { key: string; stt: number }[] = []
  compareResult.comparisonRowResults.forEach((c) => {
    c.comparisonCellResults.forEach((d) => {
      if (d.comparisonResult.status === DocumentResultEnum.DISCREPANCY) {
        response.push({
          key: d.doc,
          stt: c.stt
        })
      }
    })
  })
  return response
}
</script>

<template>
  <EIBDrawer size="100%" title="docs.document.updateDocument" v-model="dialogVisible" v-if="dialogVisible">
    <template #default>
      <AddCompareContentForm
        ref="addCompareContentFormRef"
        @update:loading="(loading: boolean) => (loadingConfirm = loading)"
        @update:visible="(visible: boolean) => (dialogVisible = visible)"
      />
    </template>
  </EIBDrawer>
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
        <el-button
          v-if="!isViewer && (compareResult?.title?.includes('46A') || compareResult?.title?.includes('47A'))"
          :icon="Plus"
          color="#005d98"
          plain
          @click="dialogVisible = true"
        />
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
                  :column-configs="createColumnConfigs(v?.value?.[0]) ?? {}"
                  :data="v?.value"
                  hidden-checked
                  hidden-pagination
                  height="unset"
                />
              </template>
              <template v-else-if="v?.type === 'image' && !Array.isArray(v?.value) && typeof v?.value !== 'string'">
                <PreviewExtractImage
                  v-if="v?.value?.raw_file"
                  :url="convertFileUrl(v?.value?.raw_file)"
                  :page="v?.value?.page_id + 1"
                  :bboxes="v?.value?.bboxes ?? []"
                />
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
        <MultipleLaguageResult
          :categories="categories"
          :rules="rules"
          :status="compareResult.comparisonResults?.[child]?.status"
          :result="compareResult.comparisonResults?.[child]?.comparisonReasonResults"
        />
      </div>
      <EIBTable
        v-if="compareResult.comparisonRowResults.length"
        :column-configs="createColumnConfigs(convertTableDataCompare(compareResult)?.[0]) ?? {}"
        :data="convertTableDataCompare(compareResult)"
        hidden-checked
        hidden-pagination
        height="unset"
      >
        <template #fieldName="{ row }">
          <SafeHtmlRenderer :html="row?.fieldName?.replace(/\n/g, '<br>')" />
        </template>
        <template v-for="(c, i) in convertTableDataCompareError(compareResult)" #[c?.key]="{ row, index }" :key="i">
          <span :class="{ 'text-red-500': c.stt === index + 1 }">{{ row?.[c.key] }}</span>
        </template>
      </EIBTable>
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

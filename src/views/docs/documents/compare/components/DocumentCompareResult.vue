<script lang="ts" setup>
import { ColumnConfigModel } from '@/@types/common'
import {
  ComparisonResultModel,
  CompareReasonResultModel,
  DocumentCompareModel,
  DocumentKeyEnum,
  DocumentResultEnum,
  draftCustomSortTable,
  invoiceCustomSortTable,
  xtctCustomSortTable
} from '@/@types/pages/docs/documents'
import { RuleModel } from '@/@types/pages/rules'
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { removeAccentsAndReplaceSpaces } from '@/utils'
import { convertFileUrl, createColumnConfigs, customSort, groupByKey, withDefaultString } from '@/utils/common'
import { Plus } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AddCompareContentForm from './AddCompareContentForm.vue'
import MultipleLanguageResult from './MultipleLanguageResult.vue'
import MultipleLanguageResultSimple from './MultipleLanguageResultSimple.vue'
import PreviewExtractImage from './PreviewExtractImage.vue'

interface Props {
  conditionSelect: number
  categories: RuleModel[]
  rules: RuleModel[]
  configs: DocumentCompareModel[]
  isHavePermission?: boolean
}

interface Emits {
  (event: 'update:condition', condition: number): void
  (event: 'scroll-by-index', index: number): void
  (event: 'refresh'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const route = useRoute()
const documentType = ref<DocumentKeyEnum>((route.query?.type as DocumentKeyEnum) ?? DocumentKeyEnum.INVOICE)

const dialogVisible = ref(false)
const scrollBlock = ref<HTMLElement | null>(null)
const comparisonUndefinedId = ref(0)
const is47A = ref(false)

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

const convertTableDataCompare = (compareResult: DocumentCompareModel | ComparisonResultModel) => {
  const response = compareResult.comparisonRowResults.map((c) => {
    const result: { [key: string]: string | number } = {
      stt: c.stt,
      fieldName: c.fieldName
    }
    c.comparisonCellResults.forEach((d) => {
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

const handleAddRule4647A = (id: number, _is47A: boolean) => {
  if (!id) return
  is47A.value = _is47A
  comparisonUndefinedId.value = id
  dialogVisible.value = true
}

const convertTableDataCompareError = (compareResult: DocumentCompareModel | ComparisonResultModel) => {
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

const convertTableDataCompareErrorResults = (compareResult: DocumentCompareModel) => {
  let response: CompareReasonResultModel[] = []
  compareResult.comparisonRowResults.forEach((c) => {
    c.comparisonCellResults.forEach((d) => {
      if (d.comparisonResult.status === DocumentResultEnum.DISCREPANCY) {
        response = response.concat(d.comparisonResult.comparisonReasonResults)
      }
    })
  })
  return response
}

const convertDataTableOriginalCopy = (data: ColumnConfigModel[]): ColumnConfigModel[] => {
  const keysMapping = data.map((c) => removeAccentsAndReplaceSpaces(c.field))
  if (!keysMapping.includes('ban_sao(bank)')) {
    if (keysMapping.includes('name_of_goods')) {
      const nameOfGoods = data.find((item) => item.field === 'Name of goods')
      if (nameOfGoods) {
        const sttIndex = data.findIndex((item) => item.field === 'STT')

        if (sttIndex !== -1) {
          data.splice(data.indexOf(nameOfGoods), 1)
          data.splice(sttIndex + 1, 0, nameOfGoods)
        }
      }
    } else if (keysMapping.includes('item_size')) {
      data = data.filter(
        (item) => item.field !== 'item_quantity' && item.field !== 'item_amount' && item.field !== 'item_unit_price'
      )
    }
    return data
  }

  const result: Array<ColumnConfigModel> = []

  data.forEach((item) => {
    if (item.field === 'Name') {
      result.push({
        field: item.field,
        label: 'Tên chứng từ',
        minWidth: item.minWidth
      })
    } else if (item.field.includes('Bản sao') || item.field.includes('Bản gốc')) {
      const groupLabel = item.field.includes('khách') ? 'Phần giao của Khách hàng' : 'Phần nhận của ngân hàng'

      let group = result.find((r) => r.label === groupLabel)
      if (!group) {
        group = {
          label: groupLabel,
          field: '',
          columns: []
        }
        result.push(group)
      }

      group.columns?.push({
        field: item.field,
        label: item.label.includes('Bản sao') ? 'Bản sao' : 'Bản gốc',
        minWidth: item.minWidth
      })
    } else {
      result.push(item)
    }
  })

  const others = result.filter(
    (item) => item.label !== 'Phần giao của Khách hàng' && item.label !== 'Phần nhận của ngân hàng'
  )
  const groups = result.filter(
    (item) => item.label === 'Phần giao của Khách hàng' || item.label === 'Phần nhận của ngân hàng'
  )

  groups.sort((a, b) => {
    if (a.label === 'Phần giao của Khách hàng') return -1
    if (b.label === 'Phần giao của Khách hàng') return 1
    if (a.label === 'Phần nhận của ngân hàng') return 1
    if (b.label === 'Phần nhận của ngân hàng') return -1
    return 0
  })

  groups.forEach((group) => {
    if (group.columns) {
      group.columns.sort((a, b) => {
        if (a.label === 'Bản gốc') return -1
        if (b.label === 'Bản gốc') return 1
        return 0
      })
    }
  })

  return [...others, ...groups]
}

const customSortTable = computed((): string[] => {
  if (documentType.value === DocumentKeyEnum.INVOICE) return invoiceCustomSortTable
  if (documentType.value === DocumentKeyEnum.DRAFT) return draftCustomSortTable
  if (documentType.value === DocumentKeyEnum.PRESENT_DOC) return xtctCustomSortTable
  return invoiceCustomSortTable
})
</script>

<template>
  <EIBDrawer size="75%" title="docs.document.updateDocument" v-model="dialogVisible" v-if="dialogVisible">
    <template #default>
      <AddCompareContentForm
        ref="addCompareContentFormRef"
        @update:visible="(visible: boolean) => (dialogVisible = visible)"
        :comparison-undefined-id="comparisonUndefinedId"
        :is47-a="is47A"
        @refresh="emits('refresh')"
      />
    </template>
  </EIBDrawer>
  <div
    class="flex flex-col gap-6 mt-3 h-[calc(100vh_-_160px)] overflow-y-auto scroll-block"
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
          v-if="isHavePermission && (compareResult?.title?.includes('46A') || compareResult?.title?.includes('47A'))"
          :icon="Plus"
          color="#005d98"
          plain
          @click="handleAddRule4647A(compareResult.undefinedResults?.[0]?.id, compareResult?.title?.includes('47A'))"
        />
      </div>
      <div class="w-full h-[1px] bg-[#ebebeb] mt-2 mb-4" />
      <div v-for="(child, idx) in Object.keys(compareResult?.comparisonResults ?? {})" :key="idx">
        <p v-if="Object.keys(compareResult?.comparisonResults)?.length > 1" class="my-3 font-semibold text-base">
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
              <template v-if="v?.type === 'table' && Array.isArray(v?.value) && typeof v?.value?.[0] !== 'string'">
                <EIBTable
                  :column-configs="
                    customSort(
                      convertDataTableOriginalCopy(createColumnConfigs(v?.value?.[0])),
                      'field',
                      customSortTable
                    ) ?? {}
                  "
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
              <template v-else>
                <p class="text-sm">
                  {{ v?.prefixValue ? `${v?.prefixValue}: ` : ''
                  }}<span
                    :class="{
                      'text-[#c92a2a]': getCompareOn(
                        compareResult.comparisonResults?.[child]?.comparisonReasonResults
                      )?.includes(v?.key)
                    }"
                    >{{
                      Array.isArray(v?.value)
                        ? withDefaultString(v?.value?.join(', '))
                        : withDefaultString(v?.value as string)
                    }}</span
                  >
                </p>
              </template>
            </div>
          </div>
        </div>
        <div v-if="compareResult.comparisonResults?.[child]?.comparisonRowResults.length">
          <EIBTable
            :column-configs="
              customSort(
                createColumnConfigs(convertTableDataCompare(compareResult.comparisonResults?.[child])?.[0]),
                'field',
                customSortTable
              ) ?? {}
            "
            :data="convertTableDataCompare(compareResult.comparisonResults?.[child])"
            hidden-checked
            hidden-pagination
            height="unset"
          >
            <template #fieldName="{ row }">
              <SafeHtmlRenderer :html="row?.fieldName?.replace(/\n/g, '<br>')" />
            </template>
            <template
              v-for="(c, i) in groupByKey(
                convertTableDataCompareError(compareResult.comparisonResults?.[child]),
                'key'
              )"
              #[c?.key]="{ row, index }"
              :key="i"
            >
              <span :class="{ 'text-red-500': c.stt.includes(index + 1) }">{{ row?.[c.key] }}</span>
            </template>
          </EIBTable>
        </div>
        <MultipleLanguageResult
          :categories="categories"
          :rules="rules"
          :is-have-permission="isHavePermission"
          :comparisonResultId="compareResult.comparisonResults?.[child]?.id"
          :status="compareResult.comparisonResults?.[child]?.status"
          :result="compareResult.comparisonResults?.[child]?.comparisonReasonResults"
          @refresh="emits('refresh')"
        />
      </div>
      <div class="flex flex-col gap-3" v-if="compareResult.comparisonRowResults.length">
        <EIBTable
          :column-configs="
            customSort(createColumnConfigs(convertTableDataCompare(compareResult)?.[0]), 'field', customSortTable) ?? {}
          "
          :data="convertTableDataCompare(compareResult)"
          hidden-checked
          hidden-pagination
          height="unset"
        >
          <template #fieldName="{ row }">
            <SafeHtmlRenderer :html="row?.fieldName?.replace(/\n/g, '<br>')" />
          </template>
          <template
            v-for="(c, i) in groupByKey(convertTableDataCompareError(compareResult), 'key')"
            #[c?.key]="{ row, index }"
            :key="i"
          >
            <span :class="{ 'text-red-500': c.stt.includes(index + 1) }">{{ row?.[c.key] }}</span>
          </template>
        </EIBTable>

        <MultipleLanguageResult
          type="table"
          :categories="categories"
          :rules="rules"
          :comparisonResultId="compareResult.id"
          :status="compareResult.status"
          :is-have-permission="isHavePermission"
          @refresh="emits('refresh')"
          :result="convertTableDataCompareErrorResults(compareResult)"
        />
      </div>
      <div>
        <div v-for="(block, i) in compareResult.undefinedResults" :key="i" class="flex flex-col gap-3">
          <div class="flex flex-col gap-2">
            <span class="c-text-des">{{ block?.inputField }}</span>
            <SafeHtmlRenderer class="text-sm" :html="block?.inputValue" />
          </div>
          <div class="flex flex-col gap-3" v-for="(d, di) in block.requirements" :key="di">
            <div class="flex flex-col gap-2">
              <span class="c-text-des">Requirement</span>
              <SafeHtmlRenderer class="text-sm" :html="d?.requirement" />
            </div>
            <MultipleLanguageResultSimple
              :comparisonUndefinedId="block?.id"
              :requirement="d"
              :is-have-permission="isHavePermission"
              @refresh="emits('refresh')"
            />
          </div>
        </div>
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

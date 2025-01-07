<script lang="ts" setup>
import { SelectOptionModel } from '@/@types/common'
import {
  CompareReasonOnlyResultModel,
  CompareReasonResultModel,
  DocumentResultEnum,
  documentResultValidOptions
} from '@/@types/pages/docs/documents'
import {
  DocumentComparisonResultReasonModel,
  UpdateDocumentCompareResultRequestModel,
  UpdateDocumentCompareResultTableRequestModel
} from '@/@types/pages/docs/documents/services/DocumentRequest'
import { RuleModel, reasonDefault } from '@/@types/pages/rules'
import {
  translateEnglishToVietnamese,
  updateCompareResult,
  updateCompareResultTable
} from '@/api/docs/document/compare'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import EIBTextareaAutoComplete from '@/components/common/EIBTextareaAutoComplete.vue'
import { getTextFromHtml, removeDuplicateItemInArray } from '@/utils/common'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { computed, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import SaveDictionaryForm from './SaveDictionaryForm.vue'

interface Props {
  categories: RuleModel[]
  rules: RuleModel[]
  status: DocumentResultEnum
  result: CompareReasonResultModel[]
  comparisonResultId: number
  type?: 'simple' | 'table'
  isHavePermission?: boolean
}

interface Emits {
  (event: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'simple'
})
const emits = defineEmits<Emits>()

const { t } = useI18n()

const lawReasonMapping = computed(() => {
  const result: CompareReasonOnlyResultModel = {
    laws: [],
    reasons: [],
    lawIds: [],
    reasonId: []
  }
  props.result.forEach((r) => {
    result.laws = [...result.laws, ...(r.laws ?? [])]
    result.reasons = [...result.reasons, ...(r.reasons ?? [])]
    result.lawIds = [...result.lawIds, ...(r.lawIds ?? [])]
    result.reasonId = [...result.reasonId, ...(r.reasonId ?? [])]
  })
  return result
})

const defaultLawIds = computed(() => {
  return lawReasonMapping.value.laws.map((l) => l.code)
})

let defaultValue = {
  status: props.status ?? DocumentResultEnum.COMPLY,
  ...lawReasonMapping.value
}

const reasonListMappingDefault = computed(() => {
  const temp = lawReasonMapping.value.reasons.map((r) => ({
    ...r,
    en: getTextFromHtml(r.en),
    defaultValue: getTextFromHtml(r.en)
  }))
  return temp
})

const reasonList = ref<RuleModel[]>(reasonListMappingDefault.value)

const isEdit = ref(false)
const loading = ref(false)
const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const documentResultFormRef = ref<FormInstance | null>()
const documentResultFormData = ref({ ...defaultValue, lawIds: defaultLawIds.value })
const saveDictionaryFormRef = ref<InstanceType<typeof SaveDictionaryForm>>()

const documentResultFormRules: FormRules = {}

const handleClose = () => {
  documentResultFormData.value = { ...defaultValue }
  reasonList.value = [...reasonListMappingDefault.value]
  isEdit.value = false
}

const handleAddRule = () => {
  reasonList.value = [...reasonList.value, { ...reasonDefault, isNew: true }]
}

const handleRemoveRule = (i: number) => {
  reasonList.value = [...reasonList.value].filter((_, index) => i !== index)
}

const updateRuleValue = ({ index, value }: { index: number; value: Partial<RuleModel> }) => {
  const newReasons = [...reasonList.value].map((r, i) => {
    if (i !== index) return r
    return { ...r, ...value }
  })
  reasonList.value = [...newReasons]
}

const handleTranslate = async (i: number) => {
  try {
    const response = await translateEnglishToVietnamese({ content: reasonList.value[i].en })
    updateRuleValue({ index: i, value: { vi: response?.data } })
  } catch (error) {
    console.error(error)
  }
}

const handleSaveDictionary = (i: number) => {
  dialogVisible.value = true
  setTimeout(() => {
    saveDictionaryFormRef.value?.initComponent(reasonList.value[i])
  }, 100)
}

const handleUpdateCompareResult = () => {
  /* NOSONAR */
  documentResultFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      try {
        console.log(reasonList)
        const lawIds = documentResultFormData.value.lawIds.filter((d) => !lawReasonMapping.value.lawIds.includes(d))
        const laws = props.rules.filter((r) => lawIds.includes(r.code))
        const reasons = reasonList.value.filter((r) => r?.isNew).map((c) => toRaw(c))
        const reasonListIds = reasonList.value.map((r) => r.id)
        const initialReasons: DocumentComparisonResultReasonModel[] = props.result.map((p) => {
          const exactlyReasons = p.reasons.filter((r) => reasonListIds.includes(r.id) && !r?.isNew)
          const reasons = exactlyReasons.map((r) => {
            const newReason = reasonList.value.find((i) => i.id === r.id)
            return {
              code: r.code,
              en: newReason?.en ?? '',
              vi: newReason?.vi ?? ''
            }
          })
          const laws = p.laws.filter((r) => documentResultFormData.value.lawIds.includes(r.code))
          return { comparisonResultReasonId: p.id, reasons, laws }
        })
        if (props.type === 'simple') {
          const reasonMore: DocumentComparisonResultReasonModel = {
            comparisonResultReasonId: null,
            reasons,
            laws
          }
          const payload: UpdateDocumentCompareResultRequestModel = {
            comparisonResultId: props.comparisonResultId,
            status: documentResultFormData.value.status,
            comparisonResultReasons:
              documentResultFormData.value.status === DocumentResultEnum.COMPLY ? [] : [...initialReasons, reasonMore]
          }
          const exactlyReasons = payload.comparisonResultReasons.filter((c) => c.laws.length || c.reasons.length)
          const exactlyPayload: UpdateDocumentCompareResultRequestModel = {
            ...payload,
            comparisonResultReasons: exactlyReasons
          }
          await updateCompareResult(exactlyPayload)
          reasonList.value = reasonList.value.map((c) => ({ ...c, isNew: false }))
        } else {
          const reasonMore: DocumentComparisonResultReasonModel = {
            comparisonResultReasonId: null,
            reasons,
            laws
          }
          const payload: UpdateDocumentCompareResultTableRequestModel = {
            comparisonId: props.comparisonResultId,
            status: documentResultFormData.value.status,
            reasons:
              documentResultFormData.value.status === DocumentResultEnum.COMPLY ? [] : [...initialReasons, reasonMore]
          }
          const exactlyReasons = payload.reasons.filter((c) => c.laws.length || c.reasons.length)
          const exactlyPayload: UpdateDocumentCompareResultTableRequestModel = {
            ...payload,
            reasons: exactlyReasons
          }
          await updateCompareResultTable(exactlyPayload)
          reasonList.value = reasonList.value.map((c) => ({ ...c, isNew: false }))
        }
        if (documentResultFormData.value.status === DocumentResultEnum.COMPLY) {
          reasonList.value = []
        }
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.updateSuccess')
        })
        isEdit.value = false
        defaultValue = { ...documentResultFormData.value }
        emits('refresh')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    } else {
      console.error('Form validation failed', fields)
    }
  })
}

const concatLawContents = (laws: RuleModel[]) => {
  const exactLaws = removeDuplicateItemInArray(laws, 'code')
  let result: string = ''
  exactLaws.forEach((l, i) => {
    if (!i) {
      result += l.en
      return
    }
    result += '<br />' + l.en
  })
  return result
}

const suggestionMapping = (arrs: RuleModel[]) => {
  return arrs.map((r) => ({
    id: r.id,
    value: getTextFromHtml(r.en),
    code: r.code
  }))
}

const ruleMapping = computed((): SelectOptionModel[] => {
  return props.rules.map((r) => ({
    label: getTextFromHtml(r.en),
    value: r.code
  }))
})

const disabledSaveButton = computed(() => {
  if (defaultValue.status === DocumentResultEnum.COMPLY && defaultValue.status === documentResultFormData.value.status)
    return true
  if (reasonListMappingDefault.value.every((r) => !r.en) && reasonList.value.every((r) => !r.en)) return true
  return false
})
</script>

<template>
  <EIBDialog
    :title="$t('docs.compare.editInvalidCategory')"
    v-model="dialogVisible"
    :loading="loadingConfirm"
    @on-confirm="saveDictionaryFormRef?.onConfirm"
    type="danger"
  >
    <SaveDictionaryForm
      ref="saveDictionaryFormRef"
      @update:loading="(loading: boolean) => (loadingConfirm = loading)"
      @update:visible="(visible: boolean) => (dialogVisible = visible)"
    />
  </EIBDialog>
  <div class="mt-5">
    <div v-if="!isEdit">
      <div class="flex flex-row gap-2 items-center">
        <span class="c-text-des">{{ $t('docs.compare.result') }}</span>
        <SvgIcon v-if="isHavePermission" @click="isEdit = !isEdit" class="w-4 h-4 cursor-pointer" name="edit-pen" />
      </div>
      <div class="flex flex-row gap-10">
        <div class="flex flex-col gap-1 flex-1">
          <span class="c-text-des">{{ $t('docs.compare.english') }}</span>
          <span v-if="props.status === DocumentResultEnum.COMPLY" class="c-text-success">{{
            $t('docs.compare.complied')
          }}</span>
          <div v-else-if="props.status === DocumentResultEnum.DISCREPANCY">
            <div v-if="lawReasonMapping.reasons.length">
              <div
                class="flex flex-row items-start gap-2"
                v-for="(res, index) in lawReasonMapping.reasons"
                :key="index"
              >
                <div class="min-w-1 h-1 w-1 bg-[#e8590c] rounded-sm mt-2" />
                <span class="text-[#e8590c]">{{ getTextFromHtml(res.en) }}</span>
                <el-tooltip
                  placement="top"
                  v-if="lawReasonMapping?.laws?.length && !index"
                  raw-content
                  :content="concatLawContents(lawReasonMapping?.laws)"
                  popper-class="max-w-[580px] !max-h-[112px] overflow-y-auto hidden-scrollbar"
                >
                  <el-icon :size="18" class="cursor-pointer ml-1"><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div v-else>
              <div class="flex flex-row items-start gap-2">
                <div class="min-w-1 h-1 w-1 bg-[#e8590c] rounded-sm mt-2" />
                <span class="text-[#e8590c]">Discrepancy</span>
              </div>
            </div>
          </div>
          <span v-else>{{ $t('docs.compare.na') }}</span>
        </div>
        <div class="flex flex-col gap-1 flex-1">
          <span class="c-text-des">{{ $t('docs.compare.vietnamese') }}</span>
          <span v-if="props.status === DocumentResultEnum.COMPLY" class="c-text-success">{{
            $t('docs.status.valid')
          }}</span>
          <div v-else-if="props.status === DocumentResultEnum.DISCREPANCY">
            <div v-if="lawReasonMapping.reasons.length">
              <div
                class="flex flex-row items-start gap-2"
                v-for="(res, index) in lawReasonMapping.reasons"
                :key="index"
              >
                <div class="min-w-1 h-1 w-1 bg-[#e8590c] rounded-sm mt-2" />
                <span class="text-[#e8590c]">{{ res.vi ? res.vi : 'Bất hợp lệ' }}</span>
              </div>
            </div>
            <div v-else>
              <div class="flex flex-row items-start gap-2">
                <div class="min-w-1 h-1 w-1 bg-[#e8590c] rounded-sm mt-2" />
                <span class="text-[#e8590c]">Bất hợp lệ</span>
              </div>
            </div>
          </div>
          <span v-else>{{ $t('docs.compare.na') }}</span>
        </div>
      </div>
    </div>
    <div
      class="animated-box bg-gray-100 dark:bg-zinc-900 rounded-md shadow-md max-w-[1000px] flex flex-col gap-3"
      :class="{ collapsed: !isEdit }"
    >
      <el-form
        ref="documentResultFormRef"
        :model="documentResultFormData"
        :rules="documentResultFormRules"
        class="flex flex-col gap-1"
      >
        <div class="flex flex-col gap-1">
          <span class="c-text-des">{{ $t('docs.compare.editInformation') }}</span>
          <div class="flex flex-row items-center">
            <span class="min-w-40 text-sm">{{ $t('docs.compare.checkResult') }}</span>
            <EIBSelect
              :options="documentResultValidOptions.slice(0, -1)"
              v-model="documentResultFormData.status"
              hidden-error
            />
          </div>
        </div>
        <div class="flex flex-col gap-1" v-if="documentResultFormData.status === DocumentResultEnum.DISCREPANCY">
          <span class="c-text-des">{{ $t('docs.compare.english_1') }}</span>
          <div class="flex flex-row items-start">
            <span class="min-w-40 text-sm mt-2">{{ $t('docs.compare.reason') }}</span>
            <div class="flex flex-col gap-2 w-full -ml-7">
              <div class="flex flex-row items-center gap-2 w-full" v-for="(r, i) in reasonList" :key="r.id">
                <div class="h-5 w-5 min-w-5">
                  <SvgIcon
                    v-if="i"
                    name="ic-minus-outline"
                    class="!h-5 !w-5 cursor-pointer"
                    @click="() => handleRemoveRule(i)"
                  />
                </div>
                <EIBTextareaAutoComplete
                  v-model="r.en"
                  is-single-line
                  :suggestions="suggestionMapping(categories)"
                  :index="i"
                  @update-value="updateRuleValue"
                  :value-list="reasonList"
                />
                <el-button
                  color="#005d98"
                  plain
                  class="h-[38px]"
                  @click="handleSaveDictionary(i)"
                  :disabled="!r?.code || r.defaultValue === r.en"
                  >{{ $t('docs.compare.saveDictionary') }}</el-button
                >
              </div>
              <el-button color="#005d98" plain class="h-[38px] ml-7 w-60" @click="handleAddRule">{{
                $t('docs.compare.addRule')
              }}</el-button>
            </div>
          </div>
          <div class="flex flex-row items-center">
            <span class="min-w-40 text-sm">{{ $t('docs.compare.ruleEvidence') }}</span>
            <EIBSelect
              :options="ruleMapping"
              v-model="documentResultFormData.lawIds"
              multiple
              hidden-error
              :max-collapse-tags="2"
              popper-class="multiple-language-result"
            />
          </div>
        </div>
        <div class="flex flex-col gap-1" v-if="documentResultFormData.status === DocumentResultEnum.DISCREPANCY">
          <span class="c-text-des">{{ $t('docs.compare.vietnamese_1') }}</span>
          <div class="flex flex-row items-start">
            <span class="min-w-40 text-sm mt-2">{{ $t('docs.compare.reason') }}</span>
            <div class="flex flex-col gap-2 w-full">
              <div class="flex flex-row items-center gap-2 w-full" v-for="(r, i) in reasonList" :key="r.id">
                <EIBTextareaAutoComplete
                  v-model="r.vi"
                  is-single-line
                  :index="i"
                  @update-value="updateRuleValue"
                  :value-list="reasonList"
                />
                <el-button color="#005d98" plain class="h-[38px]" @click="handleTranslate(i)">{{
                  $t('docs.compare.translate')
                }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div class="ml-40">
        <el-button
          :loading="loading"
          :disabled="disabledSaveButton"
          @click.prevent="handleUpdateCompareResult"
          type="primary"
          >{{ $t('button.update') }}</el-button
        >
        <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.animated-box {
  @extend %scrollbar;
  overflow-x: hidden;
  max-height: 500px;
  transition:
    height 0.5s ease,
    opacity 0.5s ease;
  opacity: 1;
  padding: 16px 20px;
}

.collapsed {
  height: 0;
  opacity: 0.5;
  padding: 0;
}
</style>

<style>
.el-select-dropdown__item {
  white-space: unset;
}

.multiple-language-result .el-select__selection .el-tag {
  max-width: 640px !important;
}

.multiple-language-result .el-scrollbar__view.el-select-dropdown__list {
  max-width: 768px !important;
}

.multiple-language-result .el-select-dropdown__item.is-selected::after {
  display: none;
}
</style>

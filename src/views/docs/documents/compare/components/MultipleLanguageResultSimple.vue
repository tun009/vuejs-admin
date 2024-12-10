<script lang="ts" setup>
import {
  DocumentCompareUndefinedRequirementModel,
  DocumentResultEnum,
  documentResultValidOptions
} from '@/@types/pages/docs/documents'
import { updateDocumentCompareUndefined } from '@/api/docs/document/compare'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { getTextFromHtml } from '@/utils/common'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SaveDictionaryForm from './SaveDictionaryForm.vue'

interface Props {
  comparisonUndefinedId: number
  requirement: DocumentCompareUndefinedRequirementModel
  isHavePermission?: boolean
  customClass?: string
}

interface Emits {
  (event: 'refresh'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { t } = useI18n()

const isEdit = ref(false)
const loading = ref(false)
const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const documentResultFormRef = ref<FormInstance | null>()
let defaultValue = {
  reason: props.requirement.reason,
  status: props.requirement.status ?? DocumentResultEnum.NA
}
const documentResultFormData = ref({ ...defaultValue })
const saveDictionaryFormRef = ref<InstanceType<typeof SaveDictionaryForm>>()

const documentResultFormRules: FormRules = {}

const handleClose = () => {
  documentResultFormData.value = {
    reason: props.requirement.reason,
    status: props.requirement.status ?? DocumentResultEnum.NA
  }
  isEdit.value = false
}

const handleUpdateCompareResult = () => {
  documentResultFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      try {
        loading.value = true
        await updateDocumentCompareUndefined({
          reason: documentResultFormData.value.reason,
          status: documentResultFormData.value.status,
          id: props.requirement.id
        })
        defaultValue = {
          reason: documentResultFormData.value.reason,
          status: documentResultFormData.value.status
        }
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.updateSuccess')
        })
        isEdit.value = false
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
  <div class="mb-3" :class="customClass">
    <div v-if="!isEdit">
      <div class="flex flex-row gap-2 items-center">
        <span class="c-text-des">{{ $t('docs.compare.result') }}</span>
        <SvgIcon v-if="isHavePermission" @click="isEdit = !isEdit" class="w-4 h-4 cursor-pointer" name="edit-pen" />
      </div>
      <div class="flex flex-row gap-10">
        <div class="flex flex-col gap-1 flex-1">
          <span class="c-text-des">{{ $t('docs.compare.english') }}</span>
          <span v-if="documentResultFormData.status === DocumentResultEnum.COMPLY" class="c-text-success">{{
            $t('docs.compare.complied')
          }}</span>
          <div v-else-if="documentResultFormData.status === DocumentResultEnum.DISCREPANCY">
            <div class="flex flex-row items-start gap-2">
              <div class="min-w-1 h-1 w-1 bg-[#e8590c] rounded-sm mt-2" />
              <span class="text-[#e8590c]"
                >{{ $t('docs.compare.discrepancy')
                }}{{ documentResultFormData.reason ? ': ' + getTextFromHtml(documentResultFormData.reason) : '' }}</span
              >
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
            <span class="min-w-48 text-sm">{{ $t('docs.compare.checkResult') }}</span>
            <EIBSelect :options="documentResultValidOptions" v-model="documentResultFormData.status" hidden-error />
          </div>
        </div>
        <div class="flex flex-col gap-1" v-if="documentResultFormData.status === DocumentResultEnum.DISCREPANCY">
          <span class="c-text-des">{{ $t('docs.compare.english_1') }}</span>
          <div class="flex flex-row items-start">
            <span class="min-w-48 text-sm mt-2">{{ $t('docs.compare.reason') }}</span>
            <div class="flex flex-col gap-2 w-full">
              <div class="flex flex-row items-center gap-2 w-full">
                <EIBInput name="reason" v-model="documentResultFormData.reason" />
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div class="ml-48">
        <el-button :loading="loading" @click.prevent="handleUpdateCompareResult" type="primary">{{
          $t('button.update')
        }}</el-button>
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

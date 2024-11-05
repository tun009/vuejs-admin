<script lang="ts" setup>
import {
  DocumentResultDataModel,
  documentResultRuleOptions,
  documentResultValidOptions
} from '@/@types/pages/docs/documents'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { useUserStore } from '@/store/modules/user'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SaveDictionaryForm from './SaveDictionaryForm.vue'

interface Props {
  result: DocumentResultDataModel
}

const props = defineProps<Props>()

const { t } = useI18n()
const { isViewer } = useUserStore()

const defaultValue = {
  reasonEn: '',
  reasonVi: '',
  rule: '',
  ...props.result
}

const isEdit = ref(false)
const loading = ref(false)
const loadingRule = ref(false)
const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const documentResultFormRef = ref<FormInstance | null>()
const documentResultFormData = ref<DocumentResultDataModel>({ ...defaultValue })
const saveDictionaryFormRef = ref<InstanceType<typeof SaveDictionaryForm>>()

const documentResultFormRules: FormRules = {
  status: [],
  rule: [],
  reasonEn: [],
  reasonVi: []
}

const handleClose = () => {
  documentResultFormData.value = { ...defaultValue }
  isEdit.value = false
}

const handleUpdateCompareResult = () => {
  documentResultFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.updateSuccess')
        })
        isEdit.value = false
      }, 3000)
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
  <div class="mt-5">
    <div v-if="!isEdit">
      <div class="flex flex-row gap-2 items-center">
        <span class="c-text-des">{{ $t('docs.compare.result') }}</span>
        <SvgIcon v-if="!isViewer" @click="isEdit = !isEdit" class="w-4 h-4 cursor-pointer" name="edit-pen" />
      </div>
      <div class="flex flex-row gap-10">
        <div class="flex flex-col gap-1 flex-1">
          <span class="c-text-des">{{ $t('docs.compare.english') }}</span>
          <span v-if="documentResultFormData.status === 'valid'" class="c-text-success">{{
            $t('docs.compare.complied')
          }}</span>
          <div v-else-if="documentResultFormData.status === 'invalid'" class="flex flex-row items-center gap-2">
            <div class="h-1 w-1 bg-[#e8590c] rounded-sm" />
            <span class="text-[#e8590c]"
              >{{ $t('docs.compare.discrepancy')
              }}{{ documentResultFormData?.reasonEn ? ': ' + documentResultFormData?.reasonEn : '' }}</span
            >
            <el-tooltip placement="top" v-if="documentResultFormData?.rule">
              <el-icon :size="18" class="cursor-pointer ml-1"><InfoFilled /></el-icon>
              <template #content>
                <div class="max-w-96">{{ documentResultFormData?.rule }}</div>
              </template>
            </el-tooltip>
          </div>
          <span v-else>{{ $t('docs.compare.na') }}</span>
        </div>
        <div class="flex flex-col gap-1 flex-1">
          <span class="c-text-des">{{ $t('docs.compare.vietnamese') }}</span>
          <span v-if="documentResultFormData.status === 'valid'" class="c-text-success">{{
            $t('docs.status.valid')
          }}</span>
          <div v-else-if="documentResultFormData.status === 'invalid'" class="flex flex-row items-center gap-2">
            <div class="h-1 w-1 bg-[#e8590c] rounded-sm" />
            <span class="text-[#e8590c]"
              >{{ $t('docs.status.invalid')
              }}{{ documentResultFormData?.reasonVi ? ': ' + documentResultFormData?.reasonVi : '' }}</span
            >
          </div>
          <span v-else>{{ $t('docs.compare.na') }}</span>
        </div>
      </div>
    </div>
    <div
      class="animated-box bg-gray-100 dark:bg-zinc-900 rounded-md shadow-md max-w-[800px] flex flex-col gap-3"
      :class="{ collapsed: !isEdit }"
    >
      <el-form
        ref="documentResultFormRef"
        :model="documentResultFormData"
        :rules="documentResultFormRules"
        @keyup.enter="handleUpdateCompareResult"
        class="flex flex-col gap-1"
      >
        <div class="flex flex-col gap-1">
          <span class="c-text-des">{{ $t('docs.compare.editInformation') }}</span>
          <div class="flex flex-row items-center">
            <span class="min-w-48 text-sm">{{ $t('docs.compare.checkResult') }}</span>
            <EIBSelect :options="documentResultValidOptions" v-model="documentResultFormData.status" hidden-error />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="c-text-des">{{ $t('docs.compare.english_1') }}</span>
          <div class="flex flex-row items-center">
            <span class="min-w-48 text-sm">{{ $t('docs.compare.reason') }}</span>
            <EIBInput name="reasonEn" v-model="documentResultFormData.reasonEn" hidden-error />
            <el-button
              color="#005d98"
              plain
              class="h-[38px] ml-2"
              :loading="loadingRule"
              :disabled="documentResultFormData.reasonEn === (result.reasonEn ?? '')"
              :type="documentResultFormData.reasonEn === (result.reasonEn ?? '') ? 'info' : 'default'"
              @click="dialogVisible = true"
              >{{ $t('docs.compare.saveDictionary') }}</el-button
            >
          </div>
          <div class="flex flex-row items-center">
            <span class="min-w-48 text-sm">{{ $t('docs.compare.ruleEvidence') }}</span>
            <EIBSelect :options="documentResultRuleOptions" v-model="documentResultFormData.rule" hidden-error />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="c-text-des">{{ $t('docs.compare.vietnamese_1') }}</span>
          <div class="flex flex-row items-center">
            <span class="min-w-48 text-sm">{{ $t('docs.compare.reason') }}</span>
            <EIBInput name="reasonVi" v-model="documentResultFormData.reasonVi" hidden-error />
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

<style scoped>
.animated-box {
  overflow: hidden;
  height: 320px;
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

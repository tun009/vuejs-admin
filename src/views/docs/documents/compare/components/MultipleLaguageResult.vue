<script lang="ts" setup>
import {
  DocumentResultDataModel,
  documentResultRuleOptions,
  documentResultValidOptions
} from '@/@types/pages/docs/documents'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { handleComingSoon } from '@/utils/common'
import { ElMessage, FormRules } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  result: DocumentResultDataModel
}

const props = defineProps<Props>()

const { t } = useI18n()

const defaultValue = {
  reasonEn: '',
  reasonVi: '',
  rule: '',
  ...props.result
}

const isEdit = ref(false)
const loading = ref(false)
const loadingRule = ref(false)
const documentResultFormRef = ref()
const documentResultFormData = ref<DocumentResultDataModel>({ ...defaultValue })

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
  documentResultFormRef.value?.validate((valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.createSuccess')
        })
        isEdit.value = false
      }, 3000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}

const handleSaveRule = () => {
  loadingRule.value = true
  setTimeout(() => {
    loadingRule.value = false
    ElMessage({
      showClose: true,
      type: 'success',
      message: t('notification.description.saveSuccess')
    })
  }, 3000)
}
</script>

<template>
  <div class="mt-5">
    <div v-if="!isEdit">
      <div class="flex flex-row gap-2 items-center">
        <span class="c-text-des">Kết quả</span>
        <SvgIcon @click="isEdit = !isEdit" class="w-4 h-4 cursor-pointer" name="edit-pen" />
      </div>
      <div class="flex flex-row gap-10">
        <div class="flex flex-col gap-1 flex-1">
          <span class="c-text-des">Anh</span>
          <span v-if="documentResultFormData.status === 'valid'" class="c-text-success">Complied</span>
          <div v-else-if="documentResultFormData.status === 'invalid'" class="flex flex-row items-center gap-2">
            <div class="h-1 w-1 bg-[#e8590c] rounded-sm" />
            <span class="text-[#e8590c]"
              >Discrepancy{{ documentResultFormData?.reasonEn ? ': ' + documentResultFormData?.reasonEn : '' }}</span
            >
            <el-tooltip placement="top" v-if="documentResultFormData?.rule">
              <el-icon :size="18" class="cursor-pointer ml-1"><InfoFilled /></el-icon>
              <template #content>
                <div class="max-w-96">{{ documentResultFormData?.rule }}</div>
              </template>
            </el-tooltip>
          </div>
          <span v-else>N/A</span>
        </div>
        <div class="flex flex-col gap-1 flex-1">
          <span class="c-text-des">Việt</span>
          <span v-if="documentResultFormData.status === 'valid'" class="c-text-success">Hợp lệ</span>
          <div v-else-if="documentResultFormData.status === 'invalid'" class="flex flex-row items-center gap-2">
            <div class="h-1 w-1 bg-[#e8590c] rounded-sm" />
            <span class="text-[#e8590c]"
              >Bất hợp lệ{{ documentResultFormData?.reasonVi ? ': ' + documentResultFormData?.reasonVi : '' }}</span
            >
          </div>
          <span v-else>N/A</span>
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
        @keyup.enter="handleComingSoon"
        class="flex flex-col gap-1"
      >
        <div class="flex flex-col gap-1">
          <span class="c-text-des">Chỉnh sửa thông tin</span>
          <div class="flex flex-row items-center">
            <span class="min-w-48 text-sm">Kết quả kiểm tra</span>
            <EIBSelect :options="documentResultValidOptions" v-model="documentResultFormData.status" hidden-error />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="c-text-des">Tiếng Anh</span>
          <div class="flex flex-row items-center">
            <span class="min-w-48 text-sm">Lý do</span>
            <EIBInput name="reasonEn" v-model="documentResultFormData.reasonEn" hidden-error />
            <el-button
              color="#005d98"
              plain
              class="h-[38px] ml-2"
              :loading="loadingRule"
              :disabled="documentResultFormData.reasonEn === (result.reasonEn ?? '')"
              :type="documentResultFormData.reasonEn === (result.reasonEn ?? '') ? 'info' : 'default'"
              @click="handleSaveRule"
              >Lưu từ điển</el-button
            >
          </div>
          <div class="flex flex-row items-center">
            <span class="min-w-48 text-sm">Dẫn chứng Rule</span>
            <EIBSelect :options="documentResultRuleOptions" v-model="documentResultFormData.rule" hidden-error />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <span class="c-text-des">Tiếng Việt</span>
          <div class="flex flex-row items-center">
            <span class="min-w-48 text-sm">Lý do</span>
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

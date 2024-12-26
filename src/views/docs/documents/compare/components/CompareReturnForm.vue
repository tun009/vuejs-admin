<script lang="ts" setup>
import { DocumentStatusEnum } from '@/@types/common'
import { CompareReturnFormModel } from '@/@types/pages/docs/documents'
import { updateDocumentStatus } from '@/api/docs/document/compare'
import EIBInput from '@/components/common/EIBInput.vue'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

interface Props {
  maker: string
}

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
}

interface Exposes {
  onConfirm: () => void
  getReason: () => string
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const compareReturnRef = ref<FormInstance | null>()
const compareReturnFormData: CompareReturnFormModel = reactive({
  reason: ''
})

const compareReturnFormRules: FormRules = {
  reason: []
}

const batchId = computed(() => {
  return route.params?.id as string
})

const getReason = () => {
  return compareReturnFormData.reason
}

const onConfirm = () => {
  compareReturnRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      try {
        emits('update:loading', true)
        await updateDocumentStatus(batchId.value, {
          approveDossier: DocumentStatusEnum.ADJUST_REQUESTED,
          message: compareReturnFormData.reason,
          isOCR: false
        })
        ElMessage.success(t('notification.description.returnSuccess'))
        router.push(DOCUMENT_DETAIL_PAGE(batchId.value))
      } catch (error) {
        console.error(error)
      } finally {
        emits('update:loading', false)
        emits('update:visible', false)
      }
    } else {
      console.error('Form validation failed', fields)
    }
  })
}

defineExpose<Exposes>({
  onConfirm,
  getReason
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>{{ $t('docs.compare.compareReturnDes', { maker }) }}</p>
    <div class="flex flex-col gap-2">
      <el-form
        ref="compareReturnRef"
        :model="compareReturnFormData"
        :rules="compareReturnFormRules"
        @keyup.enter="onConfirm"
        class="flex flex-col gap-1"
      >
        <EIBInput
          v-model="compareReturnFormData.reason"
          name="reason"
          label="docs.compare.reason"
          placeholder="docs.compare.enterReason"
        />
      </el-form>
    </div>
  </div>
</template>

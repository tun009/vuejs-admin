<script lang="ts" setup>
import { DocumentStatusEnum } from '@/@types/common'
import { CompareRejectFormModel } from '@/@types/pages/docs/documents'
import { updateDocumentStatus } from '@/api/docs/document/compare'
import EIBInput from '@/components/common/EIBInput.vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
}

interface Exposes {
  onConfirm: () => void
}

const emits = defineEmits<Emits>()

const route = useRoute()
const { t } = useI18n()

const compareRejectRef = ref<FormInstance | null>()
const compareRejectFormData: CompareRejectFormModel = reactive({
  reason: ''
})

const compareRejectFormRules: FormRules = {
  reason: []
}

const batchId = computed(() => {
  return route.params?.id as string
})

const onConfirm = () => {
  compareRejectRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      try {
        emits('update:loading', true)
        await updateDocumentStatus(batchId.value, {
          approveDossier: DocumentStatusEnum.DENIED,
          message: compareRejectFormData.reason
        })
        ElMessage.success(t('notification.description.rejectSuccess'))
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
  onConfirm
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>{{ $t('docs.compare.compareRejectDes') }}</p>
    <div class="flex flex-col gap-2">
      <el-form
        ref="compareRejectRef"
        :model="compareRejectFormData"
        :rules="compareRejectFormRules"
        @keyup.enter="onConfirm"
        class="flex flex-col gap-1"
      >
        <EIBInput
          v-model="compareRejectFormData.reason"
          name="reason"
          label="docs.compare.reason"
          placeholder="docs.compare.enterReason"
        />
      </el-form>
    </div>
  </div>
</template>

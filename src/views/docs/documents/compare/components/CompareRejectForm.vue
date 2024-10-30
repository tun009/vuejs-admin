<script lang="ts" setup>
import { CompareRejectFormModel } from '@/@types/pages/docs/documents'
import EIBInput from '@/components/common/EIBInput.vue'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
}

interface Exposes {
  onConfirm: () => void
}

const emits = defineEmits<Emits>()

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const compareRejectRef = ref<FormInstance | null>()
const compareRejectFormData: CompareRejectFormModel = reactive({
  reason: ''
})

const compareRejectFormRules: FormRules = {
  reason: []
}

const onConfirm = () => {
  compareRejectRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      emits('update:loading', true)
      setTimeout(() => {
        ElMessage.success(t('notification.description.rejectSuccess'))
        emits('update:loading', false)
        emits('update:visible', false)
        router.push(DOCUMENT_DETAIL_PAGE(route.params?.id as string))
      }, 2000)
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

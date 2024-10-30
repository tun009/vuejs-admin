<script lang="ts" setup>
import { CompareContentFormModel, documentResultRuleOptions } from '@/@types/pages/docs/documents'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
}

interface Exposes {
  onConfirm: () => void
}

const emits = defineEmits<Emits>()

const { t } = useI18n()

const compareContentRef = ref<FormInstance | null>()
const compareContentFormData: CompareContentFormModel = reactive({
  field: 0
})

const compareContentFormRules: FormRules = {
  field: []
}

const onConfirm = () => {
  compareContentRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      emits('update:loading', true)
      setTimeout(() => {
        ElMessage.success(t('notification.description.createSuccess'))
        emits('update:loading', false)
        emits('update:visible', false)
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
    <div class="flex flex-col gap-2">
      <el-form
        ref="compareContentRef"
        :model="compareContentFormData"
        :rules="compareContentFormRules"
        @keyup.enter="onConfirm"
        class="flex flex-col gap-1"
      >
        <EIBSelect
          v-model="compareContentFormData.field"
          :options="documentResultRuleOptions"
          name="field"
          label="docs.compare.chooseContent"
        />
      </el-form>
    </div>
  </div>
</template>

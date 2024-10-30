<script lang="ts" setup>
import { UpdateLCFormModel } from '@/@types/pages/docs/documents'
import EIBInput from '@/components/common/EIBInput.vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
}

interface Exposes {
  onConfirm: () => void
}

const emits = defineEmits<Emits>()

const updateLCRef = ref<FormInstance | null>()
const updateLCFormData: UpdateLCFormModel = reactive({
  amount: 0
})

const updateLCFormRules: FormRules = {
  amount: []
}

const onConfirm = () => {
  updateLCRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      emits('update:loading', true)
      setTimeout(() => {
        ElMessage.success('Thành công!')
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
    <div class="grid grid-cols-3 gap-x-3 gap-y-2">
      <span class="col-span-2">{{ $t('docs.detail.totalLc') }}:</span>
      <span>110,000</span>
      <span class="col-span-2">{{ $t('docs.detail.totalLcUsed') }}:</span>
      <span>0</span>
    </div>
    <div class="flex flex-col gap-2">
      <el-form
        ref="updateLCRef"
        :model="updateLCFormData"
        :rules="updateLCFormRules"
        @keyup.enter="onConfirm"
        class="flex flex-col gap-1"
      >
        <EIBInput
          v-model="updateLCFormData.amount"
          name="amount"
          type="number"
          label="docs.detail.amount"
          placeholder="docs.detail.enterReason"
        />
      </el-form>
    </div>
  </div>
</template>

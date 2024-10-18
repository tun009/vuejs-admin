<script lang="ts" setup>
import { UpdateLCFormModel } from '@/@types/pages/docs/documents'
import EIBInput from '@/components/common/EIBInput.vue'
import { ElMessage, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
}

interface Exposes {
  onConfirm: () => void
}

const emits = defineEmits<Emits>()

const updateLCRef = ref()
const updateLCFormData: UpdateLCFormModel = reactive({
  amount: 0
})

const updateLCFormRules: FormRules = {
  amount: []
}

const onConfirm = () => {
  updateLCRef.value?.validate((valid: boolean, fields: any) => {
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
      <span class="col-span-2">Tổng trị giá LC:</span>
      <span>110,000</span>
      <span class="col-span-2">Tổng trị giá LC đã sử dụng hiện tại:</span>
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
          label="Số tiền"
          placeholder="Nhập lý do"
        />
      </el-form>
    </div>
  </div>
</template>

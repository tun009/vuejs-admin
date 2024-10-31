<script lang="ts" setup>
import { DocumentLCAmountModel, UpdateLCAmountFormModel } from '@/@types/pages/docs/documents'
import { updateLCAmount } from '@/api/docs/document'
import EIBInput from '@/components/common/EIBInput.vue'
import { warningNotification } from '@/utils/notification'
import { requireRule } from '@/utils/validate'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

interface Props {
  defaultForm: DocumentLCAmountModel
}

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
  (event: 'update:amount', amountUsed: number): void
}

interface Exposes {
  onConfirm: () => void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const updateLCRef = ref<FormInstance | null>()
const updateLCFormData: UpdateLCAmountFormModel = reactive({
  amountUsed: props?.defaultForm?.amountUsed
})

const updateLCFormRules: FormRules<UpdateLCAmountFormModel> = {
  amountUsed: [requireRule()]
}

const onConfirm = () => {
  updateLCRef.value?.validate(async (valid: boolean, fields) => {
    if (!props.defaultForm?.batchId) return
    if (updateLCFormData.amountUsed > props.defaultForm.totalAmount) return warningNotification('validate.maxValue')
    if (valid) {
      emits('update:loading', true)
      await updateLCAmount({ amountUsed: updateLCFormData.amountUsed, batchId: props.defaultForm?.batchId })
      ElMessage.success('Thành công!')
      emits('update:loading', false)
      emits('update:amount', updateLCFormData.amountUsed)
      emits('update:visible', false)
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
      <span>{{ defaultForm?.totalAmount }}</span>
      <span class="col-span-2">{{ $t('docs.detail.totalLcUsed') }}:</span>
      <span>{{ defaultForm?.amountUsed }}</span>
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
          v-model.number="updateLCFormData.amountUsed"
          name="amountUsed"
          type="number"
          label="docs.detail.amount"
          placeholder="docs.detail.enterReason"
        />
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EIBInput from '@/components/common/EIBInput.vue'
import { ElMessage } from 'element-plus'
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

const onConfirm = () => {
  emits('update:loading', true)
  setTimeout(() => {
    ElMessage.success(t('notification.description.createSuccess'))
    emits('update:loading', false)
    emits('update:visible', false)
  }, 2000)
}

defineExpose<Exposes>({
  onConfirm
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>{{ $t('docs.compare.editInvalidCategoryDes') }}</p>
    <div class="flex flex-col gap-2">
      <EIBInput
        model-value="Discrepancy: Invoice: issued after date of presentation"
        name="reason"
        label="docs.compare.currentContent"
        readonly
      />
      <EIBInput
        model-value="Discrepancy: Invoice - issued after date of presentation"
        name="reason"
        label="docs.compare.newContent"
        readonly
      />
    </div>
  </div>
</template>

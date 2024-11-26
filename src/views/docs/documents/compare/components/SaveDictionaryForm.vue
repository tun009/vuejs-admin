<script lang="ts" setup>
import { RuleModel, RuleTypeEnum } from '@/@types/pages/rules'
import { updateDictionary } from '@/api/docs/document/compare'
import EIBInput from '@/components/common/EIBInput.vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
}

interface Exposes {
  onConfirm: () => void
  initComponent: (value: Partial<RuleModel>) => void
}

const displayValue = ref<Partial<RuleModel>>({
  id: -1,
  en: '',
  vi: '',
  defaultValue: ''
})

const emits = defineEmits<Emits>()

const { t } = useI18n()

const onConfirm = async () => {
  try {
    emits('update:loading', true)
    await updateDictionary(displayValue.value.id ?? -1, {
      en: displayValue.value.en ?? '',
      vi: displayValue.value.vi ?? '',
      type: RuleTypeEnum.CATEGORY
    })
    ElMessage.success(t('notification.description.createSuccess'))
    emits('update:visible', false)
  } catch (error) {
    console.error(error)
  } finally {
    emits('update:loading', false)
  }
}

const initComponent = (value: Partial<RuleModel>) => {
  displayValue.value = value
}

defineExpose<Exposes>({
  onConfirm,
  initComponent
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <p>{{ $t('docs.compare.editInvalidCategoryDes') }}</p>
    <div class="flex flex-col gap-2">
      <EIBInput :model-value="displayValue.defaultValue" name="reason" label="docs.compare.currentContent" readonly />
      <EIBInput :model-value="displayValue.en" name="reason" label="docs.compare.newContent" readonly />
    </div>
  </div>
</template>

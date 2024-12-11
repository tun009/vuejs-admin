<script setup lang="ts">
import { SettingModel, UpdateInfoExtractFormModel } from '@/@types/pages/docs/settings'
import { updateInfoExtract } from '@/api/docs/settings'
import EIBInput from '@/components/common/EIBInput.vue'
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  data: SettingModel
}

interface Emits {
  (event: 'close'): void
  (event: 'refresh'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const { t } = useI18n()
const loading = ref(false)
const updateInfoExtractFormRef = ref<FormInstance | null>()
const updateInfoExtractFormData: UpdateInfoExtractFormModel = reactive({
  id: props.data?.id,
  name: props.data?.name,
  key: props.data?.key,
  description: props.data?.description,
  docType: props.data?.docType
})

const handleInfoExtract = () => {
  updateInfoExtractFormRef.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        const payload = { ...updateInfoExtractFormData }
        loading.value = true
        await updateInfoExtract({ ...payload, id: props.data.id })
        ElMessage({
          message: t('notification.description.updateSuccess'),
          showClose: true,
          type: 'success'
        })
        emits('refresh')
        handleClose()
      } else {
        console.error('Form validation failed', fields)
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}

const handleClose = () => {
  emits('close')
  updateInfoExtractFormRef.value?.resetFields()
}

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <el-form
    ref="updateInfoExtractFormRef"
    :model="updateInfoExtractFormData"
    @keyup.enter="handleInfoExtract"
    class="flex flex-col gap-1"
  >
    <EIBInput
      label="Tên trường trích xuất"
      placeholder="Nhập tên trường trích xuất"
      name="name"
      v-model="updateInfoExtractFormData.name"
      show-limit
    />
    <EIBInput label="Core key" name="username" placeholder="" v-model="updateInfoExtractFormData.key" disabled />
    <EIBInput
      label="Mô tả"
      type="textarea"
      placeholder="Nhập mô tả"
      name="description"
      v-model="updateInfoExtractFormData.description"
      show-limit
      :max-length="1000"
    />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleInfoExtract" type="primary">{{
      $t('button.update')
    }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { RuleModel, UpdateRuleRequestModel } from '@/@types/pages/rules'
import { updateRule } from '@/api/rules'
import Input from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
// import { requireRule } from '@/utils/validate'
import { ElMessage, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

interface Emits {
  (event: 'close'): void
  (event: 'refresh'): void
}

interface Exposes {
  handleClose: () => void
}
interface Props {
  data: RuleModel
}
const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const loading = ref(false)
const updateRuleFormRef = ref()
const updateRuleFormData: UpdateRuleRequestModel = reactive({
  name: props?.data?.docType,
  code: props?.data?.code,
  en: props?.data?.en
})

const updateRuleFormRules: FormRules = {
  name: []
}

const handleClose = () => {
  emits('close')
  updateRuleFormRef.value.resetFields()
}

const handleUpdateRule = () => {
  updateRuleFormRef.value?.validate(async (valid: boolean, fields: any) => {
    try {
      if (valid) {
        loading.value = true
        await updateRule({ id: props.data.id as number, type: props.data.type, en: updateRuleFormData.en })
        ElMessage({
          message: 'Cập nhật thông tin thành công!',
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
      ElMessage({
        type: 'error',
        showClose: true,
        message: 'Có lỗi xảy ra, vui lòng thử lại!'
      })
    } finally {
      loading.value = false
    }
  })
}

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <el-form
    ref="updateRuleFormRef"
    :model="updateRuleFormData"
    :rules="updateRuleFormRules"
    @keyup.enter="handleUpdateRule"
    class="flex flex-col gap-1"
  >
    <EIBSelect label="Loại chứng từ" v-model="updateRuleFormData.name" name="name" :options="[]" readonly />
    <Input label="Mã" name="code" placeholder="" v-model="updateRuleFormData.code" disabled />
    <Input
      label="Nội dung"
      name="en"
      placeholder=""
      v-model="updateRuleFormData.en"
      type="textarea"
      :rows="5"
      show-limit
      :max-length="1200"
    />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleUpdateRule" type="primary">Lưu thay đổi</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

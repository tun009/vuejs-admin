<script setup lang="ts">
import { UpdateRuleRequestModel } from '@/@types/pages/rules'
import Input from '@/components/common/EIBInput.vue'
// import { requireRule } from '@/utils/validate'
import { ElMessage, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Emits {
  (event: 'close'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()

const { t } = useI18n()
const loading = ref(false)
const updateRuleFormRef = ref()
const updateRuleFormData: UpdateRuleRequestModel = reactive({
  name: '',
  code: '',
  content: ''
})

const updateRuleFormRules: FormRules = {
  name: []
}

const handleClose = () => {
  emits('close')
  updateRuleFormRef.value.resetFields()
}

const handleUpdateRule = () => {
  updateRuleFormRef.value?.validate((valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.createSuccess')
        })
        handleClose()
      }, 2000)
    } else {
      console.error('Form validation failed', fields)
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
    <Input label="Loại chứng từ" placeholder="" name="name" v-model="updateRuleFormData.name" disabled />
    <Input label="Mã" name="code" placeholder="" v-model="updateRuleFormData.code" disabled />
    <Input label="Nội dung" name="content" placeholder="" v-model="updateRuleFormData.content" />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleUpdateRule" type="primary">Lưu thay đổi</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

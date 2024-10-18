<script setup lang="ts">
import { ElMessage, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { UpdateDocumentRequestModel } from '@/@types/pages/docs/documents/services/DocumentRequest'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { MOCK_SOLS } from '@/mocks/user'
import { requireRule } from '@/utils/validate'

interface Emits {
  (event: 'close'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()

const { t } = useI18n()
const loading = ref(false)
const upadateDocumentFormRef = ref()
const upadateDocumentFormData: UpdateDocumentRequestModel = reactive({
  cif: '',
  customerName: '',
  documentName: '',
  sol: ''
})

const upadateDocumentFormRules: FormRules = {
  cif: [],
  customerName: [],
  documentName: [requireRule()],
  sol: []
}

const handleClose = () => {
  emits('close')
  upadateDocumentFormRef.value.resetFields()
}

const handleUpdateDocument = () => {
  upadateDocumentFormRef.value?.validate((valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage({
          message: t('notification.description.updateSuccess'),
          showClose: true,
          type: 'success'
        })
        handleClose()
      }, 3000)
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
    ref="upadateDocumentFormRef"
    :model="upadateDocumentFormData"
    :rules="upadateDocumentFormRules"
    @keyup.enter="handleUpdateDocument"
    class="flex flex-col gap-1"
  >
    <EIBInput
      label="docs.document.documentName"
      placeholder="docs.document.documentName"
      name="documentName"
      v-model="upadateDocumentFormData.documentName"
      required
      show-limit
    />
    <EIBSelect v-model="upadateDocumentFormData.sol" name="sol" :options="MOCK_SOLS" label="docs.document.solDes" />
    <EIBInput
      label="docs.document.cifCode"
      placeholder="docs.document.enterCifCode"
      name="cif"
      v-model="upadateDocumentFormData.cif"
      show-limit
    />
    <EIBInput
      label="docs.document.customerName"
      placeholder="docs.document.enterCustomerName"
      name="customerName"
      v-model="upadateDocumentFormData.customerName"
      show-limit
    />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleUpdateDocument" type="primary">{{
      $t('button.update')
    }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

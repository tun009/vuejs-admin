<template>
  <el-dialog v-model="localModelValue" title="Thêm bộ chứng từ" width="75%" :before-close="handleClose">
    <el-form
      ref="addDocumentFormRef"
      :model="addDocumentFormData"
      :rules="addDocumentFormRules"
      @keyup.enter="handleAddDocument"
      class="flex flex-col gap-3"
    >
      <div>
        <div class="grid grid-cols-2 gap-x-4">
          <Select
            v-model="addDocumentFormData.businessType"
            name="businessType"
            :options="businessTypeOptions"
            label="Loại nghiệp vụ"
            is-row
          />
          <Input
            label="Tên chứng từ"
            placeholder="Tên chứng từ"
            name="documentName"
            v-model="addDocumentFormData.documentName"
            required
            is-row
            class="col-start-1"
          />
          <Select v-model="addDocumentFormData.sol" name="sol" :options="[]" label="Chọn SOL" is-row />
          <Input
            label="Tên khách hàng"
            placeholder="Tên khách hàng"
            name="customerName"
            v-model="addDocumentFormData.customerName"
            required
            is-row
          />
          <Input
            label="Mã CIF"
            placeholder="Mã CIF"
            name="documentName"
            v-model="addDocumentFormData.cif"
            required
            is-row
          />
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer flex flex-row justify-between items-center">
        <span class="text-sm text-gray-600">Tối đa 10 file, mỗi file tối đa 16mb</span>
        <div>
          <el-button @click="localModelValue = false">Cancel</el-button>
          <el-button type="primary" @click="localModelValue = false"> Confirm </el-button>
        </div>
      </div>
    </template>
    <Upload />
  </el-dialog>
</template>

<script setup lang="ts">
import { BusinessTypeEnum, businessTypeOptions } from '@/@types/pages/docs/documents'
import { AddDocumentRequestData } from '@/@types/pages/docs/documents/services/DocumentRequest'
import Input from '@/components/common/Input.vue'
import Select from '@/components/common/Select.vue'
import Upload from '@/components/common/Upload.vue'
import { requireRule } from '@/utils/validate'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { t } from 'vxe-table'

interface Props {
  modelValue: boolean
}

interface Emits {
  (event: 'update:model-value', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:model-value', newValue)
  }
})

const addDocumentFormRef = ref<FormInstance | null>(null)
const loading = ref(false)

const addDocumentFormData: AddDocumentRequestData = reactive({
  businessType: BusinessTypeEnum.EXPORT_LC,
  cif: '',
  customerName: '',
  documentName: '',
  sol: ''
})

const addDocumentFormRules: FormRules = {
  businessType: [requireRule()],
  cif: [],
  customerName: [requireRule()],
  documentName: [requireRule()],
  sol: [requireRule()]
}

const handleAddDocument = () => {
  addDocumentFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.updateSuccess')
        })
      }, 5000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}
</script>

<script setup lang="ts">
import { BusinessTypeEnum, businessTypeOptions } from '@/@types/pages/docs/documents'
import { AddDocumentRequestData } from '@/@types/pages/docs/documents/services/DocumentRequest'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import EIBUpload from '@/components/common/EIBUpload.vue'
import { MOCK_SOLS } from '@/mocks/user'
import { warningNotification } from '@/utils/notification'
import { requireRule } from '@/utils/validate'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
}

interface Emits {
  (event: 'update:model-value', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { t } = useI18n()

const files = ref<File[]>([])

const addFiles = (fileList: FileList) => {
  files.value.push(...Array.from(fileList))
}

const setFiles = (fileList: File[]) => {
  files.value = fileList
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm(t('notification.description.confirmClose'))
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
  businessType: BusinessTypeEnum.LC_OUT,
  cif: '',
  customerName: '',
  documentName: '',
  sol: ''
})

const addDocumentFormRules: FormRules = {
  businessType: [],
  cif: [],
  customerName: [requireRule()],
  documentName: [requireRule()],
  sol: []
}

const handleAddDocument = () => {
  addDocumentFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      if (!files.value.length) {
        warningNotification(t('notification.description.emptyFiles'))
        return
      }

      const formData = new FormData()
      for (const file of files.value) {
        formData.append('files', file)
      }

      // append data for formData

      // formData.append('businessType', addDocumentFormData.businessType.toString())
      // formData.append('cif', addDocumentFormData.cif)
      // formData.append('customerName', addDocumentFormData.customerName)
      // formData.append('documentName', addDocumentFormData.documentName)
      // formData.append('sol', addDocumentFormData.sol)

      // call api upload

      setTimeout(() => {
        loading.value = false
        ElMessage({
          message: t('notification.description.createSuccess'),
          showClose: true,
          type: 'success'
        })
        emits('update:model-value', false)
      }, 2000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}
</script>

<template>
  <el-dialog v-model="localModelValue" :title="$t('docs.document.addDocument')" width="75%" :before-close="handleClose">
    <el-form
      ref="addDocumentFormRef"
      :model="addDocumentFormData"
      :rules="addDocumentFormRules"
      @keyup.enter="handleAddDocument"
      class="flex flex-col gap-3"
    >
      <div>
        <div class="grid grid-cols-2 gap-x-4">
          <EIBSelect
            v-model="addDocumentFormData.businessType"
            name="businessType"
            :options="businessTypeOptions.slice(0, 1)"
            :label="$t('docs.document.businessType')"
            is-row
          />
          <EIBInput
            :label="$t('docs.document.documentName')"
            :placeholder="$t('docs.document.enterName')"
            name="documentName"
            v-model="addDocumentFormData.documentName"
            required
            is-row
            class="col-start-1"
          />
          <EIBSelect
            v-model="addDocumentFormData.sol"
            name="sol"
            :options="MOCK_SOLS"
            :label="$t('docs.document.selectSOL')"
            is-row
          />
          <EIBInput
            :label="$t('docs.document.customerName')"
            :placeholder="$t('docs.document.enterName')"
            name="customerName"
            v-model="addDocumentFormData.customerName"
            required
            is-row
          />
          <EIBInput
            :label="$t('docs.document.cifCode')"
            :placeholder="$t('docs.document.cifCode')"
            name="cif"
            v-model="addDocumentFormData.cif"
            is-row
          />
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer flex flex-row justify-between items-center">
        <span class="text-sm text-gray-600">{{ $t('docs.document.uploadNote') }}</span>
        <div>
          <el-button @click="localModelValue = false">{{ $t('button.cancel') }}</el-button>
          <el-button :loading="loading" type="primary" @click="handleAddDocument">
            {{ $t('button.confirm') }}
          </el-button>
        </div>
      </div>
    </template>
    <EIBUpload :files="files" @add-files="addFiles" @set-files="setFiles" />
  </el-dialog>
</template>

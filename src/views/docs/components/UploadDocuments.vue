<script setup lang="ts">
import { BusinessTypeEnum, businessTypeOptions } from '@/@types/pages/docs/documents'
import { AddDocumentRequestModel } from '@/@types/pages/docs/documents/services/DocumentRequest'
import { BranchModel } from '@/@types/pages/login'
import { addDocument, getBranches } from '@/api/docs/document'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import EIBUpload from '@/components/common/EIBUpload.vue'
import { mappingBranches } from '@/utils/common'
import { warningNotification } from '@/utils/notification'
import { requireRule } from '@/utils/validate'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
}

interface Emits {
  (event: 'update:model-value', value: boolean): void
  (event: 'refresh'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { t } = useI18n()

const files = ref<File[]>([])
const branches = ref<BranchModel[]>([])
const addDocumentFormRef = ref<FormInstance | null>(null)
const loading = ref(false)

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

const addDocumentFormData: AddDocumentRequestModel = reactive({
  bizType: BusinessTypeEnum.LC_OUT,
  cif: '',
  customerName: '',
  name: ''
  // amountClaimed: 0
})

const addDocumentFormRules: FormRules<AddDocumentRequestModel> = {
  bizType: [],
  cif: [],
  customerName: [requireRule()],
  name: [requireRule()],
  branchId: []
  // amountClaimed: [requireRule()]
}

const handleAddDocument = () => {
  addDocumentFormRef.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        if (!files.value.length) {
          warningNotification(t('notification.description.emptyFiles'))
          return
        }
        loading.value = true

        const formData = new FormData()
        for (const file of files.value) {
          formData.append('files', file)
        }

        // append data for formData
        Object.entries(addDocumentFormData).forEach(([key, value]) => {
          if (!value) return
          formData.append(key, value)
        })

        // call api upload
        await addDocument(formData)
        ElMessage({
          message: t('notification.description.createSuccess'),
          showClose: true,
          type: 'success'
        })
        emits('refresh')
        emits('update:model-value', false)
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

const handleGetBranches = async () => {
  try {
    const { data } = await getBranches()
    branches.value = data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  handleGetBranches()
})
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
          <EIBInput
            label="docs.document.documentName"
            placeholder="docs.document.enterName"
            name="name"
            v-model="addDocumentFormData.name"
            required
            is-row
            class="col-start-1"
          />
          <EIBSelect
            v-model="addDocumentFormData.bizType"
            name="bizType"
            :options="businessTypeOptions.slice(1, 2)"
            label="docs.document.businessType"
            is-row
            default-first-option
          />

          <EIBInput
            label="docs.document.customerName"
            placeholder="docs.document.enterName"
            name="customerName"
            v-model="addDocumentFormData.customerName"
            required
            is-row
          />
          <EIBSelect
            v-model="addDocumentFormData.branchId"
            name="branchId"
            :options="mappingBranches(branches)"
            label="docs.document.selectSOL"
            is-row
          />

          <!-- <EIBInput
            label="docs.document.totalAmount"
            placeholder="docs.document.totalAmount"
            name="amountClaimed"
            v-model="addDocumentFormData.amountClaimed"
            required
            is-row
          /> -->

          <EIBInput
            label="docs.document.cifCode"
            placeholder="docs.document.cifCode"
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

<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { DocumentModel } from '@/@types/pages/docs/documents'
import { UpdateDocumentRequestModel } from '@/@types/pages/docs/documents/services/DocumentRequest'
import { BranchModel } from '@/@types/pages/login'
import { getBranches, updateDocument } from '@/api/docs/document'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { mappingBranches } from '@/utils/common'
import { requireRule } from '@/utils/validate'

interface Porps {
  data: DocumentModel
}

interface Emits {
  (event: 'close'): void
  (event: 'refresh'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()
const props = defineProps<Porps>()

const { t } = useI18n()

const branches = ref<BranchModel[]>([])
const loading = ref(false)
const upadateDocumentFormRef = ref<FormInstance | null>()
const upadateDocumentFormData: UpdateDocumentRequestModel = reactive({
  cif: props.data?.cif,
  customerName: props.data?.customerName,
  name: props.data?.dossierName,
  branchId: props.data?.branch?.id
})

const upadateDocumentFormRules: FormRules<UpdateDocumentRequestModel> = {
  cif: [],
  customerName: [requireRule()],
  name: [requireRule()],
  branchId: []
}

const handleClose = () => {
  emits('close')
  upadateDocumentFormRef.value?.resetFields()
}

const handleUpdateDocument = () => {
  upadateDocumentFormRef.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        loading.value = true
        await updateDocument({ ...upadateDocumentFormData, id: props.data.id })
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
      name="name"
      v-model="upadateDocumentFormData.name"
      required
      show-limit
    />
    <EIBSelect
      v-model="upadateDocumentFormData.branchId"
      name="branchId"
      :options="mappingBranches(branches)"
      label="docs.document.solDes"
    />
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
      required
    />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleUpdateDocument" type="primary">{{
      $t('button.update')
    }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

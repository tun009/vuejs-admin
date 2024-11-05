<script setup lang="ts">
import { BranchModel } from '@/@types/pages/login'
import { RoleEnum, roleSelectOptions } from '@/@types/pages/users'
import { AddUserRequestModel } from '@/@types/pages/users/services/UserRequest'
import { getBranches } from '@/api/docs/document'
import { addUser } from '@/api/users'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { PASSWORD_DEFAULT } from '@/constants/common'
import { mappingBranches } from '@/utils/common'
import { requireRule } from '@/utils/validate'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Emits {
  (event: 'close'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()

const { t } = useI18n()

const branches = ref<BranchModel[]>([])
const loading = ref(false)
const addUserFormData: AddUserRequestModel = reactive({
  name: '',
  username: '',
  branchId: 0,
  role: RoleEnum.ADMIN
})

const addUserFormRules: FormRules<AddUserRequestModel> = {
  name: [requireRule()],
  username: [requireRule()],
  branchId: [requireRule('change')],
  role: [requireRule('change')]
}

const handleClose = () => {
  emits('close')
  addUserFormRef.value?.resetFields()
}

const addUserFormRef = ref<FormInstance | null>(null)

const handleAddUser = () => {
  addUserFormRef.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        loading.value = true
        await addUser(addUserFormData)
      } else {
        console.error('Form validation failed', fields)
      }
      ElMessage({
        message: t('notification.description.createSuccess'),
        showClose: true,
        type: 'success'
      })
      emits('close')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}

defineExpose<Exposes>({
  handleClose
})

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
  <el-form
    ref="addUserFormRef"
    :model="addUserFormData"
    :rules="addUserFormRules"
    @keyup.enter="handleAddUser"
    class="flex flex-col gap-1"
  >
    <EIBInput
      label="user.addUser.name"
      placeholder="user.addUser.enterName"
      name="name"
      v-model="addUserFormData.name"
      required
      show-limitaddUserFormData
    />
    <EIBInput
      label="user.addUser.username"
      name="username"
      placeholder="user.addUser.enterUsername"
      v-model="addUserFormData.username"
      required
      show-limit
      :max-length="200"
    />
    <EIBInput label="user.addUser.password" name="password" :model-value="PASSWORD_DEFAULT" disabled />
    <EIBSelect
      v-model="addUserFormData.branchId"
      name="sol"
      :options="mappingBranches(branches)"
      label="user.addUser.sol"
      required
    />
    <EIBSelect
      v-model="addUserFormData.role"
      name="role"
      :options="roleSelectOptions"
      label="user.addUser.role"
      required
    />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleAddUser" type="primary">{{ $t('button.update') }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

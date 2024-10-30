<script setup lang="ts">
import { BranchModel } from '@/@types/pages/login'
import { AddUserRequestModel, RoleEnum, roleSelectOptions } from '@/@types/pages/users'
import { getBranches } from '@/api/docs/document'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { PASSWORD_DEFAULT } from '@/constants/common'
import { mappingBranches } from '@/utils/common'
import { requireRule } from '@/utils/validate'
import { ElMessage, FormRules } from 'element-plus'
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
const addUserFormRef = ref()
const addUserFormData: AddUserRequestModel = reactive({
  name: '',
  username: '',
  sol: '',
  role: RoleEnum.ADMIN
})

const addUserFormRules: FormRules = {
  name: [requireRule()],
  username: [requireRule()],
  sol: [requireRule('change')],
  role: [requireRule('change')]
}

const handleClose = () => {
  emits('close')
  addUserFormRef.value.resetFields()
}

const handleAddUser = () => {
  addUserFormRef.value?.validate((valid: boolean, fields: any) => {
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
      }, 3000)
    } else {
      console.error('Form validation failed', fields)
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
      show-limit
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
      v-model="addUserFormData.sol"
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

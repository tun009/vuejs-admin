<script setup lang="ts">
import { AddUserRequestModel, RoleEnum } from '@/@types/pages/users'
import Input from '@/components/common/Input.vue'
import { PASSWORD_DEFAULT } from '@/utils/constants/common'
import { requireRule } from '@/utils/validate'
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
const addUserFormRef = ref()
const addUserFormData: AddUserRequestModel = reactive({
  name: '',
  username: '',
  sql: '',
  role: RoleEnum.ADMIN
})

const addUserFormRules: FormRules = {
  name: [requireRule()],
  username: [requireRule()],
  sql: [requireRule()],
  role: [requireRule()]
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
          message: t('notification.description.updateSuccess')
        })
        handleClose()
      }, 5000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}

const handleClose = () => {
  emits('close')
  addUserFormRef.value.resetFields()
}

defineExpose<Exposes>({
  handleClose
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
    <Input :label="$t('user.addUser.name')" name="name" v-model="addUserFormData.name" required show-limit />
    <Input
      :label="$t('user.addUser.username')"
      name="username"
      v-model="addUserFormData.username"
      required
      show-limit
    />
    <Input :label="$t('user.addUser.password')" name="password" :model-value="PASSWORD_DEFAULT" disabled />
    <Input :label="$t('user.addUser.sql')" name="sql" v-model="addUserFormData.sql" required />
    <Input :label="$t('user.addUser.role')" name="role" v-model="addUserFormData.role" required />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleAddUser" type="primary">{{ $t('button.update') }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

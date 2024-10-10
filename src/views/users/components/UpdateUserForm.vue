<script setup lang="ts">
import { Check, Close, Lock } from '@element-plus/icons-vue'
import { ElMessage, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { UpdateUserRequestModel, RoleEnum, roleSelectOptions } from '@/@types/pages/users'
import Input from '@/components/common/Input.vue'
import Select from '@/components/common/Select.vue'
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
const updateUserFormRef = ref()
const updateUserFormData: UpdateUserRequestModel = reactive({
  block: false,
  name: '',
  role: RoleEnum.ADMIN,
  sol: '',
  username: ''
})

const updateUserFormRules: FormRules = {
  name: [],
  role: [requireRule('change')],
  sol: [requireRule('change')],
  username: []
}

const handleUpdateUser = () => {
  updateUserFormRef.value?.validate((valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage({
          message: t('notification.description.createSuccess'),
          showClose: true,
          type: 'success'
        })
        handleClose()
      }, 2000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}

const handleClose = () => {
  emits('close')
  updateUserFormRef.value.resetFields()
}

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <el-form
    ref="updateUserFormRef"
    :model="updateUserFormData"
    :rules="updateUserFormRules"
    @keyup.enter="handleUpdateUser"
    class="flex flex-col gap-1"
  >
    <Input
      label="user.addUser.name"
      placeholder="user.addUser.enterName"
      name="name"
      v-model="updateUserFormData.name"
      disabled
    />
    <Input
      label="user.addUser.username"
      name="username"
      placeholder="user.addUser.enterUsername"
      v-model="updateUserFormData.username"
      disabled
    />
    <Select v-model="updateUserFormData.sol" name="sol" :options="roleSelectOptions" label="user.addUser.sol" />
    <Select v-model="updateUserFormData.role" name="role" :options="roleSelectOptions" label="user.addUser.role" />
    <div class="flex flex-col gap-2 mb-[26px]">
      <span>{{ $t('user.updateUser.password') }}</span>
      <el-button class="w-fit" :icon="Lock" color="#005d98" plain>{{ $t('user.updateUser.resetPassword') }}</el-button>
    </div>
    <div class="flex flex-col gap-2">
      <span>{{ $t('user.updateUser.blockUser') }}</span>
      <el-form-item prop="block">
        <el-switch
          v-model="updateUserFormData.block"
          class="!ml-0"
          style="margin-left: 24px"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
        />
      </el-form-item>
    </div>
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleUpdateUser" type="primary">{{ $t('button.update') }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

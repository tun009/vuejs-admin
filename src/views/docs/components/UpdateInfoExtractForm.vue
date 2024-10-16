<script setup lang="ts">
import { ElMessage, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { RoleEnum, UpdateUserRequestModel } from '@/@types/pages/users'
import Input from '@/components/common/EIBInput.vue'
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
      }, 3000)
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
      label="Tên trường trích xuất"
      placeholder="Nhập tên trường trích xuất"
      name="name"
      v-model="updateUserFormData.name"
    />
    <Input label="Core key" name="username" placeholder="" v-model="updateUserFormData.username" disabled />
    <Input label="Mô tả" placeholder="Nhập mô tả" name="name" v-model="updateUserFormData.name" />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleUpdateUser" type="primary">{{ $t('button.update') }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

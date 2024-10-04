<script setup lang="ts">
import { ChangePasswordRequestData } from '@/@types/pages/profile'
import Input from '@/components/common/Input.vue'
import { passwordRule, requireRule } from '@/utils/validate'
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
const changePasswordFormRef = ref()
const changePasswordFormData: ChangePasswordRequestData = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})
const validateConfirmPass = (_rule: any, value: any, callback: (error?: Error) => void) => {
  if (value !== changePasswordFormData.newPassword) {
    callback(new Error(t('validate.passwordNotMatch')))
  } else {
    callback()
  }
}

const changePasswordFormRules: FormRules = {
  password: [requireRule()],
  newPassword: [requireRule(), passwordRule()],
  confirmPassword: [requireRule(), passwordRule(), { validator: validateConfirmPass, trigger: 'blur' }]
}

const handleChangePassword = () => {
  changePasswordFormRef.value?.validate((valid: boolean, fields: any) => {
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
  changePasswordFormRef.value.resetFields()
}

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <el-form
    ref="changePasswordFormRef"
    :model="changePasswordFormData"
    :rules="changePasswordFormRules"
    @keyup.enter="handleChangePassword"
    class="flex flex-col gap-1"
  >
    <Input
      label="profile.password"
      placeholder="profile.enterCurrentPassword"
      name="password"
      v-model="changePasswordFormData.password"
      required
      show-limit
    />
    <Input
      label="profile.newPassword"
      placeholder="profile.enterNewPassword"
      name="newPassword"
      v-model="changePasswordFormData.newPassword"
      required
      show-limit
    />
    <Input
      label="profile.confirmPassword"
      placeholder="profile.enterNewPasswordAgain"
      name="confirmPassword"
      v-model="changePasswordFormData.confirmPassword"
      required
      show-limit
    />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleChangePassword" type="primary">{{
      $t('button.update')
    }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

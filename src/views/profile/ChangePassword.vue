<script setup lang="ts">
import { ChangePasswordFormModel } from '@/@types/pages/profile'
import { changeUserPassword } from '@/api/users'
import EIBInput from '@/components/common/EIBInput.vue'
import { useUserStore } from '@/store/modules/user'
import { warningNotification } from '@/utils/notification'
import { passwordRule, requireRule } from '@/utils/validate'
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  requireConfirm?: boolean
}

interface Emits {
  (event: 'close'): void
}

interface Exposes {
  handleClose: () => void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const { t } = useI18n()
const { logout } = useUserStore()

const loading = ref(false)
const changePasswordFormRef = ref<FormInstance | null>()
const changePasswordFormData: ChangePasswordFormModel = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// validate compare password
const validateConfirmPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (value !== changePasswordFormData.newPassword) {
    callback(new Error(t('validate.passwordNotMatch')))
  } else {
    callback()
  }
}

const validateNewPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (value === changePasswordFormData.oldPassword) {
    callback(new Error(t('validate.passwordOld')))
  } else {
    callback()
  }
}

const changePasswordFormRules: FormRules<ChangePasswordFormModel> = {
  oldPassword: [requireRule()],
  newPassword: [requireRule(), passwordRule(), { validator: validateNewPassword, trigger: 'blur' }],
  confirmPassword: [requireRule(), passwordRule(), { validator: validateConfirmPassword, trigger: 'blur' }]
}

const handleClose = () => {
  emits('close')
  changePasswordFormRef.value?.resetFields()
}

const handleChangePassword = () => {
  changePasswordFormRef.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        loading.value = true
        await changeUserPassword({
          oldPassword: changePasswordFormData.oldPassword,
          newPassword: changePasswordFormData.newPassword
        })
        handleClose()

        warningNotification('Bạn đã thay đổi mật khẩu thành công, vui lòng đăng nhập lại!')
        logout()
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
    <EIBInput
      label="profile.password"
      placeholder="profile.enterCurrentPassword"
      name="oldPassword"
      type="password"
      v-model="changePasswordFormData.oldPassword"
      required
      show-limit
      :max-length="100"
      show-password
    />
    <EIBInput
      label="profile.newPassword"
      placeholder="profile.enterNewPassword"
      name="newPassword"
      type="password"
      v-model="changePasswordFormData.newPassword"
      required
      show-limit
      :max-length="100"
      show-password
    />
    <EIBInput
      label="profile.confirmPassword"
      placeholder="profile.enterNewPasswordAgain"
      name="confirmPassword"
      type="password"
      v-model="changePasswordFormData.confirmPassword"
      required
      show-limit
      :max-length="100"
      show-password
    />
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleChangePassword" type="primary">{{
      $t('button.update')
    }}</el-button>
    <el-button v-if="!requireConfirm" :disabled="loading" @click="handleClose" type="default">{{
      $t('button.cancel')
    }}</el-button>
  </div>
</template>

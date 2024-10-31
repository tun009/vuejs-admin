<script setup lang="ts">
import { UpdateUserRequestModel, RoleEnum, roleSelectOptions } from '@/@types/pages/users'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { requireRule } from '@/utils/validate'
import { Check, Close, Lock } from '@element-plus/icons-vue'
import { ElMessage, FormRules, ElMessageBox } from 'element-plus'
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
const updateUserFormRef = ref()
const updateUserFormData: UpdateUserRequestModel = reactive({
  name: '',
  username: '',
  branchId: '',
  role: RoleEnum.ADMIN,
  block: false
})

const updateUserFormRules: FormRules<UpdateUserRequestModel> = {
  name: [],
  username: [],
  branchId: [requireRule('change')],
  role: [requireRule('change')]
}

const handleClose = () => {
  emits('close')
  updateUserFormRef.value.resetFields()
}

const handleUpdateUser = () => {
  updateUserFormRef.value?.validate((valid: boolean, fields: any) => {
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
      }, 2000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}

defineExpose<Exposes>({
  handleClose
})

const handleResetPasswordUser = () => {
  ElMessageBox.confirm(`Bạn xác nhận khôi phục mật khẩu tài khoản này chứ?`, 'Reset mật khẩu', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy bỏ',
    dangerouslyUseHTMLString: true,
    draggable: true
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Reset Password user completed'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Reset Password user canceled'
      })
    })
}
</script>

<template>
  <el-form
    ref="updateUserFormRef"
    :model="updateUserFormData"
    :rules="updateUserFormRules"
    @keyup.enter="handleUpdateUser"
    class="flex flex-col gap-1"
  >
    <EIBInput
      label="user.addUser.name"
      placeholder="user.addUser.enterName"
      name="name"
      v-model="updateUserFormData.name"
      disabled
    />
    <EIBInput
      label="user.addUser.username"
      name="username"
      placeholder="user.addUser.enterUsername"
      v-model="updateUserFormData.username"
      disabled
    />
    <EIBSelect v-model="updateUserFormData.branchId" name="sol" :options="roleSelectOptions" label="user.addUser.sol" />
    <EIBSelect v-model="updateUserFormData.role" name="role" :options="roleSelectOptions" label="user.addUser.role" />
    <div class="flex flex-col gap-2 mb-[26px]">
      <span>{{ $t('user.updateUser.password') }}</span>
      <el-button class="w-fit" :icon="Lock" color="#005d98" plain @click="handleResetPasswordUser()">{{
        $t('user.updateUser.resetPassword')
      }}</el-button>
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

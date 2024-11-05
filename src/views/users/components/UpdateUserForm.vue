<script setup lang="ts">
import { roleSelectOptions, UserModel } from '@/@types/pages/users'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { requireRule } from '@/utils/validate'
import { Check, Close, Lock } from '@element-plus/icons-vue'
import { ElMessage, FormRules, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBranches, updateUser } from '@/api/users'
import { mappingBranches } from '@/utils/common'
import { BranchModel } from '@/@types/pages/login'
import { UpdateUserRequestModel } from '@/@types/pages/users/services/UserRequest'

interface Props {
  data: UserModel
}

interface Emits {
  (event: 'close'): void
  (event: 'refresh'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const { t } = useI18n()
const branches = ref<BranchModel[]>([])
const loading = ref(false)
const updateUserFormRef = ref()
const statusUser = (status: string) => {
  if (status == 'ACTIVE') {
    return true
  } else {
    return false
  }
}

const updateUserFormData: UpdateUserRequestModel = reactive({
  id: props.data?.id,
  name: props.data?.name,
  username: props.data?.username,
  branchId: props.data?.branch?.id,
  role: props.data?.role,
  status: statusUser(props.data?.status)
})

const updateUserFormRules: FormRules<UpdateUserRequestModel> = {
  branchId: [requireRule('change')],
  role: [requireRule('change')]
}

const handleClose = () => {
  emits('close')
  updateUserFormRef.value.resetFields()
}

const handleUpdateUser = () => {
  updateUserFormRef.value?.validate(async (valid: boolean, fields: any) => {
    try {
      if (valid) {
        if (updateUserFormData.status == true) {
          updateUserFormData.status = 'ACTIVE'
        } else {
          updateUserFormData.status = 'INACTIVE'
        }
        loading.value = true
        await updateUser({ ...updateUserFormData, id: props.data.id })
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
    <EIBSelect
      v-model="updateUserFormData.branchId"
      name="sol"
      :options="mappingBranches(branches)"
      label="user.addUser.sol"
    />
    <EIBSelect v-model="updateUserFormData.role" name="role" :options="roleSelectOptions" label="user.addUser.role" />
    <div class="flex flex-col gap-2 mb-[26px]">
      <span>{{ $t('user.updateUser.password') }}</span>
      <el-button class="w-fit" :icon="Lock" color="#005d98" plain @click="handleResetPasswordUser()">{{
        $t('user.updateUser.resetPassword')
      }}</el-button>
    </div>
    <div class="flex flex-col gap-2">
      <span>{{ $t('user.updateUser.blockUser') }}</span>
      <el-form-item prop="status">
        <el-switch
          v-model="updateUserFormData.status"
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

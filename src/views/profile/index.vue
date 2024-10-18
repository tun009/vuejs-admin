<script setup lang="ts">
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import { Title } from '@/layouts/components'
import { phoneNumberRule, requireRule } from '@/utils/validate'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChangePassword from './ChangePassword.vue'
import { ChangeProfileFormModel } from '@/@types/pages/profile/services/ProfileRequest'

defineOptions({
  name: 'Profile'
})

const { t } = useI18n()

const changeProfileFormRef = ref<FormInstance | null>(null)
const loading = ref(false)
const isEdit = ref(false)
const openDrawer = ref(false)
const changePasswordRef = ref<InstanceType<typeof ChangePassword>>()

const changeProfileFormData: ChangeProfileFormModel = reactive({
  username: 'admin',
  name: 'HuyDV',
  phoneNumber: '0963648426'
})

const changeProfileFormRules: FormRules = {
  name: [requireRule()],
  username: [],
  phoneNumber: [requireRule(), phoneNumberRule()]
}

const handleUpdateProfile = () => {
  changeProfileFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.updateSuccess')
        })
        isEdit.value = false
      }, 3000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}
</script>

<template>
  <Title :title="t('profile.title')" />
  <el-card class="h-fit">
    <el-col :span="8">
      <el-form
        ref="changeProfileFormRef"
        :model="changeProfileFormData"
        :rules="changeProfileFormRules"
        @keyup.enter="handleUpdateProfile"
        class="flex flex-col gap-3"
      >
        <EIBInput
          label="profile.name"
          placeholder="profile.enterName"
          name="name"
          v-model="changeProfileFormData.name"
          required
          show-limit
          :readonly="!isEdit"
        />
        <EIBInput
          label="profile.username"
          placeholder="profile.enterUsername"
          name="namename"
          v-model="changeProfileFormData.username"
          disabled
          :readonly="!isEdit"
        />
        <EIBInput
          label="profile.phoneNumber"
          placeholder="profile.enterPhoneNumber"
          name="phoneNumber"
          v-model="changeProfileFormData.phoneNumber"
          required
          :readonly="!isEdit"
        />
        <div class="flex flex-row items-center justify-between" v-if="!isEdit">
          <EIBInput label="profile.password" readonly model-value="*********" />
          <EIBDrawer title="profile.changePassword" :text-button="$t('profile.changePassword')" v-model="openDrawer">
            <template #default>
              <div class="mt-3 flex flex-col gap-5">
                <el-text>{{ $t('profile.changePasswordDes') + '*&^%#@!' }}</el-text>
                <ChangePassword ref="changePasswordRef" @close="openDrawer = false" />
              </div>
            </template>
          </EIBDrawer>
        </div>
      </el-form>
      <div class="mt-2">
        <div v-if="isEdit">
          <el-button :loading="loading" @click.prevent="handleUpdateProfile" type="primary">{{
            $t('button.update')
          }}</el-button>
          <el-button :disabled="loading" @click="isEdit = false" type="default">{{ $t('button.cancel') }}</el-button>
        </div>
        <div v-else>
          <el-button type="primary" plain @click="isEdit = true">{{ $t('profile.updateProfile') }}</el-button>
        </div>
      </div>
    </el-col>
  </el-card>
</template>

<script setup lang="ts">
import Drawer from '@/components/common/Drawer.vue'
import Input from '@/components/common/Input.vue'
import { Title } from '@/layouts/components'
import { phoneNumberRule, requireRule } from '@/utils/validate'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChangePassword from './ChangePassword.vue'
import { ChangeProfileRequestModel } from '@/@types/pages/profile/services/ProfileRequest'

defineOptions({
  name: 'Profile'
})

const { t } = useI18n()

const changeProfileFormRef = ref<FormInstance | null>(null)
const loading = ref(false)
const isEdit = ref(false)
const openDrawer = ref(false)
const changePasswordRef = ref<InstanceType<typeof ChangePassword>>()

const changeProfileFormData: ChangeProfileRequestModel = reactive({
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
      }, 5000)
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
        <Input
          label="profile.name"
          placeholder="profile.enterName"
          name="name"
          v-model="changeProfileFormData.name"
          required
          show-limit
          :readonly="!isEdit"
        />
        <Input
          label="profile.username"
          placeholder="profile.enterUsername"
          name="namename"
          v-model="changeProfileFormData.username"
          disabled
          :readonly="!isEdit"
        />
        <Input
          label="profile.phoneNumber"
          placeholder="profile.enterPhoneNumber"
          name="phoneNumber"
          v-model="changeProfileFormData.phoneNumber"
          required
          :readonly="!isEdit"
        />
        <div class="flex flex-row items-center justify-between" v-if="!isEdit">
          <Input label="profile.password" readonly model-value="*********" />
          <Drawer title="profile.changePassword" :text-button="$t('profile.changePassword')" v-model="openDrawer">
            <template #default>
              <div class="mt-3 flex flex-col gap-5">
                <el-text>{{ $t('profile.changePasswordDes') + '*&^%#@!' }}</el-text>
                <ChangePassword ref="changePasswordRef" @close="openDrawer = false" />
              </div>
            </template>
          </Drawer>
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

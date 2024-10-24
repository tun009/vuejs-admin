<script setup lang="ts">
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import { Title } from '@/layouts/components'
import { phoneNumberRule, requireRule } from '@/utils/validate'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChangePassword from './ChangePassword.vue'
import { useUserStore } from '@/store/modules/user'
import { updateUserInfo } from '@/api/users'
import { ChangeProfileFormModel } from '@/@types/pages/profile'
import { storeToRefs } from 'pinia'

// defineOptions({
//   name: 'Profile'
// })

const { t } = useI18n()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const changeProfileFormRef = ref<FormInstance | null>(null)
const loading = ref(false)
const isEdit = ref(false)
const openDrawer = ref(false)
const changePasswordRef = ref<InstanceType<typeof ChangePassword>>()

const changeProfileFormData: ChangeProfileFormModel = reactive({
  name: userInfo.value.name,
  phoneNumber: userInfo.value.phoneNumber
})

const changeProfileFormRules: FormRules<ChangeProfileFormModel> = {
  name: [requireRule()],
  phoneNumber: [requireRule(), phoneNumberRule()]
}

const handleUpdateProfile = () => {
  changeProfileFormRef.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        loading.value = true
        const { data } = await updateUserInfo({
          ...changeProfileFormData,
          id: userInfo.value.id
        })
        userStore.setUserInfo({ ...userInfo, ...data })
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.updateSuccess')
        })
        isEdit.value = false
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

const handleCancelUpdateProfile = () => {
  changeProfileFormData.name = userInfo.value.name
  changeProfileFormData.phoneNumber = userInfo.value.phoneNumber
  isEdit.value = false
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
          v-model="userInfo.username"
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
          <el-button :disabled="loading" @click="handleCancelUpdateProfile" type="default">{{
            $t('button.cancel')
          }}</el-button>
        </div>
        <div v-else>
          <el-button type="primary" plain @click="isEdit = true">{{ $t('profile.updateProfile') }}</el-button>
        </div>
      </div>
    </el-col>
  </el-card>
</template>

<script setup lang="ts">
import { ChangeProfileRequestData } from '@/@types/pages/profile'
// import InputComponent from '@/components/common/InputComponent.vue'
import { Title } from '@/layouts/components'
import { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loginFormRef = ref<FormInstance | null>(null)

const changeProfileFormData: ChangeProfileRequestData = reactive({
  username: 'admin',
  name: 'HuyDV',
  phoneNumber: ''
})

const changeProfileFormRules: FormRules = {
  name: [{ required: true, message: 'Please enter your name', trigger: 'blur' }],
  username: [],
  phoneNumber: [{ required: true, message: 'Please enter the verification code', trigger: 'blur' }]
}

const handleUpdateProfile = () => {}
</script>

<template>
  <Title :title="t('profile.title')" />
  <el-card class="h-fit">
    <el-col :span="8">
      <el-form
        ref="loginFormRef"
        :model="changeProfileFormData"
        :rules="changeProfileFormRules"
        @keyup.enter="handleUpdateProfile"
      >
        <!-- <InputComponent label="Họ tên" /> -->
      </el-form>
    </el-col>
  </el-card>
</template>

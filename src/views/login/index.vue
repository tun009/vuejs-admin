<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, User } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

import Background from './components/Background.vue'

import { type LoginRequestData } from '@/api/login/types/login'
import { useUserStore } from '@/store/modules/user'
import ThemeSwitch from '@/components/ThemeSwitch/index.vue'
import LanguageSwitch from '@/components/LanguageSwitch/index.vue'
import Input from '@/components/common/Input.vue'
import { DASHBOARD_PAGE } from '@/constants/router'
import { limitLengthRule, requireRule } from '@/utils/validate'

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)
const { t } = useI18n()

const loading = ref(false)
const loginFormData: LoginRequestData = reactive({
  code: '',
  password: '12345678',
  username: 'admin'
})

const loginFormRules: FormRules = {
  code: [],
  password: [requireRule(), limitLengthRule({ max: 16, min: 8 })],
  username: [requireRule()]
}
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login(loginFormData)
        .then(() => {
          ElMessage({
            message: t('notification.description.loginSuccess'),
            showClose: true,
            type: 'success'
          })
          router.push({ path: DASHBOARD_PAGE })
        })
        .catch(() => {
          loginFormData.password = ''
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error('Form validation failed', fields)
    }
  })
}
</script>

<template>
  <div>
    <ThemeSwitch class="fixed top-8 right-10 pointer" />
    <LanguageSwitch class="fixed top-8 right-20 pointer" />
    <Background>
      <template #form>
        <div class="flex flex-col gap-14 w-full h-full items-center justify-center relative">
          <el-text tag="p" class="text-3xl">{{ $t('login.title') }}</el-text>
          <el-form
            ref="loginFormRef"
            :model="loginFormData"
            :rules="loginFormRules"
            @keyup.enter="handleLogin"
            class="w-full max-w-[500px] mx-auto"
          >
            <Input
              name="username"
              label="login.username"
              placeholder="login.enterUsername"
              :prefix-icon="User"
              :model-value="loginFormData.username"
              @update:modelValue="(val: string) => (loginFormData.username = val)"
            />
            <Input
              name="password"
              label="login.password"
              placeholder="login.enterPassword"
              :prefix-icon="Lock"
              type="password"
              show-password
              :model-value="loginFormData.password"
              @update:modelValue="(val: string) => (loginFormData.password = val)"
            />
            <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin" class="w-full">{{
              $t('button.login')
            }}</el-button></el-form
          >
          <el-text tag="span" class="absolute bottom-0">© Viettel AI 2024. All rights reserved.</el-text>
        </div>
      </template>
    </Background>
  </div>
</template>

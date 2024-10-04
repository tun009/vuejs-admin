<script lang="ts" setup>
import { type LoginRequestData } from '@/api/login/types/login'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Background from './components/Background.vue'
import { Lock, User } from '@element-plus/icons-vue'
import ThemeSwitch from '@/components/ThemeSwitch/index.vue'
import LanguageSwitch from '@/components/LanguageSwitch/index.vue'
import Input from '@/components/common/Input.vue'
import { DASHBOARD_PAGE } from '@/utils/constants/router'
import { limitLengthRule, requireRule } from '@/utils/validate'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)
const { t } = useI18n()

const loading = ref(false)
const loginFormData: LoginRequestData = reactive({
  username: 'admin',
  password: '12345678',
  code: ''
})

const loginFormRules: FormRules = {
  username: [requireRule()],
  password: [requireRule(), limitLengthRule({ min: 8, max: 16 })],
  code: []
}
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login(loginFormData)
        .then(() => {
          ElMessage({
            showClose: true,
            type: 'success',
            message: t('notification.description.loginSuccess')
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

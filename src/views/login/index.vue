<script lang="ts" setup>
import { LoginFormModel } from '@/@types/pages/login'
// import LanguageSwitch from '@/components/LanguageSwitch/index.vue'
// import ThemeSwitch from '@/components/ThemeSwitch/index.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import { DASHBOARD_PAGE } from '@/constants/router'
import { useUserStore } from '@/store/modules/user'
import { limitLengthRule, requireRule } from '@/utils/validate'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Background from './components/Background.vue'

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)
const { t } = useI18n()
const { login } = useUserStore()

const loading = ref(false)
const loginFormData: LoginFormModel = reactive({
  username: '',
  password: ''
})

const loginFormRules: FormRules = {
  username: [requireRule()],
  password: [requireRule(), limitLengthRule({ min: 8, max: 16 })],
  code: []
}
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        loading.value = true
        await login(loginFormData)
        ElMessage({
          showClose: true,
          type: 'success',
          message: t('notification.description.loginSuccess')
        })
        router.push({ path: DASHBOARD_PAGE })
      } else {
        console.error('Form validation failed', fields)
      }
    } catch (error) {
      loginFormData.password = ''
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div>
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
            <EIBInput
              name="username"
              label="login.username"
              placeholder="login.enterUsername"
              :prefix-icon="User"
              :model-value="loginFormData.username"
              @update:modelValue="(val: string) => (loginFormData.username = val)"
            />
            <EIBInput
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

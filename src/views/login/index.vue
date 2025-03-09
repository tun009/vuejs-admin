<script lang="ts" setup>
import { LoginFormModel } from '@/@types/pages/login'
import EIBInput from '@/components/common/EIBInput.vue'
import { DASHBOARD_PAGE, LANDING_PAGE } from '@/constants/router'
import { useUserStore } from '@/store/modules/user'
import { requireRule } from '@/utils/validate'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Background from './components/Background.vue'
import { DATA_LOGIN_DEFAULT } from '@/constants/common'

const router = useRouter()
const loginFormRef = ref<FormInstance | null>(null)
const { t } = useI18n()
const { login } = useUserStore()

const loading = ref(false)
const rememberPassword = ref(false)
const loginFormData: LoginFormModel = reactive({
  username: '',
  password: ''
})

// Kiểm tra xem có thông tin đăng nhập đã lưu không
onMounted(() => {
  const savedUsername = localStorage.getItem('rememberedUsername')
  const savedPassword = localStorage.getItem('rememberedPassword')

  if (savedUsername && savedPassword) {
    loginFormData.username = savedUsername
    loginFormData.password = savedPassword
    rememberPassword.value = true
  }
})

const loginFormRules: FormRules = {
  username: [requireRule()],
  password: [requireRule()],
  code: []
}

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        loading.value = true

        // Lưu thông tin đăng nhập nếu chọn "Ghi nhớ đăng nhập"
        if (rememberPassword.value) {
          localStorage.setItem('rememberedUsername', loginFormData.username)
          localStorage.setItem('rememberedPassword', loginFormData.password)
        } else {
          localStorage.removeItem('rememberedUsername')
          localStorage.removeItem('rememberedPassword')
        }
        debugger
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

const goToRegister = () => {
  // Chuyển đến trang đăng ký
  ElMessage({
    showClose: true,
    type: 'info',
    message: 'Chức năng đăng ký đang được phát triển'
  })
}

const goToLanding = () => {
  router.push(LANDING_PAGE)
}

const loginAsAdmin = async () => {
  const client_id = DATA_LOGIN_DEFAULT.admin.client_id
  const redirect_uri = encodeURIComponent(`${window.location.origin}/auth/callback`)
  const response_type = 'code'
  const state = DATA_LOGIN_DEFAULT.admin.state
  const url = `${import.meta.env.VITE_BASE_API}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&state=${state}`
  window.location.href = url
}
</script>

<template>
  <div>
    <Background>
      <template #form>
        <div class="flex flex-col gap-8 w-full h-full items-center justify-center relative">
          <div class="flex flex-col items-center mb-4">
            <!-- <img src="@/assets/images/logo.png" alt="Logo" class="h-12 mb-2" /> -->
            <el-text tag="h1" class="text-3xl font-bold">Đăng nhập</el-text>
            <el-text tag="p" class="text-gray-600 mt-2">Chào mừng trở lại! Vui lòng nhập thông tin</el-text>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginFormData"
            :rules="loginFormRules"
            @keyup.enter="handleLogin"
            class="w-full max-w-[500px] mx-auto"
          >
            <EIBInput
              name="username"
              label="Email/Tên đăng nhập"
              placeholder="Nhập email hoặc tên đăng nhập"
              :prefix-icon="User"
              :model-value="loginFormData.username"
              @update:modelValue="(val: string) => (loginFormData.username = val)"
            />
            <EIBInput
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              :prefix-icon="Lock"
              show-password
              type="password"
              :model-value="loginFormData.password"
              @update:modelValue="(val: string) => (loginFormData.password = val)"
            />

            <div class="flex justify-between items-center mb-4">
              <el-checkbox v-model="rememberPassword">Ghi nhớ đăng nhập</el-checkbox>
              <el-button type="text" class="text-primary hover:text-blue-600">Quên mật khẩu?</el-button>
            </div>

            <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin" class="w-full mb-4">
              Đăng nhập
            </el-button>

            <div class="flex justify-center mb-4 items-center">
              <span class="text-gray-600">Bạn chưa có tài khoản? </span>
              <el-button type="text" class="text-primary hover:text-blue-600 ml-1" @click="goToRegister"
                >Đăng ký</el-button
              >
            </div>

            <div class="flex justify-center space-x-4">
              <el-button type="default" @click="goToLanding">Quay lại trang chủ</el-button>
              <el-button type="success" @click="loginAsAdmin">Đăng nhập Admin</el-button>
            </div>
          </el-form>

          <el-text tag="span" class="absolute bottom-4 text-gray-500"
            >© GPM Software 2025. All rights reserved.</el-text
          >
        </div>
      </template>
    </Background>
  </div>
</template>

<style scoped>
:deep(.el-checkbox__label) {
  color: #606266;
}

:deep(.el-button--text) {
  padding: 0;
}
</style>

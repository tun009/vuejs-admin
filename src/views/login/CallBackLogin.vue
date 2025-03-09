<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { DASHBOARD_PAGE, LOGIN_PAGE } from '@/constants/router'

const router = useRouter()
const { t } = useI18n()
const { loginWithAuthorizeCode } = useUserStore()
const loading = ref(true)
const loadingText = ref('Đang đăng nhập, vui lòng đợi...')

onMounted(async () => {
  try {
    // Lấy code từ URL
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (!code) {
      throw new Error('Không tìm thấy mã xác thực')
    }

    // Thêm await để đảm bảo lỗi được bắt trong khối catch
    await loginWithAuthorizeCode(code)

    ElMessage({
      showClose: true,
      type: 'success',
      message: t('notification.description.loginSuccess')
    })

    loading.value = false
    setTimeout(() => {
      router.push({ path: DASHBOARD_PAGE })
    }, 2000)
  } catch (error) {
    console.error('Lỗi đăng nhập:', error)
    loadingText.value = 'Đăng nhập thất bại, đang chuyển hướng...'

    ElMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập'
    })
    setTimeout(() => {
      router.push(LOGIN_PAGE)
    }, 2000)
  }
})
</script>

<template>
  <div class="callback-container">
    <el-card class="login-card" v-if="loading">
      <div class="loading-content">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <h2 class="loading-title">{{ loadingText }}</h2>
      </div>
    </el-card>
    <div v-else>
      <el-result icon="success" title="Đăng nhập thành công" sub-title="Đang chuyển hướng đến trang chính..." />
    </div>
  </div>
</template>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  text-align: center;
}

.loading-icon {
  font-size: 32px;
  color: var(--el-color-primary);
  animation: rotate 2s linear infinite;
  margin-bottom: 16px;
}

.loading-title {
  margin-bottom: 24px;
  font-size: 18px;
  color: #606266;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

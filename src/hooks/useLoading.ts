import { ref } from 'vue'
import { ElLoading } from 'element-plus'

export function useLoading() {
  const loadingInstance = ref<any>(null)

  const startLoading = () => {
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      lock: true,
      text: 'Loading...'
    })
  }

  const stopLoading = () => {
    if (loadingInstance.value) {
      loadingInstance.value.close()
      loadingInstance.value = null
    }
  }

  return {
    startLoading,
    stopLoading
  }
}

<template>
  <span @click.stop="dialog = true">
    <slot name="button">
      <el-button text type="primary">{{ textButton }}</el-button>
    </slot>
  </span>
  <el-drawer
    v-model="dialog"
    :before-close="beforeClose"
    direction="rtl"
    class="demo-drawer"
    :with-header="false"
    size="40%"
  >
    <div class="flex flex-row h-full">
      <div class="w-12 bg-[#005d98] flex justify-center py-3 px-2">
        <div @click="dialog = false">
          <el-icon class="w-5 cursor-pointer"><CloseBold style="color: white; height: 20px; width: 20px" /></el-icon>
        </div>
      </div>
      <div class="demo-drawer__content p-8 flex flex-col gap-5 w-full">
        <el-text class="text-xl uppercase font-bold">{{ $t(title ?? '') }}</el-text>
        <slot />
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElDrawer, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

interface Props {
  textButton?: string
  title?: string
}

interface Exposes {
  closeDrawer: () => void
  openDrawer: () => void
}

interface Emits {
  (event: 'close'): void
}

const emits = defineEmits<Emits>()
defineProps<Props>()
const { t } = useI18n()
const dialog = ref(false)

const closeDrawer = () => {
  dialog.value = false
}

const openDrawer = () => {
  dialog.value = true
}

const beforeClose = (done: any) => {
  ElMessageBox.confirm(t('notification.description.confirmCloseDrawer'))
    .then(() => {
      setTimeout(() => {
        done()
        emits('close')
      }, 200)
    })
    .catch(() => {
      // catch error
    })
}

defineExpose<Exposes>({
  closeDrawer,
  openDrawer
})
</script>

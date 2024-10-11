<script lang="ts" setup>
import { CloseBold } from '@element-plus/icons-vue'
import { ElDrawer, ElMessageBox } from 'element-plus'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  textButton?: string
  title?: string
  modelValue: boolean
  size?: string | number
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt'
}

interface Emits {
  (event: 'update:model-value', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'rtl',
  size: '40%'
})
const emits = defineEmits<Emits>()

const { t } = useI18n()

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:model-value', newValue)
  }
})

const beforeClose = (done: any) => {
  ElMessageBox.confirm(t('notification.description.confirmClose'))
    .then(() => {
      setTimeout(() => {
        done()
      }, 200)
    })
    .catch(() => {
      // catch error
    })
}
</script>

<template>
  <span v-if="textButton" @click.stop="localModelValue = true">
    <slot name="button">
      <el-button text type="primary">{{ textButton }}</el-button>
    </slot>
  </span>
  <el-drawer
    v-model="localModelValue"
    :before-close="beforeClose"
    :direction="direction"
    class="demo-drawer"
    :with-header="false"
    :size="size"
    modal-fade
  >
    <div class="flex flex-row h-full">
      <div class="w-12 bg-[#005d98] flex justify-center py-3 px-2">
        <div @click="localModelValue = false">
          <el-icon class="w-5 cursor-pointer"><CloseBold style="color: white; height: 20px; width: 20px" /></el-icon>
        </div>
      </div>
      <div class="demo-drawer__content p-8 flex flex-col gap-5 w-full">
        <el-text class="text-xl uppercase c-text-title self-auto">{{ $t(title ?? '') }}</el-text>
        <slot />
      </div>
    </div>
  </el-drawer>
</template>

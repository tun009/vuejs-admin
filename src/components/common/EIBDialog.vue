<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  title?: string
  modelValue: boolean
  loading?: boolean
  type?: 'default' | 'text' | 'success' | 'warning' | 'info' | 'primary' | 'danger'
}

interface Emits {
  (event: 'update:model-value', value: boolean): void
  (event: 'on-confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Xác nhận',
  type: 'primary'
})
const emits = defineEmits<Emits>()

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:model-value', newValue)
  }
})
</script>

<template>
  <el-dialog v-model="localModelValue" :title="title" width="500">
    <slot />
    <template #footer>
      <div class="flex flex-row items-center justify-between">
        <slot name="footer-left" />
        <div class="ml-auto">
          <slot name="footer-right" />
          <el-button @click="localModelValue = false">Đóng</el-button>
          <el-button :type="type" plain @click="$emit('on-confirm')" :loading="loading" :disabled="loading">
            Xác nhận
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

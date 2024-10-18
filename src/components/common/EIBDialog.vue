<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  title?: string
  modelValue: boolean
  loading?: boolean
}

interface Emits {
  (event: 'update:model-value', value: boolean): void
  (event: 'on-confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Xác nhận'
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
      <div class="dialog-footer">
        <el-button @click="localModelValue = false">Đóng</el-button>
        <el-button type="primary" @click="$emit('on-confirm')" :loading="loading"> Xác nhận </el-button>
      </div>
    </template>
  </el-dialog>
</template>

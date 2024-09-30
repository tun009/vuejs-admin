<template>
  <div class="flex flex-col mb-2">
    <label v-if="label" class="mb-1 text-md"><span v-if="required" class="text-red-600 mr-2">*</span>{{ label }}</label>
    <el-form-item :prop="name">
      <el-input
        v-bind="props"
        :model-value="modelValue"
        :prefix-icon="prefixIcon"
        :type="type"
        @update:model-value="updateValue"
      />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, Component } from 'vue'
import { ElInput } from 'element-plus'

interface Props {
  modelValue: string
  label?: string
  prefixIcon?: string | Component
  type?: 'text' | 'number' | 'password' | 'checkbox' | 'radio'
  size?: 'default' | 'small' | 'large'
  placeholder?: string
  showPassword?: boolean
  name: string
  required?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  type: 'text',
  size: 'large'
})

const emit = defineEmits<Emits>()
const updateValue = (value: string) => {
  emit('update:modelValue', value)
}
</script>

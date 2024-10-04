<template>
  <div class="flex flex-col mb-2 text-sm input-component">
    <div class="flex flex-row items-center justify-between">
      <label
        v-if="label"
        class="mb-1"
        :class="{
          'text-gray-600': readonly
        }"
        ><span v-if="required && !readonly" class="text-red-600 mr-1">*</span>{{ label }}</label
      >
      <span v-if="showLimit && !readonly">{{
        $t('base.input.limit', { length: modelValue.length, maxLength: maxLength })
      }}</span>
    </div>
    <span v-if="readonly" class="text-[18px] leading-[24px] font-normal">{{ modelValue }}</span>
    <el-form-item :prop="name" v-else>
      <el-input
        v-bind="props"
        :model-value="modelValue"
        :prefix-icon="prefixIcon"
        :type="type"
        @update:model-value="updateValue"
        :disabled="disabled"
        :maxlength="maxLength"
        :class="[customClass]"
      />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, Component } from 'vue'
import { ElInput } from 'element-plus'

interface Props {
  modelValue?: string
  label?: string
  prefixIcon?: string | Component
  type?: 'text' | 'number' | 'password' | 'checkbox' | 'radio'
  size?: 'default' | 'small' | 'large'
  placeholder?: string
  showPassword?: boolean
  name?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  showLimit?: boolean
  readonly?: boolean
  customClass?: string
  noForm?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  type: 'text',
  size: 'large',
  maxLength: 100
})

const emit = defineEmits<Emits>()
const updateValue = (value: string) => {
  emit('update:modelValue', value)
}
</script>

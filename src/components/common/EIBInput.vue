<script setup lang="ts">
import { Component } from 'vue'
import { ElInput } from 'element-plus'

interface Props {
  modelValue?: string | number
  label?: string
  prefixIcon?: string | Component
  type?: 'text' | 'number' | 'password' | 'checkbox' | 'radio' | 'textarea'
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
  isRow?: boolean
  hiddenError?: boolean
  rows?: number
  autosize?: { minRows: number; maxRows: number }
  emptyValue?: string
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  type: 'text',
  size: 'large',
  maxLength: 200,
  emptyValue: '',
  autosize: () => ({ minRows: 2, maxRows: 6 })
})

const emit = defineEmits<Emits>()
const updateValue = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    class="flex flex-col mb-2 text-sm w-full"
    :class="{
      '!flex-row justify-center gap-4': isRow,
      '!mb-0': hiddenError
    }"
  >
    <div class="flex flex-row items-center justify-between">
      <label
        v-if="label"
        class="mb-1"
        :class="{
          'text-[#868e96]': readonly,
          'text-right w-32 mb-5': isRow
        }"
        ><span v-if="required && !readonly" class="text-red-600 mr-1">*</span>{{ $t(label) }}</label
      >
      <span v-if="showLimit && !readonly && !disabled">{{
        $t('base.input.limit', {
          length: (modelValue ?? '')?.toString()?.length,
          maxLength: maxLength
        })
      }}</span>
    </div>
    <span v-if="readonly" class="text-sm leading-[24px] font-normal text-[#495057]">{{
      modelValue ? modelValue : emptyValue
    }}</span>
    <el-form-item :prop="name" v-else class="w-full" :class="{ '!mb-0': hiddenError }">
      <el-input
        v-bind="props"
        :model-value="modelValue"
        :prefix-icon="prefixIcon"
        :type="type"
        @update:model-value="updateValue"
        :disabled="disabled"
        :maxlength="maxLength"
        :rows="rows"
        :class="[customClass]"
        :placeholder="$t(placeholder ?? '')"
        :autosize="autosize"
      />
    </el-form-item>
  </div>
</template>

<style>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}
</style>

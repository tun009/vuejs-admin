<template>
  <div
    class="flex flex-col mb-2 text-sm input-component"
    :class="{
      '!flex-row justify-center gap-4': isRow
    }"
  >
    <div class="flex flex-row items-center justify-between">
      <label
        v-if="label"
        class="mb-1"
        :class="{
          'text-gray-600': readonly,
          'w-40 text-right mb-5': isRow
        }"
        ><span v-if="required && !readonly" class="text-red-600 mr-1">*</span>{{ $t(label) }}</label
      >
    </div>
    <el-form-item :prop="name" class="w-full">
      <el-select
        :model-value="modelValue"
        :placeholder="placeholder"
        size="large"
        @update:model-value="updateValue"
        :disabled="readonly"
        class="w-full"
      >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          <div class="flex flex-row gap-2">
            <el-icon class="mt-[10px]" :class="{ 'opacity-0': item.value !== modelValue }"><Check /></el-icon>
            <div class="flex flex-col">
              <span>{{ item.label }}</span>
              <span class="select-description">{{ item?.description }}</span>
            </div>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'

import { SelectOptionModel } from '@/@types/common'

interface Props {
  modelValue: any
  options: SelectOptionModel[]
  placeholder?: string
  label?: string
  readonly?: boolean
  required?: boolean
  name?: string
  isRow?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

defineProps<Props>()

const emit = defineEmits<Emits>()
const updateValue = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.el-select-dropdown__item {
  height: fit-content;
  font-weight: 500 !important;

  .select-description {
    color: #868e96;
  }
}
</style>

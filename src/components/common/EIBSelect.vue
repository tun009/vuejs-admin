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
  hiddenError?: boolean
  multiple?: boolean
  maxCollapseTags?: number
  teleported?: boolean
  popperClass?: string
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

withDefaults(defineProps<Props>(), {
  teleported: true
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
          'text-gray-600': readonly,
          'w-32 text-right mb-5': isRow
        }"
        ><span v-if="required && !readonly" class="text-red-600 mr-1">*</span>{{ $t(label) }}</label
      >
    </div>
    <el-form-item :prop="name" class="w-full" :class="{ '!mb-0': hiddenError }">
      <el-select
        :model-value="modelValue"
        :placeholder="placeholder"
        size="large"
        @update:model-value="updateValue"
        :disabled="readonly"
        class="w-full"
        :teleported="teleported"
        collapse-tags
        collapse-tags-tooltip
        :multiple="multiple"
        :max-collapse-tags="maxCollapseTags"
        :popper-class="popperClass"
      >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          <div class="flex flex-row gap-2">
            <el-icon
              class="mt-[10px] opacity-0"
              :class="{
                'opacity-100':
                  item.value === modelValue || (typeof modelValue === 'object' && modelValue?.includes(item.value))
              }"
              ><Check
            /></el-icon>
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

<style lang="scss" scoped>
.el-select-dropdown__item {
  height: fit-content;
  font-weight: 500 !important;

  .select-description {
    color: #868e96;
  }
}
</style>

<template>
  <el-text
    ref="buttonRef"
    v-click-outside="onClickOutside"
    :class="[customClass]"
    class="cursor-pointer flex flex-row items-center gap-1 w-fit"
  >
    <span class="font-semibold">{{ title }}:</span>
    <div class="text-primary">{{ renderLabelByValue(options, modelValue) }}</div>
    <el-icon class="ml-2 transition-all duration-300" :class="{ 'rotate-180': isShow, 'rotate-0': !isShow }"
      ><ArrowDownBold
    /></el-icon>
  </el-text>

  <el-popover
    placement="bottom-start"
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    virtual-triggering
    v-model:visible="isShow"
    width="unset"
  >
    <div class="flex flex-col gap-3 max-h-96 overflow-y-auto">
      <div
        v-for="option in options"
        :key="option.value"
        class="flex flex-row items-center gap-3 cursor-pointer group"
        @click="$emit('update:model-value', option.value)"
      >
        <div class="w-4 flex items-center">
          <el-icon v-if="option.value === modelValue" :size="16" :color="COLORS.primary"><Check /></el-icon>
        </div>
        <span
          class="group-hover:text-primary"
          :class="{
            'text-primary': option.value === modelValue
          }"
          >{{ option.label }}</span
        >
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { SelectOptionModel } from '@/@types/common'
import { ArrowDownBold, Check } from '@element-plus/icons-vue'
import { renderLabelByValue } from '@/utils/common'
import { COLORS } from '@/constants/color'

interface Props {
  title: string
  modelValue: string | number
  multiple?: boolean
  options?: SelectOptionModel[]
  customClass?: string
}

interface Emits {
  (event: 'update:model-value', value: string | number): void
}

withDefaults(defineProps<Props>(), {
  modelValue: -1,
  options: () => []
})
defineEmits<Emits>()

const isShow = ref<boolean>(false)

const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
</script>

<template>
  <el-text
    ref="buttonRef"
    v-click-outside="onClickOutside"
    class="cursor-pointer flex flex-row items-center gap-1 w-fit"
  >
    <span class="font-semibold">{{ title }}:</span>
    <div class="text-[#005d98] w-6">+{{ modelValue.length }}</div>
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
  >
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
      Tất cả
    </el-checkbox>
    <el-checkbox-group v-model="localModelValue" @change="handleCheckedChange">
      <el-checkbox v-for="option in options" :key="option.value" :label="option.label" :value="option.value">
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue'
import { SelectOptionModel } from '@/@types/common'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { CheckboxValueType } from 'element-plus'

interface Props {
  title: string
  modelValue: string[] | number[]
  multiple?: boolean
  options: SelectOptionModel[]
}

interface Emits {
  (event: 'update:model-value', value: string[] | number[]): void
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  modelValue: () => []
})
const emits = defineEmits<Emits>()

const allValue = computed(() => {
  return props.options.map((p) => p.value)
})

const checkAll = ref(true)
const isIndeterminate = ref(true)
const isShow = ref<boolean>(false)

const handleCheckAllChange = (val: CheckboxValueType) => {
  emits('update:model-value', val ? allValue.value : [])
  isIndeterminate.value = false
}

const handleCheckedChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === props.options.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.options.length
}

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:model-value', newValue)
  }
})

const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

onMounted(() => {
  emits('update:model-value', allValue.value)
})
</script>

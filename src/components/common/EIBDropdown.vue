<script lang="ts" setup>
import { SelectOptionModel } from '@/@types/common'
import { computed } from 'vue'

interface Props {
  value?: string
  options?: SelectOptionModel[]
  btnClassName?: string
  optionClassName?: string
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const title = computed(() => {
  return props.options?.find((o) => o.value === props.value)?.label
})
</script>

<template>
  <el-dropdown class="eib-dropdown">
    <el-button type="primary" class="h-10" :class="btnClassName">
      <div class="w-full flex flex-row justify-between">
        <span>{{ title }}</span
        ><el-icon class="el-icon--right"><arrow-down /></el-icon>
      </div>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu :class="optionClassName">
        <el-dropdown-item
          v-for="(item, index) in options"
          :key="index"
          @click="emit('update:modelValue', item.value)"
          :class="optionClassName"
          >{{ item.label }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss">
.eib-dropdown {
  .el-button > span {
    width: 100%;
  }
}
</style>

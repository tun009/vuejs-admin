<script lang="ts" setup>
interface Props {
  color?: string
  content: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#c92a2a'
})
</script>

<template>
  <div
    class="flex items-center text-[#c92a2a] gap-[8px] ml-[10px] mt-[6px] ml-auto mr-[20px]"
    :class="[`text-[${props?.color}]]`]"
  >
    <el-dropdown placement="top">
      <el-icon :size="18" class="cursor-pointer ml-1 outline-[0px]" :class="[`text-[${props?.color}]`]"
        ><InfoFilled
      /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <div class="px-1">{{ content }}</div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    Đã từ chối
  </div>
</template>

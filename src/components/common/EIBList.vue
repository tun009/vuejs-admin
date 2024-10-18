<script lang="ts" setup>
interface Props {
  data: (string | number)[]
  color?: string
}

withDefaults(defineProps<Props>(), {
  color: '#495057'
})
</script>

<template>
  <div class="flex flex-col gap3">
    <div v-for="(item, index) in data" :key="index" class="flex flex-row items-center gap-2">
      <div
        class="h-1 w-1 rounded-sm"
        :style="{
          backgroundColor: color
        }"
      />
      <span :style="{ color }">{{ item }}</span>
    </div>
  </div>
</template>

<template>
  <div class="text-xl text-[#495057] font-medium mb-4">{{ $props.title }}</div>
</template>

<script lang="ts" setup>
interface Props {
  title: string
  className?: string
}
defineProps<Props>()
</script>

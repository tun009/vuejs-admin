<script setup lang="ts">
import { LoginBackgound, LoginBackgoundIcon } from '@/assets'
</script>

<template>
  <div class="flex flex-row overflow-y-hidden max-h-[100vh]">
    <div class="relative w-[50%]">
      <el-image :src="LoginBackgound" class="w-full h-[100vh] bg-[rgba(241,243,245,0.3)]" fit="cover" />
      <el-image
        :src="LoginBackgoundIcon"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <!-- <el-image :src="EximbankLogo" class="absolute top-8 left-8" /> -->
    </div>
    <div class="flex flex-1 justify-center items-center px-20 py-20">
      <slot name="form" />
    </div>
  </div>
</template>

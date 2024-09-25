<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({
  name: 'Menu1-2-1'
})

const text = ref('')
</script>

<template>
  <div class="app-container">
    <el-card header="Level 4 routing cache - menu1-2-1">
      <el-input v-model="text" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ref } from 'vue'

import DocumentInformation from './components/DocumentInformation.vue'
import DocumentFiles from './components/DocumentFiles.vue'

import { handleComingSoon } from '@/utils/common'

const activeName = ref('docInfo')
</script>

<template>
  <div class="">
    <div class="flex flex-row justify-between items-center">
      <span class="text-2xl">KIEMGOC.2024.00133</span>
      <div class="flex flex-row gap-2">
        <el-button :icon="ArrowLeft" type="primary" plain @click="handleComingSoon">Bộ trước</el-button>
        <el-button type="primary" plain @click="handleComingSoon"
          >Bộ sau<el-icon class="el-icon--right"><ArrowRight /></el-icon
        ></el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="Thông tin bộ chứng từ" name="docInfo">
        <DocumentInformation />
      </el-tab-pane>
      <el-tab-pane label="Danh sách file giấy từ" name="docFile">
        <DocumentFiles />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped></style>

<template>
  <Title :title="$t('docs.title')" />
  <div class="flex flex-col gap-5">
    <div class="flex flex-row justify-between gap-10">
      <div class="flex flex-row gap5 items-center _filter gap-5">
        <Input
          v-model="searchQuery"
          custom-class="w-[300px]"
          placeholder="docs.document.searchByName"
          :prefix-icon="Search"
        />
        <el-button :icon="Filter" @click="handleComingSoon">{{ $t('docs.document.filter') }}</el-button>
      </div>
      <div class="flex flex-row gap-3">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
      </div>
    </div>
    <el-card>
      <Table locales :columnConfigs="docListColumnConfigs" :data="tableData" :callback="handleGetDocuments">
        <template #status="{ row }">
          <span>{{ renderLabelByValue(documentStatusOptions, row.status) }}</span>
        </template>
        <template #businessType="{ row }">
          <span>{{ renderLabelByValue(businessTypeOptions, row.businessType) }}</span>
        </template>
        <template #processingStep="{ row }">
          <span>{{ renderLabelByValue(processingStepOptions, row.processingStep) }}</span>
        </template>
        <template #result="{ row }">
          <span>{{ renderLabelByValue(documentResultOptions, row.result) }}</span>
        </template>
        <template #actions>
          <div class="flex flex-row gap-2">
            <el-icon :size="18" class="cursor-pointer"><Edit /></el-icon>
            <el-icon :size="18" color="#e03131" class="cursor-pointer"><Delete /></el-icon>
          </div>
        </template>
      </Table>
    </el-card>
  </div>
  <UploadDocuments v-if="dialogVisible" v-model="dialogVisible" />
</template>

<script lang="ts" setup>
import { PaginationModel } from '@/@types/common'
import {
  DocumentModel,
  businessTypeOptions,
  docListColumnConfigs,
  documentResultOptions,
  documentStatusOptions,
  processingStepOptions
} from '@/@types/pages/docs/documents'
import { getDocuments } from '@/api/docs/docs'
import Input from '@/components/common/Input.vue'
import Table from '@/components/common/Table.vue'
import { Title } from '@/layouts/components'
import { handleComingSoon, renderLabelByValue } from '@/utils/common'
import { Delete, Edit, Filter, Plus, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import UploadDocuments from '../components/UploadDocuments.vue'

const searchQuery = ref('')
const tableData = ref<DocumentModel[]>([])
const dialogVisible = ref(false)

const handleGetDocuments = async (pagination: PaginationModel) => {
  try {
    const response = await getDocuments({ ...pagination, searchQuery: searchQuery.value })
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}
</script>

<style lang="css" scoped>
._filter :deep(.el-form-item),
._filter :deep(.input-component) {
  margin-bottom: 0px;
}
</style>

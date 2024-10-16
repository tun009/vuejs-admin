<script setup lang="ts">
import { ref } from 'vue'

import UpdateInfoExtractForm from '../components/UpdateInfoExtractForm.vue'

import { PaginationModel } from '@/@types/common'
import { SettingModel, dataSelectDocs, infoListColumnConfigs } from '@/@types/pages/docs/settings'
import { getSettings } from '@/api/docs/settings'
import Drawer from '@/components/common/EIBDrawer.vue'
import Select from '@/components/common/EIBSelect.vue'
import Table from '@/components/common/EIBTable.vue'

const docs = ref<string>('')
const activeName = ref('first')
const tableData = ref<SettingModel[]>([])
const disabledIds = [1]

const handleGetSettings = async (pagination: PaginationModel) => {
  try {
    const response = await getSettings(pagination)
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}
const openUpdateInfoExtractDrawer = ref(false)
</script>

<template>
  <div>
    <div class="text-[#495057] mb-5">Cài đặt</div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="Trường thông tin trích xuất" name="first">
        <Select
          v-model="docs"
          name="docs"
          :options="dataSelectDocs"
          label="Thông tin trường trích xuất cho loại chứng từ"
        />

        <Table
          :columnConfigs="infoListColumnConfigs"
          :data="tableData"
          :hiddenChecked="true"
          :hiddenPagination="true"
          :callback="handleGetSettings"
          :disabledIds="disabledIds"
        >
          <template #actions>
            <div class="flex flex-row gap-2 p-2">
              <el-icon :size="18" class="cursor-pointer" @click="openUpdateInfoExtractDrawer = true"><Edit /></el-icon>
            </div>
          </template>
        </Table>
      </el-tab-pane>
      <el-tab-pane label="Độ tin cậy" name="second">
        <div>Cấu hình màu sắc độ tin cậy của dữ liệu</div>
      </el-tab-pane>
      <el-tab-pane label="Tự động hóa" name="third" />
    </el-tabs>
  </div>
  <Drawer v-model="openUpdateInfoExtractDrawer" title="Cập nhật trường trích xuất">
    <template #default>
      <UpdateInfoExtractForm ref="updateInfoExtractFormRef" @close="openUpdateInfoExtractDrawer = false" />
    </template>
  </Drawer>
</template>

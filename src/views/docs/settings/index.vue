<script setup lang="ts">
import { ref } from 'vue'

import UpdateInfoExtractForm from '../components/UpdateInfoExtractForm.vue'

import { PaginationModel } from '@/@types/common'
import { SettingModel, dataSelectDocs, infoListColumnConfigs } from '@/@types/pages/docs/settings'
import { getSettings } from '@/api/docs/settings'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { CONFIDENCES } from '@/constants/setting'

const docs = ref<string>('')
const activeName = ref('first')
const tableData = ref<SettingModel[]>([])
const disabledIds = [1]
const ruleForm = ref(CONFIDENCES)
const dataInput = ref(CONFIDENCES)
const ruleForm1 = ref({
  dataSource: 0
})
const automation = ref({
  type: 0,
  extractionThreshold: 80
})

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
        <EIBSelect
          v-model="docs"
          name="docs"
          :options="dataSelectDocs"
          label="Thông tin trường trích xuất cho loại chứng từ"
        />

        <EIBTable
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
        </EIBTable>
      </el-tab-pane>
      <el-tab-pane label="Độ tin cậy" name="second">
        <div class="mb-2">Cấu hình màu sắc độ tin cậy của dữ liệu</div>
        <el-card style="height: 100%">
          <el-form ref="ruleFormRef" autocomplete="on">
            <div class="reliability-wrapper">
              <div class="reliability">
                <div class="confidence-threshold w-full">
                  <div class="mb-2">Ngưỡng tin cậy<span class="ml-[10%]">Màu</span></div>
                  <div class="confidence-threshold">
                    <div
                      class="confidence-threshold-item mb-[22px] bg-[#f8f8fa] p-[10px]"
                      v-for="(item, index) in dataInput"
                      :key="index"
                    >
                      <el-input v-model="item.confidence" class="w-[100px] h-[40px]" />
                      <span class="mt-[-6px]">-</span>
                      <el-input v-model="item.confidence" class="w-[100px] h-[40px]" />
                      <div class="color-wrapper ml-2">
                        <div class="color-item">
                          <el-color-picker v-model="item.color" color-format="hex" />
                          <span>{{ item.color }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <b-button class="btn-red mt-3 save-btn" variant="none">Lưu thay đổi</b-button> -->
              <el-button type="primary" style="width: 110px">Lưu thay đổi</el-button>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Luồng kiểm tra" name="third">
        <el-card>
          <el-form ref="ruleForm" class="" :model="ruleForm1" autocomplete="on">
            <div class="mt-1 d-flex flex-column g-6 auto-validation">
              <div class="mt-1 d-flex flex-column g-4">
                <el-radio-group v-model="automation.type">
                  <div class="w-full">
                    <el-radio :label="2"
                      ><span>Không tự động</span><br />
                      <div class="radio-description">
                        Dữ liệu sau khi nhận dạng OCR sẽ luôn ở trạng thái
                        <span class="text-[#e8590c]">Chờ kiểm tra</span>. Cần người dùng kiểm tra kết quả trích xuất OCR
                        và kết quả kiểm tra tính hợp lệ Bộ chứng từ (đối sánh)
                      </div>
                      <div class="confidence-slider-wrapper" />
                    </el-radio>
                  </div>
                  <div class="w-full">
                    <el-radio :label="1"
                      ><span>Dựa vào độ tin cậy</span><br />
                      <div class="radio-description">
                        Các trường dữ liệu có độ tin cậy ≥ Ngưỡng tự động, sẽ tự động chuyển sang trạng thái
                        <span class="text-[#005d98]">Đã kiểm tra</span>, và chờ người dùng thực hiện Trình phê duyệt
                      </div></el-radio
                    >
                    <div class="mt-2 pl-3">
                      <div class="pt-6 pl-3 text-[14px]">Ngưỡng tự động</div>
                      <div class="confidence-slider-wrapper pl-3">
                        <el-slider
                          :disabled="automation.type !== 1"
                          v-model="automation.extractionThreshold"
                          :show-tooltip="false"
                          class="confidence-slider"
                        />
                        <span class="confidence-value">{{ `${automation.extractionThreshold}%` }}</span>
                        <div class="confidence-value-controls">
                          <button :disabled="automation.type !== 1">
                            <el-icon class="el-icon-caret-top pointer" />
                          </button>
                          <button :disabled="automation.type !== 1">
                            <el-icon class="el-icon-caret-bottom pointer" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-full">
                    <el-radio :label="0"
                      ><span>Luôn tự động</span><br />
                      <div class="radio-description">
                        Dữ liệu sau khi nhận dạng OCR sẽ luôn ở trạng thái
                        <span class="text-[#005d98]">Đã kiểm tra</span> và chờ người dùng thực hiện Trình phê duyệt
                      </div></el-radio
                    >
                  </div>
                </el-radio-group>
              </div>
              <el-button type="primary" style="width: 110px" class="btn-red mt-10 save-btn" variant="none"
                >Lưu thay đổi</el-button
              >
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
  <EIBDrawer v-model="openUpdateInfoExtractDrawer" title="Cập nhật trường trích xuất">
    <template #default>
      <UpdateInfoExtractForm ref="updateInfoExtractFormRef" @close="openUpdateInfoExtractDrawer = false" />
    </template>
  </EIBDrawer>
</template>

<style>
:deep(.auto-validation .el-form-item) {
  margin-bottom: 0 !important;
}
:deep(.tab-pane) {
  padding: 24px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 #c1c9db;
  border: solid 1px #f1f3f5;
  background-color: #fff;
}

:deep(.el-radio__label) {
  padding-top: 26px;
}
</style>

<style scoped>
.g-6 {
  gap: 24px;
}

.g-4 {
  gap: 16px;
}

.setting-type {
  font-size: 20px;
  font-weight: 500;
  color: red;
}

.space-line {
  height: 1px;
  background-color: red;
  width: 40%;
}
.gap-20 {
  gap: 20px;
}

.el-color-picker__trigger,
.el-color-picker {
  padding: 0;
  height: 32px !important;
  width: 32px !important;
}

.color-item {
  border: 1px solid #d5cece;
  border-radius: 4px;
  height: 40px;
  padding: 4px 10px;
}

.reliability-wrapper {
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.save-btn {
  width: fit-content;
}

.el-radio-group {
  /* display: flex; */
  flex-direction: column;
  gap: 30px;
  font-size: inherit;
}

.el-radio__input.is-checked + .el-radio__label {
  color: inherit;
}

.radio-label {
  font-weight: bold;
}

.radio-description {
  /* padding-left: 24px; */
  color: #868e96;
  margin-top: 6px;
}

.el-radio__inner {
  border: 1px solid #8e9095 !important;
}

.confidence-slider {
  width: 200px !important;
}

.confidence-slider-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
}

.confidence-value-controls {
  display: flex;
  flex-direction: column;
}

.confidence-value {
  width: 40px;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: red;
  background: red;
}

.el-slider__bar {
  background-color: red;
}

.el-slider__button {
  border-color: red;
}

.el-switch__label {
  color: inherit !important;
}

.el-switch__label > span {
  font-size: 16px;
}

.pl-50 {
  padding-left: 50px;
}

.confidence-threshold-item,
.color-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.el-input__prefix {
  left: 10px;
}

.el-color-picker__icon {
  display: none !important;
}

.el-color-picker__icon {
  display: none !important;
}

.reliability {
  display: flex;
  flex-direction: row;
  gap: 30px;
}

.confidence-threshold,
.color-wrapper {
  display: flex;
  flex-direction: column;
}

.color-wrapper {
  gap: 22px;
}

.b-sidebar-right {
  width: 592px;
  background: #fff !important;
  font-family: 'Inter', sans-serif;
}
.title {
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: 1px;
  color: #868e96;
}
</style>

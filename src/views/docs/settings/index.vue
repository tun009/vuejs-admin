<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import UpdateInfoExtractForm from '../components/UpdateInfoExtractForm.vue'
import { SettingModel, SettingMD, infoListColumnConfigs } from '@/@types/pages/docs/settings'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import { CONFIDENCES, CONFIDENCE_COLOR_FORM_DEFAULT } from '@/constants/setting'
import { Title } from '@/layouts/components'
import { getDocummentTypeApi } from '@/api/extract'
import { SelectOptionModel } from '@/@types/common'
import { getDocDataField, getConfidence, updateConfidence } from '@/api/docs/settings'
import { requireRule } from '@/utils/validate'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { ConfidenceRequestModel } from '@/@types/pages/docs/settings/services/SettingRequest'
import { sortObjectsByMultipleFields } from '@/utils/common'
import { useI18n } from 'vue-i18n'

const rowSelect = ref<SettingModel>({} as SettingModel)
const doc_types = ref<SelectOptionModel[]>([])
const docTypeID = ref('')
const activeName = ref('first')
const tableData = ref<SettingMD[]>([])
const dataConfidence = ref([])
const requestConfidence = ref([])
const disabledIds = [1]
const ruleForm = ref(CONFIDENCES)
const colors = ref(CONFIDENCE_COLOR_FORM_DEFAULT)
const ruleFormConfidence = ref<FormInstance | null>(null)
const loading = ref(false)
const { t } = useI18n()

interface Emits {
  (event: 'close'): void
  (event: 'refresh'): void
}

const emits = defineEmits<Emits>()
// eslint-disable-next-line no-redeclare
const rules: FormRules<ConfidenceRequestModel> = {
  toConfidence1: [requireRule()],
  toConfidence2: [requireRule()],
  toConfidence3: [requireRule()],
  toConfidence4: [requireRule()]
}
const ruleForm1 = ref({
  dataSource: 0
})
const automation = ref({
  type: 0,
  extractionThreshold: 80
})

const openUpdateInfoExtractDrawer = ref(false)
const handleGetDocTypes = async () => {
  try {
    const response = await getDocummentTypeApi()
    doc_types.value = response.data.map((item) => ({
      label: item.name,
      value: item.id
    }))
  } catch (error: any) {
    throw new Error(error)
  }
}

const getDataField = async () => {
  try {
    const response = await getDocDataField(docTypeID.value)
    tableData.value = response.data
  } catch (error: any) {
    throw new Error(error)
  }
}

const getConfidenceDetail = async () => {
  try {
    const response = await getConfidence()
    const data = sortObjectsByMultipleFields(response?.data, ['max'])
    dataConfidence.value = data
    const resultConfidence = {}
    const resultColor = {}
    data.forEach((item, index) => {
      resultConfidence[`toConfidence${index + 1}`] = item.max * 100
      resultColor[`color${index + 1}`] = '#' + item.color
    })
    ruleForm.value = { ...resultConfidence }
    colors.value = { ...resultColor }
  } catch (error: any) {
    throw new Error(error)
  }
}

const handleUpdateInfoExtract = (row: SettingModel) => {
  openUpdateInfoExtractDrawer.value = true
  rowSelect.value = row
}

const handleUpdateConfidence = async () => {
  ruleFormConfidence.value?.validate(async (valid: boolean, fields: any) => {
    try {
      if (valid) {
        const payload = dataConfidence.value.map((item, index) => ({
          ...item,
          min: index === 0 ? 0 : (Number(ruleForm.value[`toConfidence${index}`]) + 0.1) / 100,
          max: index === dataConfidence.value.length - 1 ? 1 : Number(ruleForm.value[`toConfidence${index + 1}`]) / 100,
          color: colors.value[`color${index + 1}`].split('#')[1]
        }))
        loading.value = true
        requestConfidence.value = []
        for (const data of payload) {
          requestConfidence.value.push(data)
        }
        await updateConfidence(requestConfidence.value)
        ElMessage({
          message: t('notification.description.updateSuccess'),
          showClose: true,
          type: 'success'
        })
        emits('refresh')
      } else {
        console.error('Form validation failed', fields)
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}

watch(
  [() => docTypeID],
  async () => {
    getDataField()
  },
  {
    deep: true
  }
)

onMounted(() => {
  getDataField()
  handleGetDocTypes()
  getConfidenceDetail()
})
</script>

<template>
  <Title title="Cài đặt" />
  <div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="Trường thông tin trích xuất" name="first">
        <EIBSelect
          v-model="docTypeID"
          class="pb-2"
          name="docs"
          :options="doc_types"
          label="Thông tin trường trích xuất cho loại chứng từ"
        />

        <EIBTable
          :columnConfigs="infoListColumnConfigs"
          :data="tableData"
          :hiddenChecked="true"
          :hiddenPagination="true"
          :callback="getDataField"
          :disabledIds="disabledIds"
        >
          <template #actions="{ row }">
            <div class="flex flex-row gap-2 p-2">
              <SvgIcon :size="18" name="edit-info" @click.stop="handleUpdateInfoExtract(row)" class="cursor-pointer" />
            </div>
          </template>
        </EIBTable>
      </el-tab-pane>
      <el-tab-pane label="Độ tin cậy" name="second">
        <div class="mb-2">Cấu hình màu sắc độ tin cậy của dữ liệu</div>
        <el-card style="height: 100%">
          <el-form ref="ruleFormConfidence" autocomplete="on" :model="ruleForm" :rules="rules">
            <div class="reliability-wrapper">
              <div class="reliability">
                <div class="confidence-threshold">
                  <div class="mb-2">Ngưỡng tin cậy</div>
                  <div class="confidence-threshold">
                    <div
                      class="confidence-threshold-item mb-[22px]"
                      v-for="(item, index) in Object.keys(ruleForm)"
                      :key="index"
                    >
                      <EIBInput
                        disabled
                        class="w-[100px] h-[40px]"
                        :name-ref="item + 'first'"
                        :showLabel="false"
                        :modelValue="!index ? 0 : Number(ruleForm[Object.keys(ruleForm)[index - 1]]) + 0.1"
                      />
                      <span class="mt-[-6px]">-</span>
                      <EIBInput
                        :ref="item"
                        v-model="ruleForm[item]"
                        :rules="rules[item]"
                        :rule-form-ref="$refs.ruleFormConfidence"
                        :name-ref="item"
                        :name="item"
                        required
                        :disabled="index === 3"
                        class="w-[100px] h-[40px]"
                      />
                    </div>
                  </div>
                </div>
                <div class="confidence-threshold">
                  <div class="mb-2">Màu</div>
                  <div class="color-wrapper">
                    <div
                      v-for="(item, index) in Object.keys(colors)"
                      :key="index"
                      class="color-item w-[200px] h-[40px] mb-[8px]"
                    >
                      <el-color-picker v-model="colors[item]" color-format="hex" />
                      <span>{{ colors[item] }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <el-button type="primary" :loading="loading" @click.prevent="handleUpdateConfidence" style="width: 110px"
                >Lưu thay đổi</el-button
              >
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Luồng kiểm tra" name="third">
        <el-card>
          <el-form ref="ruleForm5" class="" :model="ruleForm1" autocomplete="on">
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
  <EIBDrawer
    v-if="openUpdateInfoExtractDrawer"
    v-model="openUpdateInfoExtractDrawer"
    title="Cập nhật trường trích xuất"
  >
    <template #default>
      <UpdateInfoExtractForm :data="rowSelect" @refresh="getDataField" @close="openUpdateInfoExtractDrawer = false" />
    </template>
  </EIBDrawer>
</template>

<style>
.auto-validation .el-form-item {
  margin-bottom: 0 !important;
}
.tab-pane {
  padding: 24px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 #c1c9db;
  border: solid 1px #f1f3f5;
  background-color: #fff;
}

.el-radio__label {
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

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import UpdateInfoExtractForm from '../components/UpdateInfoExtractForm.vue'
import {
  SettingModel,
  SettingMD,
  infoListColumnConfigs,
  UpdateConfidenceFormModel,
  UpdateConfidenceColorFormModel,
  AutoCheckConfigEnum
} from '@/@types/pages/docs/settings'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import { CONFIDENCES, CONFIDENCE_COLOR_FORM_DEFAULT } from '@/constants/setting'
import { Title } from '@/layouts/components'
import { getDocummentTypeApi } from '@/api/extract'
import { SelectOptionModel } from '@/@types/common'
import { useUserStore } from '@/store/modules/user'
import {
  getDocDataField,
  getConfidence,
  updateConfidence,
  getAutoCheckConfig,
  updateCheckConfig
} from '@/api/docs/settings'
import { requireRule, RULE_CONFIDENCE } from '@/utils/validate'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { sortObjectsByMultipleFields } from '@/utils/common'
import { useI18n } from 'vue-i18n'
import {
  UpdateCheckConfigRequestModel,
  UpdateConfidenceRequestModel
} from '@/@types/pages/docs/settings/services/SettingRequest'

const { t } = useI18n()

const rowSelect = ref<SettingModel>({} as SettingModel)
const doc_types = ref<SelectOptionModel[]>([])
const docTypeID = ref('')
const activeName = ref('first')
const tableData = ref<SettingMD[]>([])
const dataConfidence = ref<SettingModel[]>([])
const disabledIds = [1]
const loading = ref(false)
const { isAdmin, isChecker, isMaker } = useUserStore()

const ruleForm = ref<UpdateConfidenceFormModel>(CONFIDENCES)
const colors = ref<UpdateConfidenceColorFormModel>(CONFIDENCE_COLOR_FORM_DEFAULT)
const ruleFormConfidence = ref<FormInstance | null>(null)

interface Emits {
  (event: 'close'): void
  (event: 'refresh'): void
}

const emits = defineEmits<Emits>()
const rules: FormRules<UpdateConfidenceFormModel> = {
  toConfidence1: RULE_CONFIDENCE('Ngưỡng tin cậy không hợp lệ', ruleForm, '', 'toConfidence2'),
  toConfidence2: RULE_CONFIDENCE('Ngưỡng tin cậy không hợp lệ', ruleForm, 'toConfidence1', 'toConfidence3'),
  toConfidence3: RULE_CONFIDENCE('Ngưỡng tin cậy không hợp lệ', ruleForm, 'toConfidence2', 'toConfidence4'),
  toConfidence4: [requireRule()]
}
const ruleForm1 = ref({
  dataSource: 0
})
const automation = ref<UpdateCheckConfigRequestModel>({
  id: 0,
  type: AutoCheckConfigEnum.MANUAL,
  autoThreshold: 0
})

const isHaveUpdateInfoExtract = () => {
  if (isAdmin || isChecker) {
    return true
  } else {
    return false
  }
}

const isHaveUpdateConfidence = () => {
  if (isAdmin) {
    return true
  } else if (isChecker || isMaker) {
    return false
  }
}

const isHaveUpdateCheckConfig = () => {
  if (isAdmin) {
    return true
  } else if (isChecker || isMaker) {
    return false
  }
}

const openUpdateInfoExtractDrawer = ref(false)
const validateInput = (event: any, item: any) => {
  const input = event.target.value
  const regex = /^\d*$/
  if (!regex.test(input)) {
    ruleForm.value[item as keyof UpdateConfidenceFormModel] = input.replace(/\D/g, '')
  }
}

const handleGetDocTypes = async () => {
  try {
    const response = await getDocummentTypeApi()
    doc_types.value = response.data.map((item) => ({
      label: item.key,
      value: item.id
    }))
    const newData = doc_types.value.filter((item) => item.label !== 'OTHER')
    doc_types.value = newData
    for (const data in doc_types.value) {
      if (doc_types.value[data].label == 'LETTER_OF_CREDIT') {
        doc_types.value[data].label = 'LC'
      } else if (doc_types.value[data].label == 'INVOICE') {
        doc_types.value[data].label = 'Invoice'
      } else if (doc_types.value[data].label == 'BILL_OF_LADING') {
        doc_types.value[data].label = 'Bill Of Lading'
      } else if (doc_types.value[data].label == 'DRAFT') {
        doc_types.value[data].label = 'Draft'
      } else if (doc_types.value[data].label == 'EXPORT_DOC_PRESENT') {
        doc_types.value[data].label = 'Giấy XTCT'
      }
    }
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
    const resultConfidence: UpdateConfidenceFormModel = { ...CONFIDENCES }
    const resultColor: UpdateConfidenceColorFormModel = { ...CONFIDENCE_COLOR_FORM_DEFAULT }
    data.forEach((item, index) => {
      resultConfidence[`toConfidence${index + 1}` as keyof UpdateConfidenceFormModel] = item.max * 100
      resultColor[`color${index + 1}` as keyof UpdateConfidenceColorFormModel] = item.color
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

const getCheckConfig = async () => {
  try {
    const response = await getAutoCheckConfig()
    automation.value = response.data
    automation.value.autoThreshold = automation.value.autoThreshold * 100
  } catch (error: any) {
    throw new Error(error)
  }
}

const handleUpdateConfidence = async () => {
  ruleFormConfidence.value?.validate(async (valid: boolean, fields) => {
    try {
      if (valid) {
        const payload: UpdateConfidenceRequestModel[] = dataConfidence.value.map((item, index) => ({
          id: item.id,
          min:
            index === 0
              ? 0
              : (Number(ruleForm.value[`toConfidence${index}` as keyof UpdateConfidenceFormModel]) + 0.1) / 100,
          max:
            index === dataConfidence.value.length - 1
              ? 1
              : Number(ruleForm.value[`toConfidence${index + 1}` as keyof UpdateConfidenceFormModel]) / 100,
          color: colors.value[`color${index + 1}` as keyof UpdateConfidenceColorFormModel]
        }))
        loading.value = true
        await updateConfidence(payload)
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

const handleUpdateCheckConfig = async () => {
  try {
    const payload = { ...automation.value, autoThreshold: automation.value.autoThreshold / 100 }
    loading.value = true
    await updateCheckConfig(payload)
    ElMessage({
      message: t('notification.description.updateSuccess'),
      showClose: true,
      type: 'success'
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
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
  handleGetDocTypes()
  getConfidenceDetail()
  getCheckConfig()
})
</script>

<template>
  <Title title="Cài đặt" />
  <div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="Trường thông tin trích xuất" name="first">
        <EIBSelect
          v-model="docTypeID"
          class="py-2"
          name="docs"
          :options="doc_types"
          label="Thông tin trường trích xuất cho loại chứng từ"
          hidden-error
        />

        <EIBTable
          :columnConfigs="infoListColumnConfigs"
          :data="tableData"
          hiddenChecked
          hiddenPagination
          :callback="getDataField"
          :disabledIds="disabledIds"
        >
          <template #actions="{ row }">
            <div class="flex flex-row gap-2 p-2 items-center justify-center">
              <SvgIcon
                :size="18"
                name="edit-info"
                @click.stop="isHaveUpdateInfoExtract() && handleUpdateInfoExtract(row)"
                class="cursor-pointer"
                :class="{
                  ' opacity-50': !isHaveUpdateInfoExtract()
                }"
              />
            </div>
          </template>
        </EIBTable>
      </el-tab-pane>
      <el-tab-pane label="Độ tin cậy" name="second">
        <div class="my-2">Cấu hình màu sắc độ tin cậy của dữ liệu</div>
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
                        :modelValue="
                          !index
                            ? 0
                            : Number(ruleForm[Object.keys(ruleForm)[index - 1] as keyof UpdateConfidenceFormModel]) +
                              0.1
                        "
                      />
                      <span class="mt-[-6px]">-</span>
                      <EIBInput
                        :ref="item"
                        v-model="ruleForm[item as keyof UpdateConfidenceFormModel]"
                        :rules="rules[item as keyof UpdateConfidenceFormModel]"
                        :rule-form-ref="$refs.ruleFormConfidence"
                        @input="validateInput($event, item)"
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
                      <el-color-picker
                        v-model="colors[item as keyof UpdateConfidenceColorFormModel]"
                        color-format="hex"
                      />
                      <span>{{ colors[item as keyof UpdateConfidenceColorFormModel] }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <el-button
                type="primary"
                :loading="loading"
                @click.prevent="isHaveUpdateConfidence() && handleUpdateConfidence()"
                style="width: 110px"
                :class="{
                  ' opacity-50 cursor-not-allowed': !isHaveUpdateConfidence()
                }"
                >Lưu thay đổi</el-button
              >
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Luồng kiểm tra" name="third">
        <el-card class="mt-2">
          <el-form ref="ruleForm5" class="" :model="ruleForm1" autocomplete="on">
            <div class="mt-1 d-flex flex-column g-6 auto-validation">
              <div class="mt-1 d-flex flex-column g-4">
                <el-radio-group v-model="automation.type">
                  <div class="w-full">
                    <el-radio label="MANUAL"
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
                    <el-radio label="THRESHOLD"
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
                          :disabled="automation.type !== AutoCheckConfigEnum.THRESHOLD"
                          v-model="automation.autoThreshold"
                          :show-tooltip="false"
                          class="confidence-slider"
                        />
                        <span class="confidence-value">{{ `${automation.autoThreshold}%` }}</span>
                        <div class="confidence-value-controls">
                          <button :disabled="automation.type !== AutoCheckConfigEnum.THRESHOLD">
                            <el-icon class="el-icon-caret-top pointer" />
                          </button>
                          <button :disabled="automation.type !== AutoCheckConfigEnum.THRESHOLD">
                            <el-icon class="el-icon-caret-bottom pointer" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-full">
                    <el-radio label="AUTO"
                      ><span>Luôn tự động</span><br />
                      <div class="radio-description">
                        Dữ liệu sau khi nhận dạng OCR sẽ luôn ở trạng thái
                        <span class="text-[#005d98]">Đã kiểm tra</span> và chờ người dùng thực hiện Trình phê duyệt
                      </div></el-radio
                    >
                  </div>
                </el-radio-group>
              </div>
              <el-button
                type="primary"
                style="width: 110px"
                class="btn-red mt-10 save-btn"
                variant="none"
                :loading="loading"
                @click.prevent="isHaveUpdateCheckConfig() && handleUpdateCheckConfig()"
                :class="{
                  ' opacity-50 cursor-not-allowed': !isHaveUpdateCheckConfig()
                }"
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

.el-color-picker__icon.is-icon-arrow-down {
  display: none !important;
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

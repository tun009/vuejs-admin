<script lang="ts" setup>
import { CompareContentFormModel } from '@/@types/pages/docs/documents'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ResizableSplitter from './ResizableSplitter.vue'
import PDFView from '@/views/extract/components/PDFView.vue'
import { convertFileUrl } from '@/utils/common'
import EIBInput from '@/components/common/EIBInput.vue'

interface Emits {
  (event: 'update:loading', value: boolean): void
  (event: 'update:visible', value: boolean): void
}

interface Exposes {
  onConfirm: () => void
}

const emits = defineEmits<Emits>()

const { t } = useI18n()

const pdfViewRef = ref()
const isLoadedPdf = ref<boolean>(false)

const compareContentRef = ref<FormInstance | null>()
const compareContentFormData: CompareContentFormModel = reactive({
  content: ''
})

const compareContentFormRules: FormRules<CompareContentFormModel> = {
  content: []
}

const onConfirm = () => {
  compareContentRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      emits('update:loading', true)
      setTimeout(() => {
        ElMessage.success(t('notification.description.createSuccess'))
        emits('update:loading', false)
        emits('update:visible', false)
      }, 2000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}

const onLoadedPDF = () => {
  isLoadedPdf.value = true
}

defineExpose<Exposes>({
  onConfirm
})
</script>

<template>
  <div class="flex flex-col add-compare-rule gap-5">
    <ResizableSplitter :min-width="500" custom-class="h-[calc(100vh_-_140px)]" :default-left-width="1000">
      <template #left>
        <div class="flex flex-col bg-[#f1f3f5]">
          <PDFView ref="pdfViewRef" :url="convertFileUrl('2024-11-21/252/255.pdf')" @loaded-data="onLoadedPDF()" />
        </div>
      </template>
      <template #right>
        <el-form
          ref="compareContentRef"
          :model="compareContentFormData"
          :rules="compareContentFormRules"
          @keyup.enter="onConfirm"
          class="flex flex-col gap-1"
        >
          <EIBInput
            type="textarea"
            class="w-full"
            :autosize="{ maxRows: 10, minRows: 5 }"
            v-model="compareContentFormData.content"
            name="field"
            label="docs.compare.chooseContent"
          />
        </el-form>
      </template>
    </ResizableSplitter>
    <div class="flex flex-row items-center justify-between">
      <slot name="footer-left" />
      <div class="ml-auto">
        <slot name="footer-right" />
        <el-button @click="emits('update:visible', false)">Đóng</el-button>
        <el-button plain type="primary" @click="onConfirm"> Xác nhận </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/styles/mixins.scss';
.add-compare-rule #view-pdf {
  height: calc(100vh - 220px);
  @extend %scrollbar;
}

.add-compare-rule .resizable-block {
  padding: 4px 20px;
}

.add-compare-rule .resizable-block-left {
  background-color: #f1f3f5;
}

.add-compare-rule .resizable-block-right {
  background-color: #f8f9fa;
}
</style>

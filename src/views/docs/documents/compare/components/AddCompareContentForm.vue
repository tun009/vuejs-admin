<script lang="ts" setup>
import { CompareContentFormModel, DocumentKeyEnum } from '@/@types/pages/docs/documents'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ResizableSplitter from './ResizableSplitter.vue'
import PDFView from '@/views/extract/components/PDFView.vue'
import { convertFileUrl } from '@/utils/common'
import EIBInput from '@/components/common/EIBInput.vue'
import { getDocumentCompareUndefined, patchDocumentCompareUndefined } from '@/api/docs/document/compare'
import { useRoute } from 'vue-router'

interface Props {
  comparisonUndefinedId: number
  is47A?: boolean
}

interface Emits {
  (event: 'update:visible', value: boolean): void
  (event: 'refresh', key?: DocumentKeyEnum): void
}

interface Exposes {
  onConfirm: () => void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const { t } = useI18n()
const route = useRoute()

const pdfViewRef = ref()
const isLoadedPdf = ref<boolean>(false)
const loading = ref<boolean>(false)
const pdfUrl = ref<string>('')

const dataForm = ref<CompareContentFormModel[]>([])

const handleAddContent = () => {
  dataForm.value.push({ requirement: '' })
}

const handleRemoveRule = (i: number) => {
  dataForm.value = [...dataForm.value].filter((_, index) => i !== index)
}

const onConfirm = async () => {
  try {
    loading.value = true
    await patchDocumentCompareUndefined(props.comparisonUndefinedId, dataForm.value)
    ElMessage.success(t('notification.description.updateSuccess'))
    emits('update:visible', false)
    emits('refresh', (route.query?.type as DocumentKeyEnum) ?? DocumentKeyEnum.INVOICE)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const onLoadedPDF = () => {
  isLoadedPdf.value = true
}

const handleGetDocumentCompareUndefined = async () => {
  try {
    const response = await getDocumentCompareUndefined({ comparisonUndefinedId: props.comparisonUndefinedId })
    if (!response.data) return
    pdfUrl.value = response.data.pathFile
    dataForm.value = response.data.requirements?.map((c) => ({
      id: c.id,
      requirement: c.requirement
    }))
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  handleGetDocumentCompareUndefined()
})

defineExpose<Exposes>({
  onConfirm
})
</script>

<template>
  <div class="flex flex-col add-compare-rule gap-5">
    <ResizableSplitter :min-width="500" custom-class="h-[calc(100vh_-_140px)]" :default-left-width="1000">
      <template #left>
        <div class="flex flex-col bg-[#f1f3f5]">
          <PDFView v-if="pdfUrl" ref="pdfViewRef" :url="convertFileUrl(pdfUrl)" @loaded-data="onLoadedPDF()" />
        </div>
      </template>
      <template #right>
        <div class="flex flex-col gap-5">
          <div>{{ t('docs.compare.chooseContent', { type: is47A ? '47A' : '46A' }) }}</div>
          <div v-for="(c, i) in dataForm" :key="i" class="flex flex-row gap-x-3 items-center">
            <EIBInput
              type="textarea"
              class="w-full"
              :autosize="{ maxRows: 6, minRows: 4 }"
              v-model="c.requirement"
              name="requirement"
              hidden-error
            />
            <div class="h-5 w-5 min-w-5">
              <SvgIcon
                v-if="i"
                name="ic-minus-outline"
                class="!h-5 !w-5 cursor-pointer"
                @click="() => handleRemoveRule(i)"
              />
            </div>
          </div>
          <el-button type="primary" plain @click="handleAddContent" class="mr-8">{{
            t('docs.compare.addContent', { type: is47A ? '47A' : '46A' })
          }}</el-button>
        </div>
      </template>
    </ResizableSplitter>
    <div class="flex flex-row items-center justify-between">
      <slot name="footer-left" />
      <div class="ml-auto">
        <slot name="footer-right" />
        <el-button @click="emits('update:visible', false)">Đóng</el-button>
        <el-button plain type="primary" @click="onConfirm" :loading="loading"> Xác nhận </el-button>
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

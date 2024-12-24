<script lang="ts" setup>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'

import DocumentFiles from './components/DocumentFiles.vue'
import DocumentInformation from './components/DocumentInformation.vue'

import { DocumentStatusEnum } from '@/@types/common'
import { DocumentModel, documentStatusOptions } from '@/@types/pages/docs/documents'
import { GetDocumentRequestModel } from '@/@types/pages/docs/documents/services/DocumentRequest'
import { BatchDetailModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { getBatchDetail, getQueryIds } from '@/api/docs/document'
import { updateDocumentStatus } from '@/api/docs/document/compare'
import { errorDocumentStatus } from '@/constants/common'
import { formatDDMMYYYY, formatYYYYMMDD } from '@/constants/date'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { useLoading } from '@/hooks/useLoading'
import { useDocumentStore } from '@/store/modules/document'
import { getDocumentSwitchStatus, omitPropertyFromObject } from '@/utils/common'
import { addOneDayToDate, defaultDateRange, formatDateExactFormat } from '@/utils/date'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { startLoading, stopLoading } = useLoading()
const { filter } = useDocumentStore()

const documentIndex = ref<number>(0)
const documentIds = ref<number[]>([])
const activeName = ref('docInfo')
const documentDetail = ref<BatchDetailModel>({} as BatchDetailModel)
const documentId = computed(() => route.params?.id as string)

const handleGetDocumentDetail = async () => {
  try {
    startLoading()
    const { data } = await getBatchDetail(documentId.value)
    documentDetail.value = data
    const status = getDocumentSwitchStatus(data as unknown as DocumentModel)
    if (status) {
      try {
        await updateDocumentStatus(data.id, {
          approveDossier: status
        })
        documentDetail.value.status = status
      } catch (error) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    stopLoading()
  }
}

const handleGetQueryIds = async () => {
  try {
    const { status = [], ...otherFilter } = filter
    const isErrorStatus = status.includes(DocumentStatusEnum.ERROR)
    let exactStatus = [...status]
    if (isErrorStatus) {
      const statusNoError = exactStatus.filter((e) => e !== DocumentStatusEnum.ERROR)
      exactStatus = [...statusNoError, ...errorDocumentStatus]
    }
    const payload = {
      ...omitPropertyFromObject(otherFilter, -1),
      beginDate: formatDateExactFormat(defaultDateRange()?.[0], formatDDMMYYYY, formatYYYYMMDD),
      endDate: addOneDayToDate(formatDateExactFormat(defaultDateRange()?.[1], formatDDMMYYYY, formatYYYYMMDD)),
      sortItemList: [
        {
          isAsc: false,
          column: 'createdAt'
        }
      ],
      ...(status?.length !== documentStatusOptions.length - 5 ? { status: exactStatus } : {})
    }
    const { data } = await getQueryIds(payload as GetDocumentRequestModel)
    const index = data.findIndex((item) => item.toString() === documentId.value)
    documentIndex.value = index
    documentIds.value = data
  } catch (error) {
    console.error(error)
  }
}

const handlePreDocument = () => {
  router.push(DOCUMENT_DETAIL_PAGE(documentIds.value?.[documentIndex.value - 1]))
}

const handleNextDocument = () => {
  router.push(DOCUMENT_DETAIL_PAGE(documentIds.value?.[documentIndex.value + 1]))
}

onMounted(() => {
  handleGetDocumentDetail()
  handleGetQueryIds()
})
</script>

<template>
  <div class="">
    <div class="flex flex-row justify-between items-center">
      <span class="text-2xl">{{ documentDetail?.dossierName }}</span>
      <div class="flex flex-row gap-2">
        <el-button :disabled="!documentIndex" :icon="ArrowLeft" type="primary" plain @click="handlePreDocument">{{
          $t('docs.detail.preDoc')
        }}</el-button>
        <el-button :disabled="documentIndex === documentIds.length - 1" type="primary" plain @click="handleNextDocument"
          >{{ $t('docs.detail.nextDoc') }}<el-icon class="el-icon--right"><ArrowRight /></el-icon
        ></el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane :label="$t('docs.detail.documentInformation')" name="docInfo">
        <DocumentInformation :data="documentDetail" @refresh="handleGetDocumentDetail" />
      </el-tab-pane>
      <el-tab-pane :label="$t('docs.detail.fileList')" name="docFile">
        <DocumentFiles :data="documentDetail" @refresh="handleGetDocumentDetail" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

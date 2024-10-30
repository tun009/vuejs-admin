<script lang="ts" setup>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'

import DocumentInformation from './components/DocumentInformation.vue'
import DocumentFiles from './components/DocumentFiles.vue'

import { handleComingSoon } from '@/utils/common'
import { getBatchDetail } from '@/api/docs/document'
import { useRoute } from 'vue-router'
import { BatchDetailModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { useLoading } from '@/hooks/useLoading'
import { DocumentStatusEnum } from '@/@types/common'

const route = useRoute()
const { startLoading, stopLoading } = useLoading()

const activeName = ref('docInfo')
const documentDetail = ref<BatchDetailModel>({} as BatchDetailModel)
const documentId = computed(() => route.params?.id as string)

const handleGetDocumentDetail = async () => {
  try {
    startLoading()
    const { data } = await getBatchDetail(documentId.value)
    documentDetail.value = data
  } catch (error) {
    console.error(error)
  } finally {
    stopLoading()
  }
}

onMounted(() => {
  handleGetDocumentDetail()
})
</script>

<template>
  <div class="">
    <div class="flex flex-row justify-between items-center">
      <span class="text-2xl">{{ documentDetail?.dossierName }}</span>
      <div class="flex flex-row gap-2">
        <el-button :icon="ArrowLeft" type="primary" plain @click="handleComingSoon">{{
          $t('docs.detail.preDoc')
        }}</el-button>
        <el-button type="primary" plain @click="handleComingSoon"
          >{{ $t('docs.detail.nextDoc') }}<el-icon class="el-icon--right"><ArrowRight /></el-icon
        ></el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane :label="$t('docs.detail.documentInformation')" name="docInfo">
        <DocumentInformation
          :data="documentDetail"
          @update:document-status="documentDetail.status = DocumentStatusEnum.WAIT_VALIDATE"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('docs.detail.fileList')" name="docFile">
        <DocumentFiles />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Edit, Filter, Plus, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import UploadDocuments from '../components/UploadDocuments.vue'
import UpdateDocument from './components/UpdateDocument.vue'

import { PaginationModel } from '@/@types/common'
import {
  DocumentModel,
  businessTypeOptions,
  docListColumnConfigs,
  documentResultOptions,
  documentStatusOptions,
  processingStepOptions
} from '@/@types/pages/docs/documents'
import { getDocuments } from '@/api/docs/document'
import Input from '@/components/common/EIBInput.vue'
import Table from '@/components/common/EIBTable.vue'
import { Title } from '@/layouts/components'
import { handleComingSoon, renderLabelByValue } from '@/utils/common'
import Drawer from '@/components/common/EIBDrawer.vue'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const tableData = ref<DocumentModel[]>([])
const dialogVisible = ref(false)
const openDrawer = ref(false)
const checkedItems = ref<DocumentModel[]>([])
const documentTableRef = ref<InstanceType<typeof Table>>()

const handleGetDocuments = async (pagination: PaginationModel) => {
  try {
    const response = await getDocuments({ ...pagination, searchQuery: searchQuery.value })
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}

const handleRedirectToDocumentDetail = (row: DocumentModel) => {
  router.push(DOCUMENT_DETAIL_PAGE(row.id))
}

const handleClearAllChecked = () => {
  checkedItems.value = []
  documentTableRef.value?.clearSelection()
}

const handleDeleteDocument = (name?: string) => {
  ElMessageBox.confirm(
    t('docs.document.deleteDocsConfirm', { name: name ?? t('docs.document.selectedDocs') }),
    t('docs.document.deleteDocsTitle'),
    {
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = 'Loading...'
          setTimeout(() => {
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false
            }, 300)
          }, 3000)
        } else {
          done()
        }
      },
      cancelButtonText: t('button.cancel_1'),
      confirmButtonText: t('button.confirmDelete'),
      dangerouslyUseHTMLString: true,
      draggable: true,
      type: 'warning'
    }
  )
    .then(() => {
      handleClearAllChecked()
      ElMessage({
        message: 'Delete document completed',
        type: 'success'
      })
    })
    .catch(() => {
      ElMessage({
        message: 'Delete document canceled',
        type: 'info'
      })
    })
}
</script>

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
          hidden-error
        />
        <el-button :icon="Filter" @click="handleComingSoon">{{ $t('docs.document.filter') }}</el-button>
      </div>
      <div class="flex flex-row gap-3">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
      </div>
    </div>
    <el-card>
      <Table
        ref="documentTableRef"
        locales
        :columnConfigs="docListColumnConfigs"
        :data="tableData"
        :callback="handleGetDocuments"
        @update:selection="(val) => (checkedItems = val)"
        :height="!!checkedItems.length ? 550 : 600"
        @row-click="handleRedirectToDocumentDetail"
      >
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
        <template #actions="{ row }">
          <div class="flex flex-row gap-2" @click.stop>
            <el-icon :size="18" class="cursor-pointer" @click.stop="openDrawer = true"><Edit /></el-icon>
            <el-icon
              :size="18"
              color="#e03131"
              class="cursor-pointer"
              @click.stop="handleDeleteDocument(row.documentName)"
              ><Delete
            /></el-icon>
          </div>
        </template>
      </Table>
    </el-card>
  </div>
  <UploadDocuments v-if="dialogVisible" v-model="dialogVisible" />
  <Drawer title="docs.document.updateDocument" v-model="openDrawer">
    <template #default>
      <UpdateDocument @close="openDrawer = false" />
    </template>
  </Drawer>
  <Transition :duration="300" name="nested" class="fixed bottom-0 -ml-5">
    <div v-if="!!checkedItems.length" class="outer px-5 py-3 w-full shadow-md border border-[#f8f9fa] bg-[#4f4f4f1a]">
      <div class="inner flex flex-row gap-x-5 items-center">
        <span class="text-[#495057] text-sm"
          >{{ $t('docs.document.selected') }}
          <strong>{{ checkedItems.length }} {{ $t('docs.document.items') }}</strong>
          <span class="text-blue-500 cursor-pointer ml-1" @click="handleClearAllChecked"
            >( {{ $t('docs.document.cancelAll') }} )</span
          ></span
        >
        <el-button type="danger" plain :icon="Delete" @click="() => handleDeleteDocument()">{{
          $t('button.delete')
        }}</el-button>
      </div>
    </div>
  </Transition>
</template>

<style lang="css">
._filter :deep(.el-form-item),
._filter :deep(.input-component) {
  margin-bottom: 0px;
}

.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
/* delay leave of parent element */
.nested-leave-active {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

/* we can also transition nested elements using nested selectors */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}
/* delay enter of nested element */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  /*
  	Hack around a Chrome 96 bug in handling nested opacity transitions.
    This is not needed in other browsers or Chrome 99+ where the bug
    has been fixed.
  */
  opacity: 0.001;
}
</style>

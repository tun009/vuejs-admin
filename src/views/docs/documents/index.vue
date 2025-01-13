<script lang="ts" setup>
import { ArrowDownBold, Filter, Plus, Search } from '@element-plus/icons-vue'
import { onActivated, onDeactivated, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import UploadDocuments from '../components/UploadDocuments.vue'
import UpdateDocument from './components/UpdateDocument.vue'

import { DocumentStatusEnum, PaginationModel } from '@/@types/common'
import {
  DocumentModel,
  FilterDocumentModel,
  FilterTypeEnum,
  SocketDataModel,
  businessTypeOptions,
  defaultStatus,
  docListColumnConfigs,
  documentResultOptions,
  documentStatusOptions,
  filterTypeSelectOptions,
  processingStepOptions
} from '@/@types/pages/docs/documents'
import { BranchModel } from '@/@types/pages/login'
import { deleteDocument, getBranches, getDocuments } from '@/api/docs/document'
import { updateDocumentStatus } from '@/api/docs/document/compare'
import createSocketConnection from '@/api/socker-service'
import EIBMultipleFilter from '@/components/Filter/EIBMultipleFilter.vue'
import EIBSingleFilter from '@/components/Filter/EIBSingleFilter.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import {
  checkerStepDocumentStatus,
  deleteAccessStatus,
  endedDocumentStatus,
  errorDocumentStatus,
  statusAccessDeleteDocumentStatus
} from '@/constants/common'
import { formatDDMMYYYY, formatDDMMYYYY_HHMM, formatYYYYMMDD, shortcutsDateRange } from '@/constants/date'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { useConfirmModal } from '@/hooks/useConfirm'
import { Title } from '@/layouts/components'
import { useDocumentStore } from '@/store/modules/document'
import { useUserStore } from '@/store/modules/user'
import {
  buildUrlSocket,
  getDocumentSwitchStatus,
  mappingBranches,
  omitPropertyFromObject,
  renderLabelByValue,
  withAllSelection
} from '@/utils/common'
import { addOneDayToDate, defaultDateRange, formatDate, formatDateExactFormat } from '@/utils/date'
import { errorNotification } from '@/utils/notification'
import { debounce } from 'lodash-es'
import Status from '../components/Status.vue'
import EIBDropdown from '@/components/common/EIBDropdown.vue'

defineOptions({
  name: 'Document'
})

const { t } = useI18n()
const router = useRouter()
const { showConfirmModal } = useConfirmModal()
const { isViewer, isAdmin, isChecker, isMaker, userInfo } = useUserStore()
const { setFilter } = useDocumentStore()
const socket = ref()

const multipleFilterRef = ref<InstanceType<typeof EIBMultipleFilter>>()
const openFilter = ref(false)
const tableData = ref<DocumentModel[]>([])
const tableDisabledIds = ref<(string | number)[]>([])
const rowSelect = ref<DocumentModel>({} as DocumentModel)
const dialogVisible = ref(false)
const openDrawer = ref(false)
const checkedItems = ref<DocumentModel[]>([])
const documentTableRef = ref<InstanceType<typeof EIBTable>>()
const uploadTimes = ref(defaultDateRange())
const isNotFirstActivation = ref<boolean>(false)
const filterType = ref<FilterTypeEnum>(FilterTypeEnum.BCT)
const filterValue = reactive<FilterDocumentModel>({
  status: defaultStatus
} as FilterDocumentModel)
const branches = ref<BranchModel[]>([])

const handleGetDocuments = async (pagination: PaginationModel) => {
  try {
    const { status, name = '', ...otherFilter } = filterValue
    const isErrorStatus = status.includes(DocumentStatusEnum.ERROR)
    let exactStatus = [...status]
    if (isErrorStatus) {
      const statusNoError = exactStatus.filter((e) => e !== DocumentStatusEnum.ERROR)
      exactStatus = [...statusNoError, ...errorDocumentStatus]
    }
    const payload = {
      ...pagination,
      ...omitPropertyFromObject(otherFilter, -1),
      beginDate: formatDateExactFormat(uploadTimes.value[0], formatDDMMYYYY, formatYYYYMMDD),
      endDate: addOneDayToDate(formatDateExactFormat(uploadTimes.value[1], formatDDMMYYYY, formatYYYYMMDD)),
      sortItemList: [
        {
          isAsc: false,
          column: 'createdAt'
        }
      ],
      ...(filterType.value === FilterTypeEnum.BCT ? { name } : { lcNo: name }),
      ...(status?.length !== documentStatusOptions.length - 5 ? { status: exactStatus } : {})
    }
    setFilter({ ...payload, status })
    const response = await getDocuments(payload)
    tableData.value = response.data.list
    const disabledIds = response.data.list
      .filter((c) => {
        return !isHaveDeleteDocument(c?.createdBy?.username ?? '', c.status)
      })
      ?.map((d) => d.id)
    tableDisabledIds.value = disabledIds
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}

/* NOSONAR */
const handleRedirectToDocumentDetail = async (row: DocumentModel) => {
  const status = getDocumentSwitchStatus(row)
  if (status) {
    try {
      await updateDocumentStatus(row.id, {
        approveDossier: status
      })
    } catch (error) {
      console.error(error)
    }
  }
  router.push(DOCUMENT_DETAIL_PAGE(row.id))
}

const handleClearAllChecked = () => {
  checkedItems.value = []
  documentTableRef.value?.clearSelection()
}

const handleDeleteDocument = (data?: DocumentModel) => {
  if (data && !deleteAccessStatus.includes(data?.status)) {
    errorNotification('Không thể xóa bộ chứng từ, hệ thống đang thực hiện xử lý!')
    return
  }
  const d = checkedItems.value.some((c) => !deleteAccessStatus.includes(c?.status))
  if (!data && d) {
    errorNotification('Không thể xóa bộ chứng từ, hệ thống đang thực hiện xử lý!')
    return
  }
  showConfirmModal({
    message: t('docs.document.deleteDocsConfirm', { name: data?.dossierName ?? t('docs.document.selectedDocs') }),
    title: t('docs.document.deleteDocsTitle'),
    successCallback: handleClearAllChecked,
    onConfirm: async (instance, done) => {
      try {
        if (data) {
          await deleteDocument([data?.id ?? ''])
        } else {
          const ids = checkedItems.value.map((i) => i.id)
          await deleteDocument(ids)
        }
        documentTableRef?.value?.handleGetData(false)
        done()
      } catch (error) {
        console.error(error)
      } finally {
        instance.confirmButtonLoading = false
      }
    },
    options: {
      confirmButtonText: 'Xác nhận xóa'
    },
    isDelete: true
  })
}

const handleResetFilter = () => {
  filterValue.bizType = -1
  filterValue.branchId = -1
  filterValue.result = -1
  multipleFilterRef.value?.handleCheckAll()
}

const handleGetData = debounce((isReload: boolean = true) => documentTableRef?.value?.handleGetData(isReload), 300)

watch(
  [() => filterValue, () => uploadTimes],
  async () => {
    handleGetData()
  },
  {
    deep: true
  }
)

watch(
  () => filterType.value,
  async () => {
    if (filterValue.name) {
      handleGetData()
    }
  }
)

const handleUpdateDocument = (row: DocumentModel) => {
  openDrawer.value = true
  rowSelect.value = row
}

const handleGetBranches = async () => {
  try {
    const { data } = await getBranches()
    branches.value = data
  } catch (error) {
    console.error(error)
  }
}

const isHaveEditDocument = (username: string, status: DocumentStatusEnum) => {
  if (endedDocumentStatus.includes(status)) return false
  if (isAdmin) return true
  if (isMaker) {
    return !checkerStepDocumentStatus.includes(status)
  }
  if (isChecker) {
    if (username === userInfo.username) return true
    return checkerStepDocumentStatus.includes(status)
  }
}

const isHaveDeleteDocument = (username: string, status: DocumentStatusEnum) => {
  if (endedDocumentStatus.includes(status)) return false
  if (!statusAccessDeleteDocumentStatus.includes(status)) return false
  if (isAdmin || isMaker) return true
  if (isChecker && username === userInfo.username) return true
  return false
}

const handleSocket = () => {
  socket.value = createSocketConnection(
    buildUrlSocket({
      query: {
        room: 'batches'
      }
    })
  )
  socket.value.on('update_data', (data: SocketDataModel) => {
    const dataMapping = tableData.value.map((item) => {
      if (item.id !== data.id || item.status === data.status) return item
      return {
        ...item,
        status: data.status
      }
    })
    tableData.value = dataMapping
  })
}

onMounted(() => {
  handleGetBranches()
})

onDeactivated(() => {
  if (socket.value) {
    socket.value?.disconnect()
  }
})

onActivated(() => {
  handleSocket()
  if (isNotFirstActivation.value) {
    handleGetData(false)
  } else {
    isNotFirstActivation.value = true
  }
})
</script>

<template>
  <div class="flex flex-row justify-between items-center">
    <Title :title="$t('docs.title')" />
    <div class="flex flex-row gap-5 items-center">
      <span class="font-semibold text-base !text-[14px]">{{ $t('docs.document.uploadDate') }}</span>
      <el-date-picker
        v-model="uploadTimes"
        type="daterange"
        class="w-fit"
        unlink-panels
        :clearable="false"
        :range-separator="$t('docs.document.to')"
        :start-placeholder="$t('docs.document.start')"
        :end-placeholder="$t('docs.document.end')"
        :shortcuts="shortcutsDateRange"
        :format="formatDDMMYYYY"
        :value-format="formatDDMMYYYY"
      />
    </div>
  </div>
  <div class="flex flex-col mt-2">
    <div class="flex flex-row justify-between gap-10 items-center mb-5">
      <div class="flex flex-row gap5 items-center gap-5">
        <div class="flex flex-row gap-2">
          <EIBDropdown
            :options="filterTypeSelectOptions"
            :value="filterType"
            btn-class-name="w-28"
            option-class-name="w-28"
            @update:model-value="(value: string) => (filterType = value as FilterTypeEnum)"
          />
          <EIBInput
            v-model="filterValue.name"
            custom-class="w-[360px]"
            placeholder="docs.document.searchByName"
            :prefix-icon="Search"
            hidden-error
          />
        </div>
        <div class="flex flex-row gap-5 items-center">
          <div class="flex flex-row gap-1 items-center p-1 cursor-pointer" @click="openFilter = !openFilter">
            <el-icon><Filter /></el-icon>
            <span class="whitespace-nowrap">{{ $t('docs.document.filter') }}</span>
            <el-icon
              class="ml-2 transition-all duration-300"
              :class="{ 'rotate-180': openFilter, 'rotate-0': !openFilter }"
              ><ArrowDownBold
            /></el-icon>
          </div>
          <el-divider direction="vertical" />
          <span class="text-primary whitespace-nowrap cursor-pointer" @click="handleResetFilter">{{
            $t('docs.document.resetToDefault')
          }}</span>
        </div>
      </div>
      <div v-if="!isViewer" class="flex flex-row gap-3">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
      </div>
    </div>
    <div
      class="transition-all duration-300 overflow-hidden flex flex-row items-center gap-5"
      :class="{ 'h-10 mb-2': openFilter, 'h-0': !openFilter }"
    >
      <EIBSingleFilter
        v-model="filterValue.bizType"
        :title="$t('docs.document.businessType')"
        :options="businessTypeOptions"
      />
      <EIBMultipleFilter
        ref="multipleFilterRef"
        v-model="filterValue.status"
        :title="$t('docs.document.status')"
        :options="documentStatusOptions.slice(0, -5)"
      />
      <EIBSingleFilter
        v-model="filterValue.result"
        :title="$t('docs.document.result')"
        :options="documentResultOptions"
      />
      <EIBSingleFilter
        v-model="filterValue.branchId"
        :title="$t('docs.document.sol')"
        :options="withAllSelection(mappingBranches(branches))"
      />
    </div>
    <el-card>
      <EIBTable
        ref="documentTableRef"
        locales
        :columnConfigs="isViewer ? docListColumnConfigs.slice(0, -1) : docListColumnConfigs"
        :data="tableData"
        :callback="handleGetDocuments"
        @update:selection="(val: DocumentModel[]) => (checkedItems = val)"
        :height="!!checkedItems.length && openFilter ? 520 : !checkedItems.length && !openFilter ? 600 : 560"
        @row-click="handleRedirectToDocumentDetail"
        :hidden-checked="isViewer"
        :disabled-ids="tableDisabledIds"
      >
        <template #status="{ row }">
          <Status :options="documentStatusOptions" :status="row?.status" />
        </template>
        <template #bizType="{ row }">
          <span>{{ renderLabelByValue(businessTypeOptions, row?.bizType) }}</span>
        </template>
        <template #step="{ row }">
          <span>{{ renderLabelByValue(processingStepOptions, row?.step) }}</span>
        </template>
        <template #result="{ row }">
          <Status :options="documentResultOptions" :status="row?.result" />
        </template>
        <template #createdAt="{ row }">
          <span>{{ formatDate(row.createdAt, formatDDMMYYYY_HHMM) }}</span>
        </template>
        <template #doneAt="{ row }">
          <span>{{ formatDate(row.doneAt, formatDDMMYYYY_HHMM) }}</span>
        </template>
        <template #branchName="{ row }">
          <span>{{ row?.branch?.name }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex flex-row gap-2 items-center h-[63px] px-3 justify-center" @click.stop>
            <div class="w-[18px]">
              <SvgIcon
                v-if="isHaveEditDocument(row?.createdBy?.username, row.status)"
                :size="18"
                name="edit-info"
                @click.stop="handleUpdateDocument(row)"
                class="cursor-pointer"
              />
            </div>
            <div class="w-5 h-5">
              <SvgIcon
                v-if="isHaveDeleteDocument(row?.createdBy?.username, row.status)"
                :size="20"
                name="delete-mini"
                @click.stop="handleDeleteDocument(row)"
                class="cursor-pointer"
              />
            </div>
          </div>
        </template>
      </EIBTable>
    </el-card>
  </div>
  <UploadDocuments v-if="dialogVisible" v-model="dialogVisible" @refresh="documentTableRef?.handleGetData()" />
  <EIBDrawer title="docs.document.updateDocument" v-model="openDrawer" v-if="openDrawer">
    <template #default>
      <UpdateDocument @close="openDrawer = false" :data="rowSelect" @refresh="documentTableRef?.handleGetData(false)" />
    </template>
  </EIBDrawer>
  <Transition :duration="300" name="nested" class="fixed bottom-0 -ml-5">
    <div v-if="!!checkedItems.length" class="outer px-5 py-3 w-full shadow-md border border-[#f8f9fa] bg-[#fff]">
      <div class="inner flex flex-row gap-x-5 items-center">
        <span class="text-[#495057] text-sm"
          >{{ $t('docs.document.selected') }}
          <strong>{{ checkedItems.length }} {{ $t('docs.document.items') }}</strong>
          <span class="text-blue-500 cursor-pointer ml-1" @click="handleClearAllChecked"
            >( {{ $t('docs.document.cancelAll') }} )</span
          ></span
        >
        <el-button type="danger" plain @click="() => handleDeleteDocument()">
          <div class="flex flex-row items-center gap-1">
            <SvgIcon :size="18" name="delete" class="cursor-pointer" /><span>{{ $t('button.delete') }}</span>
          </div>
        </el-button>
      </div>
    </div>
  </Transition>
</template>

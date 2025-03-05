<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { ApproveProcessDocumentModel, approveProcessDocumentColumnConfigs } from '@/@types/pages/docs/documents'
import { putPresentationChecker } from '@/api/docs/document'
import { getChecker } from '@/api/users'
import EIBTable from '@/components/common/EIBTable.vue'
import { successNotification, warningNotification } from '@/utils/notification'
import { useRoute } from 'vue-router'

interface Emits {
  (event: 'close'): void
  (event: 'refresh'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()

const route = useRoute()

const radio = ref()
const loading = ref(false)
const tableData = ref<ApproveProcessDocumentModel[]>([])
const checkerTableRef = ref<InstanceType<typeof EIBTable>>()

const batchId = computed(() => route.params?.id as string)

const handleGetChecker = async () => {
  try {
    checkerTableRef.value?.setLoading(true)
    const response = await getChecker()
    if (response?.data) {
      tableData.value = response?.data
    }
  } catch (error) {
    console.error(error)
  } finally {
    checkerTableRef.value?.setLoading(false)
  }
}

const handleClose = () => {
  emits('close')
}

const handleSelectChecker = async () => {
  if (!radio.value) {
    warningNotification('notification.description.pleaseChooseChecker')
    return
  }
  try {
    loading.value = true
    await putPresentationChecker(batchId.value, { checkerId: radio.value })
    successNotification('notification.description.updateSuccess')
    radio.value = undefined
    emits('refresh')
    handleClose()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  handleGetChecker()
})

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <span>{{ $t('docs.detail.checkerList') }}</span>
    <el-radio-group v-model="radio" class="w-full">
      <EIBTable
        ref="checkerTableRef"
        locales
        hiddenChecked
        hiddenPagination
        :columnConfigs="approveProcessDocumentColumnConfigs"
        :data="tableData"
        @row-click="(row) => (radio = row.id)"
      >
        <template #select="{ row }">
          <el-radio :value="row.id" :modelValue="radio" />
        </template>
        <template #checker="{ row }">
          <div>
            <span>{{ row.name }}</span>
            <br />
            <span class="!text-blue-500">{{ row.username }}</span>
          </div>
        </template>
      </EIBTable>
    </el-radio-group>
  </div>
  <div>
    <span class="underline">{{ $t('docs.detail.note') }}: </span><span> {{ $t('docs.detail.noteDes') }}</span>
  </div>
  <div>
    <el-button :loading="loading" @click.prevent="handleSelectChecker" type="primary">{{
      $t('button.update')
    }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

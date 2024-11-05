<script lang="ts" setup>
import { ExtractNoteModel } from '@/@types/pages/extract'
import { getDossierNotesApi, postDossierNoteApi } from '@/api/extract'
import { ref, watch } from 'vue'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/date'
import { formatDDMMYYYY_HHMM } from '@/constants/date'
const props = defineProps<{
  isActive?: boolean
  batchId: number
}>()
watch(
  () => props.isActive,
  (newVal) => {
    if (newVal && notesData.value.length === 0) getNotes()
  }
)
const notesData = ref<ExtractNoteModel[]>([])
const getNotes = async () => {
  try {
    const response = await getDossierNotesApi(props.batchId)
    notesData.value = response.data
  } catch (error: any) {
    throw new Error(error)
  }
}
const dialogVisible = ref(false)
const reason = ref()
const loadingConfirm = ref(false)
const openModal = () => {
  reason.value = ''
  dialogVisible.value = true
}
const onConfirm = async () => {
  try {
    loadingConfirm.value = true
    const response = await postDossierNoteApi({ content: reason.value, batchId: props.batchId })
    if (response.data) {
      ElMessage({
        showClose: true,
        type: 'success',
        message: 'Thêm ghi chú thành công'
      })
      getNotes()
    }
  } catch (error: any) {
    throw new Error(error)
  } finally {
    loadingConfirm.value = false
    dialogVisible.value = false
  }
}
</script>
<template>
  <div class="h-[calc(100vh-185px)] overflow-y-auto">
    <div v-for="(item, index) in notesData" :key="index" class="p-[16px] pt-0">
      <div>{{ item?.content }}</div>
      <div class="text-[#868e96]">
        <span>{{ formatDate(item.createdAt, formatDDMMYYYY_HHMM) }}</span> - <span>{{ item?.createdBy }}</span>
      </div>
    </div>
  </div>
  <div class="tab-footer p-[16px] shadow-[inset_0_1px_0_0_#d0d0d0] text-right">
    <el-button class="text-[#1c7ed6] border-[#1c7ed6] mr-2" @click="openModal">Thêm</el-button>
  </div>
  <EIBDialog title="Thêm ghi chú" v-model="dialogVisible" @on-confirm="onConfirm()" :loading="loadingConfirm">
    <EIBInput name="reason" v-model="reason" label="Nhập ghi chú" placeholder="Nhập ghi chú" type="textarea" :rows="5"
  /></EIBDialog>
</template>

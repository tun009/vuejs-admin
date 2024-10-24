<script lang="ts" setup>
import { ExtractNoteModel } from '@/@types/pages/extract'
import { getDossierNotesApi } from '@/api/extract'
import { ref, watch } from 'vue'

const props = defineProps<{
  isActive?: boolean
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
    const response = await getDossierNotesApi()
    notesData.value = response.data
  } catch (error: any) {
    throw new Error(error)
  }
}
</script>
<template>
  <div class="h-[calc(100vh-185px)] overflow-y-auto">
    <div v-for="(item, index) in notesData" :key="index" class="p-[16px] pt-0">
      <div>{{ item.content }}</div>
      <div class="text-[#868e96]">
        <span>{{ item.create_at }}</span> - <span>{{ item.create_by }}</span>
      </div>
    </div>
  </div>
  <div class="tab-footer p-[16px] shadow-[inset_0_1px_0_0_#d0d0d0] text-right">
    <el-button class="text-[#1c7ed6] border-[#1c7ed6] mr-2">Thêm</el-button>
  </div>
</template>

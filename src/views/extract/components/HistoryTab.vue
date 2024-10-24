<script lang="ts" setup>
import { ExtractHistoryModel } from '@/@types/pages/extract'
import { getDossierHistoriesApi } from '@/api/extract'
import { ref, watch } from 'vue'

const props = defineProps<{
  isActive?: boolean
}>()
watch(
  () => props.isActive,
  (newVal) => {
    if (newVal && historiesData.value.length === 0) fetchHistories()
  }
)
const historiesData = ref<ExtractHistoryModel[]>([])
const fetchHistories = async () => {
  try {
    const response = await getDossierHistoriesApi()
    historiesData.value = response.data
  } catch (error: any) {
    throw new Error(error)
  }
}
</script>
<template>
  <div class="flex bg-[#005d98] text-[#fff] py-[4px]">
    <div class="w-1/5 ml-2">Thời gian</div>
    <div class="w-2/5 ml-2">Trước chỉnh sửa</div>
    <div class="w-2/5 ml-4">Sau chỉnh sửa</div>
  </div>
  <div class="box-history-content">
    <div v-for="(item, index) in historiesData" :key="index">
      <div class="bg-[#e9ecef] px-[10px] py-[4px]">{{ item?.date }}</div>
      <div v-if="item?.histories.length > 0" class="mb-[10px]">
        <div v-for="(item_history, index_history) in item?.histories" :key="index_history" class="flex">
          <div class="w-1/5 ml-2 border-r-[2px] border-[#e4e7ec] border-solid py-[16px]">
            <div class="text-[#868e96]">{{ item_history?.time }}</div>
            <div>{{ item_history?.user }}</div>
            <div v-if="item_history?.role">({{ item_history?.role }})</div>
          </div>
          <div v-if="item_history?.actions.length > 0" class="w-4/5 py-[16px] px-[7px]">
            <div
              v-for="(item_history_action, index_history_action) in item_history?.actions"
              :key="index_history_action"
            >
              <div class="text-[#099268]" v-if="item_history_action.type === 'others'">
                {{ item_history_action?.before }}
              </div>
              <div v-else class="w-full">
                <div class="text-[#005d98]">{{ item_history_action.field }}</div>
                <div class="flex">
                  <div class="w-[47%]">{{ item_history_action.before }}</div>
                  <div class="w-[5%] flex items-center">
                    <SvgIcon name="dot-arrow-right" />
                  </div>
                  <div class="w-[48%]">{{ item_history_action.after }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

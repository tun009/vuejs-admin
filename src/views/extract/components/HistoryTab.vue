<script lang="ts" setup>
import {
  ExtractHistoryModel,
  ExtractHistoryTypeEnum,
  ExtractHistoryGroupedResultModel,
  ExtractHistoryGroupedDayModel,
  extractHistoryTypes
} from '@/@types/pages/extract'
import { getDossierHistoriesApi } from '@/api/extract'
import { groupByField, renderLabelByValue } from '@/utils/common'
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  isActive?: boolean
  dossierDocId: number
}>()
watch(
  () => props.isActive,
  (newVal) => {
    if (newVal) fetchHistories()
  }
)
const historiesData = ref<ExtractHistoryModel[][]>([])
const dataHistoriesGroupDay = ref<ExtractHistoryGroupedDayModel[]>([])
const dataHistoriesConvert: ExtractHistoryGroupedResultModel[] = []
const fetchHistories = async () => {
  try {
    const response = await getDossierHistoriesApi(props.dossierDocId)
    historiesData.value = response.data
    historiesData.value.forEach((item) => {
      if (item.some((x) => x.type === ExtractHistoryTypeEnum.EDIT))
        dataHistoriesConvert.push(groupDataToExtractHistory(item)[0])
      else dataHistoriesConvert.push({ ...item[0], value: [] })
    })
    const groupedHistories = groupByField(dataHistoriesConvert, 'day')
    dataHistoriesGroupDay.value = Object.keys(groupedHistories).map((groupKey) => ({
      day: groupKey,
      actions: groupedHistories[groupKey]
    }))
    onScrollTopElement()
  } catch (error: any) {
    throw new Error(error)
  }
}
const onScrollTopElement = () => {
  nextTick(() => {
    const tabNote = document.getElementById('history-tab')
    if (tabNote) {
      tabNote.scrollTop = 0
    }
  })
}
const groupDataToExtractHistory = (data: Record<string, any>[]): ExtractHistoryGroupedResultModel[] => {
  const result = data.reduce<Record<string, ExtractHistoryGroupedResultModel>>((acc, item) => {
    const key = `${item.type}-${item.createdBy}-${item.role}-${item.day}-${item.hour}`

    if (!acc[key]) {
      acc[key] = {
        type: item.type,
        createdBy: item.createdBy,
        role: item.role,
        day: item.day,
        hour: item.hour,
        value: []
      }
    }

    acc[key].value.push({
      field: item.field,
      valueBefore: item.valueBefore,
      valueAfter: item.valueAfter
    })

    return acc
  }, {})
  return Object.values(result)
}
</script>
<template>
  <div class="flex bg-[#005d98] text-[#fff] py-[4px]">
    <div class="w-1/5 ml-2">Thời gian</div>
    <div class="w-2/5 ml-2">Trước chỉnh sửa</div>
    <div class="w-2/5 ml-4">Sau chỉnh sửa</div>
  </div>
  <div class="box-history-content overflow-y-auto h-[calc(100vh-148px)]" id="history-tab">
    <div v-for="(item, index) in dataHistoriesGroupDay" :key="index">
      <div class="bg-[#e9ecef] px-[10px] py-[4px]">{{ item?.day }}</div>
      <div v-if="item?.actions.length > 0" class="mb-[10px]">
        <div v-for="(item_history, index_history) in item?.actions" :key="index_history" class="flex">
          <div class="w-1/5 ml-2 border-r-[2px] border-[#e4e7ec] border-solid py-[12px] break-words">
            <div class="text-[#868e96]">{{ item_history?.hour }}</div>
            <div>{{ item_history?.createdBy }}</div>
            <div v-if="item_history?.role">({{ item_history?.role }})</div>
          </div>
          <div class="w-4/5 py-[12px] px-[7px] pb-[8px]">
            <template v-if="item_history.type === ExtractHistoryTypeEnum.EDIT">
              <div
                v-for="(item_history_action, index_history_action) in item_history?.value"
                :key="index_history_action"
                class="pb-[8px]"
              >
                <div class="w-full">
                  <div class="text-[#005d98]">{{ item_history_action.field }}</div>
                  <div class="flex">
                    <div class="w-[47%]">{{ item_history_action.valueBefore }}</div>
                    <div class="w-[5%] flex items-center">
                      <SvgIcon name="dot-arrow-right" />
                    </div>
                    <div class="w-[48%]">{{ item_history_action.valueAfter }}</div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="text-[#099268]">
                {{ renderLabelByValue(extractHistoryTypes, item_history?.type) }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

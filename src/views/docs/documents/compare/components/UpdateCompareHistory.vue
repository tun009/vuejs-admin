<script lang="ts" setup>
import {
  CompareHistoryActionModel,
  CompareHistoryCustomModel,
  CompareHistoryModel,
  CompareHistoryTypeEnum
} from '@/@types/pages/docs/documents'
import { getDocumentHistories } from '@/api/docs/document'
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer.vue'
import { DOCUMENT_HISTORY_MESSAGES } from '@/constants/common'
import { Right } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const compareHistories = ref<CompareHistoryCustomModel[]>([])

const handleConvertDocumentHistory = (data: CompareHistoryModel): CompareHistoryCustomModel[] => {
  const result: CompareHistoryCustomModel[] = []

  data.forEach((item) => {
    item.forEach((action) => {
      const { day, hour, createdBy, role, type, title, valueBefore, valueAfter } = action

      let dayEntry = result.find((entry) => entry.day === day)
      if (!dayEntry) {
        dayEntry = { day, hours: [] }
        result.push(dayEntry)
      }

      let hourEntry = dayEntry.hours.find((entry) => entry.hour === hour)
      if (!hourEntry) {
        hourEntry = { hour, createdBy, role, type, actions: [] }
        dayEntry.hours.push(hourEntry)
      }

      hourEntry.actions.push({
        title,
        valueBefore: valueBefore ?? null,
        valueAfter: valueAfter ?? null
      } as CompareHistoryActionModel)
    })
  })

  return result
}

const handleGetDocumentHistories = async () => {
  try {
    const response = await getDocumentHistories(route.params?.id as string)
    const mappingData = handleConvertDocumentHistory(response.data)
    compareHistories.value = mappingData
  } catch (error) {
    console.error(error)
  }
}

const isSuccessType = (type: CompareHistoryTypeEnum) => {
  return type !== CompareHistoryTypeEnum.EDIT && type !== CompareHistoryTypeEnum.LC
}

onMounted(() => {
  handleGetDocumentHistories()
})
</script>

<template>
  <div class="text-sm">
    <div class="grid grid-cols-9 bg-primary text-white py-2 px-3 sticky top-0 overflow-hidden">
      <div class="col-span-1">{{ $t('docs.compare.time') }}</div>
      <div class="col-span-4">{{ $t('docs.compare.beforeUpdate') }}</div>
      <div class="col-span-4">{{ $t('docs.compare.afterUpdate') }}</div>
    </div>
    <div class="h-[calc(100vh_-_236px)] overflow-y-auto scroll-block">
      <div v-for="(item, index) in compareHistories" :key="index" class="grid grid-cols-9 relative">
        <div class="col-span-9 bg-[#e9ecef] px-3 py-2 sticky top-0">
          {{ item.day }}
        </div>
        <div class="col-span-9 mb-2">
          <div v-for="(time, timeIndex) in item.hours" :key="timeIndex" class="grid grid-cols-9">
            <div class="col-span-1 px-3 p-4 border-r-[2px]">
              <p class="text-[#868e96]">{{ time.hour }}</p>
              <p class="text-[#495057]">{{ time.createdBy }}</p>
              <p class="text-[#495057]">({{ time.role.toLowerCase() }})</p>
            </div>
            <div class="col-span-8 p-5 flex flex-col gap-2">
              <div v-for="(action, actionIndex) in time.actions" :key="actionIndex" class="grid grid-cols-2 gap-y-3">
                <p
                  class="col-span-2 text-primary"
                  :class="{
                    '!text-[#099268]': isSuccessType(time?.type)
                  }"
                >
                  {{
                    time.type === CompareHistoryTypeEnum.ADDITIONAL
                      ? action.valueBefore?.[0]
                      : !isSuccessType(time?.type)
                        ? action.title
                        : (DOCUMENT_HISTORY_MESSAGES?.[time.type] as string)
                  }}
                </p>
                <div v-if="!isSuccessType(time?.type)" class="flex flex-row items-center justify-between">
                  <span v-if="!action?.valueBefore">Complied</span>
                  <div v-else class="grid gap-3">
                    <div
                      v-for="(content, contentIndex) in action?.valueBefore"
                      :key="contentIndex"
                      class="flex flex-row gap-2"
                    >
                      <div class="h-1 w-1 bg-black rounded-[2px] min-w-1 mt-2" />
                      <SafeHtmlRenderer :html="content" />
                    </div>
                  </div>
                  <el-icon class="mr-3 ml-20"><Right /></el-icon>
                </div>
                <div v-if="!isSuccessType(time?.type)" class="flex flex-row items-center justify-between">
                  <span v-if="!action.valueAfter">Complied</span>
                  <div v-else class="grid gap-3">
                    <div
                      v-for="(content, contentIndex) in action?.valueAfter"
                      :key="contentIndex"
                      class="flex flex-row gap-2"
                    >
                      <div class="h-1 w-1 bg-black rounded-[2px] min-w-1 mt-2" />
                      <SafeHtmlRenderer :html="content" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

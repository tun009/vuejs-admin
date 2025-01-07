<script lang="ts" setup>
import { CompareHistoryCustomModel, CompareHistoryTypeEnum } from '@/@types/pages/docs/documents'
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer.vue'
import { DOCUMENT_HISTORY_MESSAGES } from '@/constants/common'
import { Right } from '@element-plus/icons-vue'

interface Props {
  compareHistories: CompareHistoryCustomModel[]
}

defineProps<Props>()

const isSuccessType = (type: CompareHistoryTypeEnum) => {
  return type !== CompareHistoryTypeEnum.EDIT && type !== CompareHistoryTypeEnum.LC
}
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
                  <template v-if="!action?.valueBefore?.length">
                    <span v-if="action?.valueAfter?.[0] === 'Complied'">Discrepancy</span>
                    <span v-else>Complied</span>
                  </template>
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
                  <template v-if="!action?.valueAfter?.length">
                    <span v-if="action?.valueBefore?.[0] === 'Complied'">Discrepancy</span>
                    <span v-else>Complied</span>
                  </template>
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

<script lang="ts" setup>
import { compareHistories } from '@/mocks/document'
import { Right } from '@element-plus/icons-vue'
</script>

<template>
  <div class="text-sm h-[calc(100vh_-_200px)] overflow-y-auto scroll-block">
    <div class="grid grid-cols-9 bg-primary text-white py-2 px-3 sticky top-0">
      <div class="col-span-1">{{ $t('docs.compare.time') }}</div>
      <div class="col-span-4">{{ $t('docs.compare.beforeUpdate') }}</div>
      <div class="col-span-4">{{ $t('docs.compare.afterUpdate') }}</div>
    </div>
    <div>
      <div v-for="(item, index) in compareHistories" :key="index" class="grid grid-cols-9">
        <div class="col-span-9 bg-[#e9ecef] px-3 py-2">
          {{ item.date }}
        </div>
        <div class="col-span-9 mb-2">
          <div v-for="(time, timeIndex) in item.timeList" :key="timeIndex" class="grid grid-cols-9">
            <div class="col-span-1 px-3 p-4 border-r-[2px]">
              <p class="text-[#868e96]">{{ time.time }}</p>
              <p class="text-[#495057]">{{ time.name }}</p>
              <p class="text-[#495057]">({{ time.role.toLowerCase() }})</p>
            </div>
            <div class="col-span-8 p-5">
              <div v-for="(action, actionIndex) in time.actionList" :key="actionIndex" class="grid grid-cols-2 gap-y-3">
                <p class="col-span-2 text-primary" :class="{ '!text-[#099268]': action?.isConfirm }">
                  {{ action.actionName }}
                </p>
                <div v-if="!action?.isConfirm" class="flex flex-row items-center justify-between">
                  <span v-if="action?.beforeUpdate?.isComplied">Complied</span>
                  <div v-else class="grid gap-3">
                    <div
                      v-for="(content, contentIndex) in action?.beforeUpdate?.contents"
                      :key="contentIndex"
                      class="flex flex-row gap-2"
                    >
                      <div class="h-1 w-1 bg-black rounded-[2px] min-w-1 mt-2" />
                      <span>{{ content }}</span>
                    </div>
                  </div>
                  <el-icon class="mr-3 ml-20"><Right /></el-icon>
                </div>
                <div v-if="!action?.isConfirm" class="flex flex-row items-center justify-between">
                  <span v-if="action?.afterUpdate?.isComplied">Complied</span>
                  <div v-else class="grid gap-3">
                    <div
                      v-for="(content, contentIndex) in action?.afterUpdate?.contents"
                      :key="contentIndex"
                      class="flex flex-row gap-2"
                    >
                      <div class="h-1 w-1 bg-black rounded-[2px] min-w-1 mt-2" />
                      <span>{{ content }}</span>
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

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'
import NotifyList from './NotifyList.vue'
import { type ListItem, notifyData, messageData, todoData } from './data'

type TabName = 'notification' | 'message' | 'toDo'

interface DataItem {
  name: TabName
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  list: ListItem[]
}

/** Maximum value of corner mark */
const badgeMax = 99
/** Panel width */
const popoverWidth = 350
/** Current Tab */
const activeName = ref<TabName>('notification')
/** All data */
const data = ref<DataItem[]>([
  // Notification data
  {
    name: 'notification',
    type: 'primary',
    list: notifyData
  },
  // Message data
  {
    name: 'message',
    type: 'danger',
    list: messageData
  },
  // To-do data
  {
    name: 'toDo',
    type: 'warning',
    list: todoData
  }
])
/** The current value of the index */
const badgeValue = computed(() => {
  return data.value.reduce((sum, item) => sum + item.list.length, 0)
})

const handleHistory = () => {
  ElMessage.success(`Jump to${activeName.value}history page`)
}
</script>

<template>
  <div class="notify">
    <el-popover placement="bottom" :width="popoverWidth" trigger="click">
      <template #reference>
        <el-badge :value="badgeValue" :max="badgeMax" :hidden="badgeValue === 0">
          <el-tooltip effect="dark" content="Message notification" placement="bottom">
            <el-icon :size="20">
              <Bell />
            </el-icon>
          </el-tooltip>
        </el-badge>
      </template>
      <template #default>
        <el-tabs v-model="activeName" class="demo-tabs" stretch>
          <el-tab-pane v-for="(item, index) in data" :name="item.name" :key="index">
            <template #label>
              {{ item.name }}
              <el-badge :value="item.list.length" :max="badgeMax" :type="item.type" />
            </template>
            <el-scrollbar height="400px">
              <NotifyList :list="item.list" />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
        <div class="notify-history">
          <el-button link @click="handleHistory">Check {{ activeName }} history</el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.notify {
  margin-right: 10px;
}

.notify-history {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}
</style>

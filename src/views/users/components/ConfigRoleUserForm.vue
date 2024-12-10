<script setup lang="ts">
import { configRoleUserTableData } from '@/@types/pages/users'
import { ref } from 'vue'

interface Emits {
  (event: 'close'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()

const loading = ref(false)
const addUserFormRef = ref()
const checked1 = ref(true)
const checked2 = ref(true)
const checked3 = ref(true)
const checked4 = ref(true)

const handleClose = () => {
  emits('close')
  addUserFormRef.value.resetFields()
}

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <div>
    <h2 class="mb-2">Danh sách chức năng được truy cập theo role</h2>
    <el-table :data="configRoleUserTableData" border class="fixed-table w-full overflow-y-auto">
      <el-table-column prop="name" label="Tên chức năng">
        <template #default="scope">
          <div v-if="scope.row.title == 1" class="text-[#495057] font-bold">
            {{ scope.row.name }}
          </div>
          <div v-if="scope.row.title == 2" class="flex flex-row gap-2 items-center">
            <div class="h-1 w-1 rounded-sm bg-[#495057]" />
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="admin" label="Admin" align="center" width="90">
        <template #default="scope">
          <div class="text-center">
            <el-checkbox size="large" disabled v-model="checked1" v-if="scope.$index != 7 && scope.$index != 18" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checker" label="Checker" align="center" width="90">
        <template #default="scope">
          <div class="text-center">
            <el-checkbox
              size="large"
              disabled
              v-model="checked2"
              v-if="scope.$index != 7 && scope.$index != 18 && scope.$index != 27 && scope.$index != 33"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="maker" label="Maker" align="center" width="90">
        <template #default="scope">
          <div class="text-center">
            <el-checkbox
              size="large"
              disabled
              v-model="checked3"
              v-if="
                scope.$index != 19 &&
                scope.$index != 24 &&
                scope.$index != 25 &&
                scope.$index != 26 &&
                scope.$index != 27 &&
                scope.$index != 28 &&
                scope.$index != 29 &&
                scope.$index != 30 &&
                scope.$index != 31 &&
                scope.$index != 32 &&
                scope.$index != 33 &&
                scope.$index != 34 &&
                scope.$index != 36 &&
                scope.$index != 37 &&
                scope.$index != 39
              "
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="viewer" label="Viewer" align="center" width="90">
        <template #default="scope">
          <div class="text-center">
            <el-checkbox
              size="large"
              disabled
              v-model="checked4"
              v-if="
                scope.$index != 3 &&
                scope.$index != 4 &&
                scope.$index != 5 &&
                scope.$index != 7 &&
                scope.$index != 9 &&
                scope.$index != 10 &&
                scope.$index != 11 &&
                scope.$index != 13 &&
                scope.$index != 15 &&
                scope.$index != 16 &&
                scope.$index != 18 &&
                scope.$index != 19 &&
                scope.$index != 20 &&
                scope.$index != 24 &&
                scope.$index != 25 &&
                scope.$index != 26 &&
                scope.$index != 27 &&
                scope.$index != 28 &&
                scope.$index != 29 &&
                scope.$index != 30 &&
                scope.$index != 31 &&
                scope.$index != 32 &&
                scope.$index != 33 &&
                scope.$index != 34 &&
                scope.$index != 35 &&
                scope.$index != 36 &&
                scope.$index != 37 &&
                scope.$index != 38 &&
                scope.$index != 39
              "
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { PaginationModel } from '@/@types/common'
import { UserModel } from '@/@types/pages/users'
import { getUsers } from '@/api/users'
import Drawer from '@/components/common/Drawer.vue'
import Input from '@/components/common/Input.vue'
import Table from '@/components/common/Table.vue'
import { Title } from '@/layouts/components'
import { Delete, Edit, Plus, Search, Tools } from '@element-plus/icons-vue'
import { ref } from 'vue'

defineOptions({
  name: 'Users'
})

const searchQuery = ref('')

const columnConfigs = [
  {
    field: 'stt',
    label: 'Stt'
  },
  {
    field: 'name',
    label: 'Name'
  },
  {
    field: 'role',
    label: 'Role'
  },
  {
    field: 'sql',
    label: 'Sql'
  },
  {
    field: 'status',
    label: 'Status'
  },
  {
    field: 'actions',
    label: 'Actions'
  }
]

const disabledIds = [1]

const tableData = ref<UserModel[]>([])

const handleGetUser = async (pagination: PaginationModel) => {
  try {
    const response = await getUsers({ ...pagination, searchQuery: searchQuery.value })
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}
</script>

<template>
  <Title :title="$t('user.title')" />
  <div class="flex flex-col gap-5">
    <el-card>
      <div class="flex flex-row justify-between gap-10">
        <div class="flex flex-row gap5 items-center filter-users gap-5">
          <Input
            v-model="searchQuery"
            custom-class="w-[300px]"
            :placeholder="$t('user.searchByName')"
            :prefix-icon="Search"
          />
          <div>{{ $t('user.filter') }}</div>
        </div>
        <div class="flex flex-row gap-5">
          <el-button plain type="primary" :icon="Tools">{{ $t('button.roleSetting') }}</el-button>
          <Drawer ref="addUserDrawerRef">
            <template #button>
              <el-button type="primary" :icon="Plus">{{ $t('button.add') }}</el-button>
            </template>
          </Drawer>
        </div>
      </div>
    </el-card>
    <el-card>
      <Table :columnConfigs="columnConfigs" :data="tableData" :callback="handleGetUser" :disabledIds="disabledIds">
        <template #name="{ row }">
          <div>
            <span>{{ row.name }}</span>
            <br />
            <span class="!text-blue-500">{{ row.username }}</span>
          </div>
        </template>
        <template #sql="{ row }">
          <div>
            <span>{{ row.sql }}</span>
            <br />
            <span class="!text-blue-500">{{ row.sqlId }}</span>
          </div>
        </template>
        <template #actions>
          <div class="flex flex-row gap-2">
            <el-icon :size="18" class="cursor-pointer"><Edit /></el-icon>
            <el-icon :size="18" color="#e03131" class="cursor-pointer"><Delete /></el-icon>
          </div>
        </template>
      </Table>
    </el-card>
  </div>
</template>

<style lang="css" scoped>
.filter-users :deep(.el-form-item),
.filter-users :deep(.input-component) {
  margin-bottom: 0px;
}
</style>

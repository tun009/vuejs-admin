<script setup lang="ts">
import { PaginationModel } from '@/@types/common'
import { UserModel, userListColumnConfigs } from '@/@types/pages/users'
import { getUsers } from '@/api/users'
import Drawer from '@/components/common/Drawer.vue'
import Input from '@/components/common/Input.vue'
import Table from '@/components/common/Table.vue'
import { Title } from '@/layouts/components'
import { Delete, Edit, Plus, Search, Tools } from '@element-plus/icons-vue'
import { ref } from 'vue'
import AddUserForm from './components/AddUserForm.vue'
import UpdateUserForm from './components/UpdateUserForm.vue'

defineOptions({
  name: 'Users'
})

const addUserDrawerRef = ref<InstanceType<typeof Drawer>>()
const addUserFormRef = ref<InstanceType<typeof AddUserForm>>()
const updateUserDrawerRef = ref<InstanceType<typeof Drawer>>()
const updateUserFormRef = ref<InstanceType<typeof UpdateUserForm>>()
const searchQuery = ref('')

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
    <div class="flex flex-row justify-between gap-10">
      <div class="flex flex-row gap5 items-center filter-users gap-5">
        <Input v-model="searchQuery" custom-class="w-[300px]" placeholder="user.searchByName" :prefix-icon="Search" />
        <div>{{ $t('user.filter') }}</div>
      </div>
      <div class="flex flex-row gap-3">
        <el-button plain type="primary" :icon="Tools">{{ $t('button.roleSetting') }}</el-button>
        <Drawer ref="addUserDrawerRef" title="user.addUser.title" @close="addUserFormRef?.handleClose">
          <template #button>
            <el-button type="primary" :icon="Plus">{{ $t('button.add') }}</el-button>
          </template>
          <template #default>
            <AddUserForm ref="addUserFormRef" @close="addUserDrawerRef?.closeDrawer()" />
          </template>
        </Drawer>
      </div>
    </div>
    <el-card>
      <Table
        :columnConfigs="userListColumnConfigs"
        :data="tableData"
        :callback="handleGetUser"
        :disabledIds="disabledIds"
      >
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
            <el-icon :size="18" class="cursor-pointer" @click="updateUserDrawerRef?.openDrawer"><Edit /></el-icon>
            <el-icon :size="18" color="#e03131" class="cursor-pointer"><Delete /></el-icon>
          </div>
        </template>
      </Table>
    </el-card>
  </div>

  <Drawer ref="updateUserDrawerRef" title="user.updateUser.title" @close="updateUserFormRef?.handleClose">
    <template #default>
      <UpdateUserForm ref="updateUserFormRef" @close="updateUserDrawerRef?.closeDrawer()" />
    </template>
  </Drawer>
</template>

<style lang="css" scoped>
.filter-users :deep(.el-form-item),
.filter-users :deep(.input-component) {
  margin-bottom: 0px;
}
</style>

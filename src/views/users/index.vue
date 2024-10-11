<script setup lang="ts">
import { Delete, Edit, Filter, Plus, Search, Tools } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

import AddUserForm from './components/AddUserForm.vue'
import UpdateUserForm from './components/UpdateUserForm.vue'
import ConfigRoleUserForm from './components/ConfigRoleUserForm.vue'

import { PaginationModel } from '@/@types/common'
import { UserModel, userListColumnConfigs } from '@/@types/pages/users'
import { getUsers } from '@/api/users'
import Drawer from '@/components/common/Drawer.vue'
import Input from '@/components/common/Input.vue'
import Table from '@/components/common/Table.vue'
import { Title } from '@/layouts/components'
import { handleComingSoon } from '@/utils/common'

defineOptions({
  name: 'Users'
})

const addUserFormRef = ref<InstanceType<typeof AddUserForm>>()
const updateUserFormRef = ref<InstanceType<typeof UpdateUserForm>>()
const configRoleUserFormRef = ref<InstanceType<typeof ConfigRoleUserForm>>()

const openAddUserDrawer = ref(false)
const openUpdateUserDrawer = ref(false)
const searchQuery = ref('')
const openConfigRoleUserDrawer = ref(false)

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

const handleDeleteUser = (name: string) => {
  ElMessageBox.confirm(
    `Sau khi xóa thành công <strong> ${name} </strong>: <br/> Bạn không thể xem các tác vụ người dùng này đã xử lý <br/> Sau khi Xóa thành công, tài khoản này sẽ không thể khôi phục lại. <br/> <br/> Bạn xác nhận xóa người dùng này chứ?`,
    'Xóa người dùng',
    {
      cancelButtonText: 'Hủy bỏ',
      confirmButtonText: 'Xác nhận xóa',
      dangerouslyUseHTMLString: true,
      draggable: true,
      type: 'warning'
    }
  )
    .then(() => {
      ElMessage({
        message: 'Delete user completed',
        type: 'success'
      })
    })
    .catch(() => {
      ElMessage({
        message: 'Delete user canceled',
        type: 'info'
      })
    })
}
</script>

<template>
  <Title :title="$t('user.title')" />
  <div class="flex flex-col gap-5">
    <div class="flex flex-row justify-between gap-10">
      <div class="flex flex-row gap5 items-center _filter gap-5">
        <Input v-model="searchQuery" custom-class="w-[300px]" placeholder="user.searchByName" :prefix-icon="Search" />
        <el-button :icon="Filter" @click="handleComingSoon">{{ $t('user.filter') }}</el-button>
      </div>
      <div class="flex flex-row gap-3">
        <Drawer title="Cấu hình vai trò" size="50%" v-model="openConfigRoleUserDrawer">
          <template #button>
            <el-button plain type="primary" :icon="Tools">{{ $t('button.roleSetting') }}</el-button>
          </template>
          <template #default>
            <ConfigRoleUserForm ref="configRoleUserFormRef" @close="openConfigRoleUserDrawer = false" />
          </template>
        </Drawer>
        <Drawer title="user.addUser.title" v-model="openAddUserDrawer">
          <template #button>
            <el-button type="primary" :icon="Plus">{{ $t('button.add') }}</el-button>
          </template>
          <template #default>
            <AddUserForm ref="addUserFormRef" @close="openAddUserDrawer = false" />
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
        <template #sol="{ row }">
          <div>
            <span>{{ row.sol }}</span>
            <br />
            <span class="!text-blue-500">{{ row.solId }}</span>
          </div>
        </template>
        <template #actions="{ row }">
          <div class="flex flex-row gap-2">
            <el-icon :size="18" class="cursor-pointer" @click="openUpdateUserDrawer = true"><Edit /></el-icon>
            <el-icon :size="18" color="#e03131" class="cursor-pointer" @click="handleDeleteUser(row.name)"
              ><Delete
            /></el-icon>
          </div>
        </template>
      </Table>
    </el-card>
  </div>

  <Drawer v-if="openAddUserDrawer" title="user.addUser.title" v-model="openAddUserDrawer">
    <template #default>
      <AddUserForm ref="addUserFormRef" @close="openAddUserDrawer = false" />
    </template>
  </Drawer>

  <Drawer v-if="openUpdateUserDrawer" v-model="openUpdateUserDrawer" title="user.updateUser.title">
    <template #default>
      <UpdateUserForm ref="updateUserFormRef" @close="openUpdateUserDrawer = false" />
    </template>
  </Drawer>
</template>

<style lang="css" scoped>
._filter :deep(.el-form-item),
._filter :deep(.input-component) {
  margin-bottom: 0px;
}
</style>

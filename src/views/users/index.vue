<script setup lang="ts">
import ConfigRoleUserForm from './components/ConfigRoleUserForm.vue'

import { PaginationModel } from '@/@types/common'
import { UserModel, userListColumnConfigs } from '@/@types/pages/users'
import { getUsers } from '@/api/users'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { Title } from '@/layouts/components'
import { Delete, Filter, Plus, Search, Tools } from '@element-plus/icons-vue'
import { ref } from 'vue'
import AddUserForm from './components/AddUserForm.vue'
import UpdateUserForm from './components/UpdateUserForm.vue'
import { handleComingSoon } from '@/utils/common'
import { ElMessage, ElMessageBox } from 'element-plus'

// defineOptions({
//   name: 'Users'
// })

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
      confirmButtonText: 'Xác nhận xóa',
      cancelButtonText: 'Hủy bỏ',
      type: 'warning',
      dangerouslyUseHTMLString: true,
      draggable: true
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete user completed'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete user canceled'
      })
    })
}
</script>

<template>
  <Title :title="$t('user.title')" />
  <div class="flex flex-col gap-5">
    <div class="flex flex-row justify-between gap-10">
      <div class="flex flex-row gap5 items-center gap-5">
        <EIBInput
          v-model="searchQuery"
          custom-class="w-[300px]"
          placeholder="user.searchByName"
          :prefix-icon="Search"
          hidden-error
        />
        <el-button :icon="Filter" @click="handleComingSoon">{{ $t('user.filter') }}</el-button>
      </div>
      <div class="flex flex-row gap-3">
        <el-button plain type="primary" :icon="Tools" @click="openConfigRoleUserDrawer = true">{{
          $t('button.roleSetting')
        }}</el-button>
        <el-button type="primary" :icon="Plus" @click="openAddUserDrawer = true">{{ $t('button.add') }}</el-button>
      </div>
    </div>
    <el-card>
      <EIBTable
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
            <SvgIcon :size="18" name="edit-info" @click.stop="openUpdateUserDrawer = true" class="cursor-pointer" />
            <el-icon :size="18" color="#e03131" class="cursor-pointer" @click="handleDeleteUser(row.name)"
              ><Delete
            /></el-icon>
          </div>
        </template>
      </EIBTable>
    </el-card>
  </div>

  <EIBDrawer title="Cấu hình vai trò" size="50%" v-model="openConfigRoleUserDrawer">
    <template #button>
      <el-button plain type="primary" :icon="Tools">{{ $t('button.roleSetting') }}</el-button>
    </template>
    <template #default>
      <ConfigRoleUserForm ref="configRoleUserFormRef" @close="openConfigRoleUserDrawer = false" />
    </template>
  </EIBDrawer>

  <EIBDrawer v-if="openAddUserDrawer" title="user.addUser.title" v-model="openAddUserDrawer">
    <template #default>
      <AddUserForm @close="openAddUserDrawer = false" />
    </template>
  </EIBDrawer>

  <EIBDrawer v-if="openUpdateUserDrawer" v-model="openUpdateUserDrawer" title="user.updateUser.title">
    <template #default>
      <UpdateUserForm @close="openUpdateUserDrawer = false" />
    </template>
  </EIBDrawer>
</template>

<style lang="css" scoped></style>

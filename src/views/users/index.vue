<script setup lang="ts">
import ConfigRoleUserForm from './components/ConfigRoleUserForm.vue'

import { PaginationModel } from '@/@types/common'
import { FilterUserModel, UserModel, userListColumnConfigs } from '@/@types/pages/users'
import { getUsers } from '@/api/users'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { Title } from '@/layouts/components'
import { Delete, Filter, Plus, Search, Tools } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import AddUserForm from './components/AddUserForm.vue'
import UpdateUserForm from './components/UpdateUserForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { omitPropertyFromObject } from '@/utils/common'
// import EIBMultipleFilter from '@/components/Filter/EIBMultipleFilter.vue'
// import EIBSingleFilter from '@/components/Filter/EIBSingleFilter.vue'

// defineOptions({
//   name: 'Users'
// })

const configRoleUserFormRef = ref<InstanceType<typeof ConfigRoleUserForm>>()

const openAddUserDrawer = ref(false)
const openUpdateUserDrawer = ref(false)
const searchQuery = ref('')
const openConfigRoleUserDrawer = ref(false)

const disabledIds = [1]
const openFilter = ref(false)
const filterValue = reactive<FilterUserModel>({} as FilterUserModel)

const tableData = ref<UserModel[]>([])

const handleResetFilter = () => {
  filterValue.name = ''
  filterValue.branchId = -1
  filterValue.role = -1
  filterValue.status = -1
}

const handleGetUser = async (pagination: PaginationModel) => {
  try {
    const response = await getUsers({
      ...pagination,
      ...omitPropertyFromObject(filterValue, -1),
      sortItemList: [
        {
          isAsc: false,
          column: 'name'
        }
      ]
    })
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
        <div class="flex flex-row gap-5 items-center">
          <div class="flex flex-row gap-1 items-center p-1 cursor-pointer" @click="openFilter = !openFilter">
            <el-icon><Filter /></el-icon>
            <span class="whitespace-nowrap">Bộ lọc</span>
            <el-icon
              class="ml-2 transition-all duration-300"
              :class="{ 'rotate-180': openFilter, 'rotate-0': !openFilter }"
              ><ArrowDownBold
            /></el-icon>
          </div>
          <el-divider direction="vertical" />
          <span class="text-primary whitespace-nowrap cursor-pointer" @click="handleResetFilter"
            >Khôi phục mặc định</span
          >
          <el-button type="primary" plain>Tìm kiếm</el-button>
        </div>
      </div>
      <div class="flex flex-row gap-3">
        <el-button plain type="primary" :icon="Tools" @click="openConfigRoleUserDrawer = true">{{
          $t('button.roleSetting')
        }}</el-button>
        <el-button type="primary" :icon="Plus" @click="openAddUserDrawer = true">{{ $t('button.add') }}</el-button>
      </div>
    </div>
    <div
      class="transition-all duration-300 overflow-hidden flex flex-row items-center gap-5"
      :class="{ 'h-10 mb-2': openFilter, 'h-0': !openFilter }"
    >
      <!-- <EIBMultipleFilter title="Vai trò" />
      <EIBSingleFilter title="SOL" />
      <EIBSingleFilter title="Trạng thái" /> -->
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

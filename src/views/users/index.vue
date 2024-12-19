<script setup lang="ts">
import ConfigRoleUserForm from './components/ConfigRoleUserForm.vue'

import { PaginationModel } from '@/@types/common'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { Title } from '@/layouts/components'
import { Delete, Filter, Plus, Search, Tools } from '@element-plus/icons-vue'
import { ref, reactive, watch, onMounted } from 'vue'
import AddUserForm from './components/AddUserForm.vue'
import UpdateUserForm from './components/UpdateUserForm.vue'
import { omitPropertyFromObject, mappingBranches, withAllSelection } from '@/utils/common'
import { useConfirmModal } from '@/hooks/useConfirm'
import { debounce } from 'lodash-es'
import { deleteUser, lockUser, getUsers } from '@/api/users'
import {
  roleTypeOptions,
  statusTypeOptions,
  FilterUserModel,
  UserModel,
  userListColumnConfigs,
  UserStatusEnum
} from '@/@types/pages/users'
import { getBranches } from '@/api/docs/document'

const { showConfirmModal } = useConfirmModal()
// import EIBMultipleFilter from '@/components/Filter/EIBMultipleFilter.vue'
import EIBSingleFilter from '@/components/Filter/EIBSingleFilter.vue'
import { BranchModel } from '@/@types/pages/login'
import { useUserStore } from '@/store/modules/user'

const { isAdmin } = useUserStore()

const configRoleUserFormRef = ref<InstanceType<typeof ConfigRoleUserForm>>()

const openAddUserDrawer = ref(false)
const openUpdateUserDrawer = ref(false)
const openConfigRoleUserDrawer = ref(false)

const disabledIds = [1]
const openFilter = ref(false)
const filterValue = reactive<FilterUserModel>({} as FilterUserModel)

const tableData = ref<UserModel[]>([])
const rowSelect = ref<UserModel>({} as UserModel)

const checkedItems = ref<UserModel[]>([])
const userTableRef = ref<InstanceType<typeof EIBTable>>()

const branches = ref<BranchModel[]>([])

const handleUpdateUser = (row: UserModel) => {
  openUpdateUserDrawer.value = true
  rowSelect.value = row
}

const handleClearAllChecked = () => {
  checkedItems.value = []
  userTableRef.value?.clearSelection()
}

const handleGetData = debounce(() => userTableRef?.value?.handleGetData(), 300)

watch(
  [() => filterValue],
  async () => {
    handleGetData()
  },
  {
    deep: true
  }
)

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
          column: 'createdAt'
        }
      ]
    })
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}

const handleDeleteUser = (data?: UserModel) => {
  showConfirmModal({
    message: `Sau khi xóa thành công <strong> ${data?.name}:</strong> <br/>&nbsp; <strong>•</strong>  Bạn không thể xem các tác vụ người dùng này đã xử lý <br/> Sau khi Xóa thành công, tài khoản này sẽ không thể khôi phục lại. <br/> Bạn xác nhận xóa người dùng này chứ?`,
    title: 'Xóa người dùng',
    successCallback: handleClearAllChecked,
    onConfirm: async (instance, done) => {
      try {
        if (data) {
          await deleteUser([data?.id ?? ''])
        } else {
          const ids = checkedItems.value.map((i) => i.id)
          await deleteUser(ids)
        }
        handleGetData()
        done()
      } catch (error) {
        console.error(error)
      } finally {
        instance.confirmButtonLoading = false
      }
    },
    options: {
      confirmButtonText: 'Xác nhận xóa'
    },
    isDelete: true
  })
}

const handleLockUser = (data?: UserModel) => {
  showConfirmModal({
    message: `Bạn xác nhận khóa người dùng này chứ?`,
    title: 'Khóa người dùng',
    successCallback: handleClearAllChecked,
    onConfirm: async (instance, done) => {
      try {
        if (data) {
          await lockUser([data?.id ?? ''])
        } else {
          const ids = checkedItems.value.map((i) => i.id)
          await lockUser(ids)
        }
        handleGetData()
        done()
      } catch (error) {
        console.error(error)
      } finally {
        instance.confirmButtonLoading = false
      }
    }
  })
}

const handleGetBranches = async () => {
  try {
    const { data } = await getBranches()
    branches.value = data
  } catch (error) {
    console.error(error)
  }
}

const getNameStatus = (name: string) => {
  if (name == UserStatusEnum.ACTIVE) {
    return 'Hoạt động'
  } else {
    return 'Khóa tài khoản'
  }
}

const isHaveDeleteDocument = () => {
  if (isAdmin) {
    return true
  } else {
    return false
  }
}

onMounted(() => {
  handleGetBranches()
})
</script>

<template>
  <Title :title="$t('user.title')" />
  <div class="flex flex-col gap-5">
    <div class="flex flex-row justify-between gap-10">
      <div class="flex flex-row gap5 items-center gap-5">
        <EIBInput
          v-model="filterValue.name"
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
      <EIBSingleFilter v-model="filterValue.role" title="Vai trò" :options="roleTypeOptions" />
      <EIBSingleFilter
        v-model="filterValue.branchId"
        title="SOL"
        :options="withAllSelection(mappingBranches(branches))"
      />
      <EIBSingleFilter v-model="filterValue.status" title="Trạng thái" :options="statusTypeOptions" />
    </div>

    <el-card>
      <EIBTable
        ref="userTableRef"
        :columnConfigs="userListColumnConfigs"
        @update:selection="(val: UserModel[]) => (checkedItems = val)"
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
        <template #branch="{ row }">
          <div>
            <span>{{ row?.branch?.name }}</span>
          </div>
        </template>
        <template #status="{ row }">
          <div>
            <span>{{ getNameStatus(row?.status) }}</span>
          </div>
        </template>
        <template #actions="{ row }">
          <div class="flex flex-row gap-3 items-center justify-center">
            <SvgIcon :size="18" name="edit-info" @click.stop="handleUpdateUser(row)" class="cursor-pointer" />
            <div class="w-[20px] h-[20px]" v-if="isHaveDeleteDocument()">
              <SvgIcon :size="20" name="delete-mini" class="cursor-pointer" @click="handleDeleteUser(row)" />
            </div>
          </div>
        </template>
      </EIBTable>
    </el-card>
  </div>

  <EIBDrawer title="Cấu hình vai trò" size="50%" v-model="openConfigRoleUserDrawer" :is-confirm-close="false">
    <template #button>
      <el-button plain type="primary" :icon="Tools">{{ $t('button.roleSetting') }}</el-button>
    </template>
    <template #default>
      <ConfigRoleUserForm ref="configRoleUserFormRef" @close="openConfigRoleUserDrawer = false" />
    </template>
  </EIBDrawer>

  <EIBDrawer v-if="openAddUserDrawer" title="user.addUser.title" v-model="openAddUserDrawer">
    <template #default>
      <AddUserForm @close="openAddUserDrawer = false" @refresh="handleGetData" />
    </template>
  </EIBDrawer>

  <EIBDrawer v-if="openUpdateUserDrawer" v-model="openUpdateUserDrawer" title="user.updateUser.title">
    <template #default>
      <UpdateUserForm @close="openUpdateUserDrawer = false" :data="rowSelect" @refresh="handleGetData" />
    </template>
  </EIBDrawer>

  <Transition :duration="300" name="nested" class="fixed bottom-0 -ml-5">
    <div v-if="!!checkedItems.length" class="outer px-5 py-3 w-full shadow-md border border-[#f8f9fa] bg-[#4f4f4f1a]">
      <div class="inner flex flex-row gap-x-5 items-center">
        <span class="text-[#495057] text-sm"
          >{{ $t('docs.document.selected') }}
          <strong>{{ checkedItems.length }} {{ $t('docs.document.items') }}</strong>
          <span class="text-blue-500 cursor-pointer ml-1" @click="handleClearAllChecked"
            >( {{ $t('docs.document.cancelAll') }} )</span
          ></span
        >
        <el-button type="primary" plain @click="() => handleLockUser()">Khóa tài khoản</el-button>
        <el-button type="danger" plain :icon="Delete" @click="() => handleDeleteUser()">{{
          $t('button.delete')
        }}</el-button>
      </div>
    </div>
  </Transition>
</template>

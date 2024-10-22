<script setup lang="ts">
import { PaginationModel } from '@/@types/common'
import { ruleListColumnConfigs, RuleModel } from '@/@types/pages/rules'
import { getRules } from '@/api/rules/'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { Title } from '@/layouts/components'
import { Edit, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import UpdateRuleForm from '../components/UpdateRuleForm.vue'

// defineOptions({
//   name: 'Rules'
// })

const openUpdateRuleDrawer = ref(false)
const searchQuery = ref('')

const disabledIds = [1]

const tableData = ref<RuleModel[]>([])

const handleGetRule = async (pagination: PaginationModel) => {
  try {
    const response = await getRules({ ...pagination, searchQuery: searchQuery.value })
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}
</script>

<template>
  <Title title="Quản lý luật UCP/ISBP" />
  <div class="flex flex-col gap-5">
    <div class="flex flex-row justify-between gap-10">
      <div class="flex flex-row gap5 items-center _filter gap-5 w-full">
        <EIBInput
          v-model="searchQuery"
          custom-class="w-[300px]"
          placeholder="Tìm kiếm nội dung"
          :prefix-icon="Search"
          class="w-[20%]"
        />
        <div>Loại chứng từ</div>
        <!-- <el-button :icon="Filter" @click="handleComingSoon">{{ $t('user.filter') }}</el-button> -->
      </div>
    </div>
    <el-card>
      <EIBTable
        :columnConfigs="ruleListColumnConfigs"
        :data="tableData"
        :callback="handleGetRule"
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
        <template #actions>
          <div class="flex flex-row gap-2">
            <el-icon :size="18" class="cursor-pointer" @click="openUpdateRuleDrawer = true"><Edit /></el-icon>
          </div>
        </template>
      </EIBTable>
    </el-card>
  </div>

  <EIBDrawer v-if="openUpdateRuleDrawer" v-model="openUpdateRuleDrawer" title="Cập nhật thông tin luật">
    <template #default>
      <UpdateRuleForm @close="openUpdateRuleDrawer = false" />
    </template>
  </EIBDrawer>
</template>

<style lang="css">
.el-form-item,
.input-component {
  margin-bottom: 0px;
}
</style>

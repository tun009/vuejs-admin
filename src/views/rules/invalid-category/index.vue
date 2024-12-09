<script setup lang="ts">
import { PaginationModel, SelectOptionModel } from '@/@types/common'
import { FilterRulesModel, ruleListColumnConfigs, RuleModel, RuleTypeEnum } from '@/@types/pages/rules'
import { getRules } from '@/api/rules/'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import EIBSingleFilter from '@/components/Filter/EIBSingleFilter.vue'
import { Title } from '@/layouts/components'
import { omitPropertyFromObject, getTextFromHtml } from '@/utils/common'
import { Search } from '@element-plus/icons-vue'
import debounce from 'lodash-es/debounce'
import { onMounted, reactive, ref, watch } from 'vue'
import UpdateRuleForm from '../components/UpdateRuleForm.vue'
import { getDocummentTypeApi } from '@/api/extract'
const documentTypes = ref<SelectOptionModel[]>([])

const rulesTableRef = ref<InstanceType<typeof EIBTable>>()
const filterValue = reactive<FilterRulesModel>({ query: '' } as FilterRulesModel)
filterValue.type = RuleTypeEnum.CATEGORY
const openUpdateRuleDrawer = ref(false)

const tableData = ref<RuleModel[]>([])

const handleGetRules = async (pagination: PaginationModel) => {
  try {
    const response = await getRules({ ...pagination, ...omitPropertyFromObject(filterValue, -1) })
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}
const dataUpdateRule = ref<RuleModel>({} as RuleModel)
const openModalUpdateRule = (data: RuleModel) => {
  openUpdateRuleDrawer.value = true
  dataUpdateRule.value = data
}
const handleGetData = debounce(() => rulesTableRef?.value?.handleGetData(), 300)
const getDocTypes = async () => {
  try {
    const response = await getDocummentTypeApi()
    documentTypes.value = [
      { label: 'Tất cả', value: -1 },
      ...response.data.map((item) => ({
        label: item.name,
        value: item.id
      }))
    ]
  } catch (error: any) {
    throw new Error(error)
  }
}
watch(
  [() => filterValue],
  async () => {
    handleGetData()
  },
  {
    deep: true
  }
)
onMounted(() => {
  getDocTypes()
})
</script>

<template>
  <Title title="Quản lý danh mục bất hợp lệ" />
  <div class="flex flex-col gap-5 rules-page">
    <div class="flex flex-row justify-between gap-10">
      <div class="flex flex-row gap5 items-center _filter gap-5">
        <EIBInput
          v-model="filterValue.query"
          custom-class="w-[300px]"
          placeholder="Tìm kiếm nội dung"
          :prefix-icon="Search"
        />
        <EIBSingleFilter
          v-model="filterValue.docTypeId"
          title="Loại chứng từ"
          :options="documentTypes"
          custom-class="w-full"
        />
      </div>
    </div>
    <el-card>
      <EIBTable
        ref="rulesTableRef"
        :columnConfigs="ruleListColumnConfigs"
        :data="tableData"
        :callback="handleGetRules"
        hiddenChecked
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
        <template #en="{ row }">
          <span>{{ getTextFromHtml(row.en) }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex flex-row gap-2">
            <SvgIcon :size="18" name="edit-info" @click.stop="openModalUpdateRule(row)" class="cursor-pointer" />
          </div>
        </template>
      </EIBTable>
    </el-card>
  </div>

  <EIBDrawer v-if="openUpdateRuleDrawer" v-model="openUpdateRuleDrawer" title="Cập nhật thông tin luật">
    <template #default>
      <UpdateRuleForm
        @close="openUpdateRuleDrawer = false"
        :data="dataUpdateRule"
        @refresh="rulesTableRef?.handleGetData()"
      />
    </template>
  </EIBDrawer>
</template>

<style lang="css">
.rules-page .el-form-item,
.rules-page .input-component {
  margin-bottom: 0px;
}
</style>

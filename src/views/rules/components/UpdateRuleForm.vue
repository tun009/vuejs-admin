<script setup lang="ts">
import { RuleModel, UpdateRuleRequestModel } from '@/@types/pages/rules'
import { updateRule } from '@/api/rules'
import Input from '@/components/common/EIBInput.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
// import { requireRule } from '@/utils/validate'
import { ElMessage, FormRules } from 'element-plus'
import { reactive, ref, watch } from 'vue'

interface Emits {
  (event: 'close'): void
  (event: 'refresh'): void
}

interface Exposes {
  handleClose: () => void
}
interface Props {
  data: RuleModel
  rule: ''
}
const props = defineProps<Props>()

const emits = defineEmits<Emits>()

const loading = ref(false)
const updateRuleFormRef = ref()
const updateRuleFormData: UpdateRuleRequestModel = reactive({
  name: props?.data?.docType,
  code: props?.data?.code,
  en: props?.data?.en
})

const ruleType: string = props.rule

const updateRuleFormRules: FormRules = {
  name: []
}
const removePTag = (htmlString: string): string => {
  if (!htmlString) return ''
  return htmlString.replace(/^<p>|<\/p>$/g, '').trim()
}
const wrapInPTag = (htmlString: string): string => {
  if (!htmlString) return ''
  return `<p>${htmlString}</p>`
}
watch(
  () => updateRuleFormData.en,
  (newValue) => {
    updateRuleFormData.en = removePTag(newValue)
  },
  { immediate: true }
)
const handleClose = () => {
  emits('close')
  updateRuleFormRef.value.resetFields()
}

const handleUpdateRule = () => {
  updateRuleFormRef.value?.validate(async (valid: boolean, fields: any) => {
    try {
      if (valid) {
        loading.value = true
        const contentWithPTag = wrapInPTag(updateRuleFormData.en)
        await updateRule({ id: props.data.id as number, type: props.data.type, en: contentWithPTag })
        ElMessage({
          message: 'Cập nhật thông tin thành công!',
          showClose: true,
          type: 'success'
        })
        emits('refresh')
        handleClose()
      } else {
        console.error('Form validation failed', fields)
      }
    } catch (error) {
      console.error(error)
      ElMessage({
        type: 'error',
        showClose: true,
        message: 'Có lỗi xảy ra, vui lòng thử lại!'
      })
    } finally {
      loading.value = false
    }
  })
}

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <el-form
    ref="updateRuleFormRef"
    :model="updateRuleFormData"
    :rules="updateRuleFormRules"
    @keyup.enter="handleUpdateRule"
    class="flex flex-col gap-1"
  >
    <EIBSelect label="Loại chứng từ" v-model="updateRuleFormData.name" name="name" :options="[]" readonly />
    <Input label="Mã" name="code" placeholder="" v-model="updateRuleFormData.code" disabled />
    <Input
      label="Nội dung"
      name="en"
      placeholder=""
      v-model="updateRuleFormData.en"
      type="textarea"
      :rows="5"
      show-limit
      :max-length="1200"
    />
    <div v-if="ruleType == 'invalid'">
      <p class="text-[#e67700] text-[12px] italic">
        *Lưu ý: khi chỉnh sửa nội dung, cụm từ “%s” không được bổ sung thêm hoặc xóa bớt đi, vì sẽ ảnh hưởng đến hệ
        thống khi trả kết quả đối sánh
      </p>
    </div>
  </el-form>
  <div>
    <el-button :loading="loading" @click.prevent="handleUpdateRule" type="primary">Lưu thay đổi</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

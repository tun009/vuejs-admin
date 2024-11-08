<script setup lang="ts">
import EIBUpload from '@/components/common/EIBUpload.vue'
import { ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
}

interface Emits {
  (event: 'update:model-value', value: boolean): void
  (event: 'refresh'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { t } = useI18n()

const files = ref<File[]>([])
const loading = ref(false)

const addFiles = (fileList: FileList) => {
  files.value.push(...Array.from(fileList))
}

const setFiles = (fileList: File[]) => {
  files.value = fileList
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm(t('notification.description.confirmClose'))
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:model-value', newValue)
  }
})
</script>

<template>
  <el-dialog
    v-model="localModelValue"
    :title="$t('docs.document.replaceDocument')"
    width="50%"
    :before-close="handleClose"
  >
    <template #footer>
      <div class="dialog-footer flex flex-row justify-between items-center">
        <span class="text-sm text-gray-600">{{ $t('docs.document.uploadNoteSingle') }}</span>
        <div>
          <el-button @click="localModelValue = false">{{ $t('button.cancel') }}</el-button>
          <el-button :loading="loading" type="primary">
            {{ $t('button.confirm') }}
          </el-button>
        </div>
      </div>
    </template>
    <EIBUpload :files="files" @add-files="addFiles" @set-files="setFiles" :limit-file-count="1" />
  </el-dialog>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/store/modules/settings'
import { TLanguage } from '@/@types/common'
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  color: {
    type: String,
    default: '#666'
  }
})

const { locale } = useI18n()

const settingsStore = useSettingsStore()
const languages = reactive([
  {
    name: 'Vietnamese',
    value: 'vi' as TLanguage,
    flag: 'flag-vi'
  },
  {
    name: 'English',
    value: 'en' as TLanguage,
    flag: 'flag-en'
  }
])

const language = computed(() => {
  return settingsStore.language
})

const languageOption = computed(() => languages.find((item) => item.value === language.value))

const handleSetLanguage = (lang: 'vi' | 'en') => {
  settingsStore.language = lang
  locale.value = lang
}
</script>

<template>
  <el-dropdown trigger="click">
    <div>
      <el-tooltip effect="dark" :content="$t('layouts.config.language')" placement="bottom">
        <SvgIcon :name="languageOption?.flag ?? ''" className="!w-5 !h-5" />
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in languages" :key="item.value" :disabled="language == item.value">
          <div class="flex flex-row gap-2 items-center" @click="handleSetLanguage(item.value)">
            <SvgIcon :name="item.flag" className="!w-5 !h-5" />
            <span>{{ item.name }}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.icon-lang {
  padding: 20px 10px;
}
</style>

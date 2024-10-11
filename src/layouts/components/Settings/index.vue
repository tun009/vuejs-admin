<script lang="ts" setup>
import { watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/store/modules/settings'
import { useLayoutMode } from '@/hooks/useLayoutMode'
import { resetConfigLayout } from '@/utils'
import SelectLayoutMode from './SelectLayoutMode.vue'
import { Refresh } from '@element-plus/icons-vue'

const { isLeft } = useLayoutMode()
const settingsStore = useSettingsStore()

/** Use storeToRefs to keep the fetched properties responsive */
const {
  showTagsView,
  showLogo,
  fixedHeader,
  showFooter,
  showNotify,
  showThemeSwitch,
  showScreenfull,
  showSearchMenu,
  cacheTagsView,
  showWatermark,
  showGreyMode,
  showColorWeakness
} = storeToRefs(settingsStore)

/** Define switch settings */
const switchSettings = {
  showTagsView: showTagsView,
  showLogo: showLogo,
  fixedHeader: fixedHeader,
  showFooter: showFooter,
  showNotify: showNotify,
  showThemeSwitch: showThemeSwitch,
  showScreenfull: showScreenfull,
  showSearchMenu: showSearchMenu,
  cacheTagsView: cacheTagsView,
  showWatermark: showWatermark,
  showGreyMode: showGreyMode,
  showColorWeakness: showColorWeakness
}

/** When not in left mode, the Header is in fixed layout */
watchEffect(() => {
  !isLeft.value && (fixedHeader.value = true)
})
</script>

<template>
  <div class="setting-container">
    <h4>{{ $t('layouts.config.layoutConfig') }}</h4>
    <SelectLayoutMode />
    <el-divider />
    <h4>{{ $t('layouts.config.functionConfig') }}</h4>
    <div class="setting-item" v-for="(settingValue, settingName, index) in switchSettings" :key="index">
      <span class="setting-name">{{ $t('layouts.config.' + settingName) }}</span>
      <el-switch v-model="settingValue.value" :disabled="!isLeft && settingName === 'fixedHeader'" />
    </div>
    <el-button type="danger" :icon="Refresh" @click="resetConfigLayout">{{ $t('button.reset') }}</el-button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.setting-container {
  padding: 20px;
  .setting-item {
    font-size: 14px;
    color: var(--el-text-color-regular);
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .setting-name {
      @extend %ellipsis;
    }
  }
  .el-button {
    margin-top: 40px;
    width: 100%;
  }
}
</style>

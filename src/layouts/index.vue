<script lang="ts" setup>
import { computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/store/modules/settings'
import useResize from './hooks/useResize'
import { useWatermark } from '@/hooks/useWatermark'
import { useDevice } from '@/hooks/useDevice'
import { useLayoutMode } from '@/hooks/useLayoutMode'
import LeftMode from './LeftMode.vue'
import TopMode from './TopMode.vue'
import LeftTopMode from './LeftTopMode.vue'
// import { Settings, RightPanel } from './components'
import { getCssVariableValue, setCssVariableValue } from '@/utils'

/** Layout responsiveness */
useResize()

const { setWatermark, clearWatermark } = useWatermark()
const { isMobile } = useDevice()
const { isLeft, isTop, isLeftTop } = useLayoutMode()
const settingsStore = useSettingsStore()
const { showTagsView, showWatermark, showGreyMode, showColorWeakness } = storeToRefs(settingsStore)

const classes = computed(() => {
  return {
    showGreyMode: showGreyMode.value,
    showColorWeakness: showColorWeakness.value
  }
})

//#region Delete the height of the tag bar when hiding it, so that the height of the Logo component and the height of the Header area are always consistent
const cssVariableName = '--prefix-tagsview-height'
const v3TagsviewHeight = getCssVariableValue(cssVariableName)
watchEffect(() => {
  showTagsView.value
    ? setCssVariableValue(cssVariableName, v3TagsviewHeight)
    : setCssVariableValue(cssVariableName, '0px')
})
//#endregion

/** Turn on or off the system watermark */
watchEffect(() => {
  showWatermark.value ? setWatermark(import.meta.env.VITE_APP_TITLE) : clearWatermark()
})
</script>

<template>
  <div :class="classes">
    <!-- Left Mode -->
    <LeftMode v-if="isLeft || isMobile" />
    <!-- Top Mode -->
    <TopMode v-else-if="isTop" />
    <!-- Mixed Mode -->
    <LeftTopMode v-else-if="isLeftTop" />
    <!-- Right Settings Panel -->
    <!-- <RightPanel v-if="showSettings">
      <Settings />
    </RightPanel> -->
  </div>
</template>

<style lang="scss" scoped>
.showGreyMode {
  filter: grayscale(1);
}

.showColorWeakness {
  filter: invert(0.8);
}
</style>

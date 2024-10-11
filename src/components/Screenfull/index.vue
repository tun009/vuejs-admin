<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'
import screenfull from 'screenfull'

interface Props {
  /** Full screen element, default is html */
  element?: string
  /** Turn on full screen prompt */
  openTips?: string
  /** Turn off full screen prompt */
  exitTips?: string
  /** Whether it is only for the content area */
  content?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  element: 'html',
  openTips: 'Full screen',
  exitTips: 'Exit full screen',
  content: false
})

// region full screen
const isFullscreen = ref<boolean>(false)
const fullscreenTips = computed(() => {
  return isFullscreen.value ? props.exitTips : props.openTips
})
const fullscreenSvgName = computed(() => {
  return isFullscreen.value ? 'fullscreen-exit' : 'fullscreen'
})
const handleFullscreenClick = () => {
  const dom = document.querySelector(props.element) || undefined
  screenfull.isEnabled ? screenfull.toggle(dom) : ElMessage.warning('Your browser does not work')
}
const handleFullscreenChange = () => {
  isFullscreen.value = screenfull.isFullscreen
  // Clear all classes when exiting full screen
  isFullscreen.value || (document.body.className = '')
}
watchEffect((onCleanup) => {
  // Automatically executed when mounting components
  screenfull.isEnabled && screenfull.on('change', handleFullscreenChange)
  // Automatically executed when uninstalling components
  onCleanup(() => {
    screenfull.isEnabled && screenfull.off('change', handleFullscreenChange)
  })
})
//#endregion

//#region 内容区
const isContentLarge = ref<boolean>(false)
const contentLargeTips = computed(() => {
  return isContentLarge.value ? 'Content area restoration' : 'Content area enlargement'
})
const contentLargeSvgName = computed(() => {
  return isContentLarge.value ? 'fullscreen-exit' : 'fullscreen'
})
const handleContentLargeClick = () => {
  isContentLarge.value = !isContentLarge.value
  // When the content area is enlarged, unnecessary components are hidden.
  document.body.className = isContentLarge.value ? 'content-large' : ''
}
const handleContentFullClick = () => {
  // Cancel content area enlargement
  isContentLarge.value && handleContentLargeClick()
  // When the content area is full screen, hide unnecessary components
  document.body.className = 'content-full'
  // Turn on full screen
  handleFullscreenClick()
}
//#endregion
</script>

<template>
  <div>
    <!-- full screen -->
    <el-tooltip v-if="!content" effect="dark" :content="fullscreenTips" placement="bottom">
      <SvgIcon :name="fullscreenSvgName" @click="handleFullscreenClick" />
    </el-tooltip>
    <!-- content area -->
    <el-dropdown v-else :disabled="isFullscreen">
      <SvgIcon :name="contentLargeSvgName" />
      <template #dropdown>
        <el-dropdown-menu>
          <!-- Content area enlargement -->
          <el-dropdown-item @click="handleContentLargeClick">{{ contentLargeTips }}</el-dropdown-item>
          <!-- Content area full screen -->
          <el-dropdown-item @click="handleContentFullClick">Content area full screen</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { AppMain, NavigationBar, Sidebar, Logo } from './components'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const { showTagsView, showLogo } = storeToRefs(settingsStore)

/** Define the calculated property layoutClasses to control the class name of the layout */
const layoutClasses = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened
  }
})
</script>

<template>
  <div :class="layoutClasses" class="app-wrapper">
    <!-- Header navigation bar and tab bar -->
    <div class="fixed-header layout-header">
      <Logo v-if="showLogo" :collapse="false" class="logo" />
      <div class="content">
        <NavigationBar />
      </div>
    </div>
    <!-- Main container -->
    <div :class="{ hasTagsView: showTagsView }" class="main-container">
      <!-- Left sidebar -->
      <Sidebar class="sidebar-container" />
      <!-- Page body content -->
      <AppMain class="app-main" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
$transition-time: 0.35s;

.app-wrapper {
  @extend %clearfix;
  width: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  z-index: 1002;
  width: 100%;
  display: flex;
  .logo {
    width: var(--prefix-sidebar-width);
  }
  .content {
    flex: 1;
    position: relative;
  }
}

.layout-header {
  background-color: var(--prefix-header-bg-color);
  box-shadow: var(--prefix-header-box-shadow);
  border-bottom: var(--prefix-header-border-bottom);
}

.main-container {
  min-height: 100%;
}

.sidebar-container {
  transition: width $transition-time;
  width: var(--prefix-sidebar-width) !important;
  height: 100%;
  position: fixed;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  border-right: var(--prefix-sidebar-border-right);
  padding-top: var(--prefix-navigationbar-height);
}

.app-main {
  transition: padding-left $transition-time;
  padding-top: var(--prefix-navigationbar-height);
  padding-left: var(--prefix-sidebar-width);
  height: 100vh;
  overflow: auto;
}

.hideSidebar {
  .sidebar-container {
    width: var(--prefix-sidebar-hide-width) !important;
  }
  .app-main {
    padding-left: var(--prefix-sidebar-hide-width);
  }
}

.hasTagsView {
  .sidebar-container {
    padding-top: var(--prefix-header-height);
  }
  .app-main {
    padding-top: var(--prefix-header-height);
  }
}
</style>

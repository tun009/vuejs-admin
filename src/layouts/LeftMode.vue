<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { AppMain, NavigationBar, Sidebar } from './components'
import { useDevice } from '@/hooks/useDevice'
import ChangePassword from '@/views/profile/ChangePassword.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/modules/user'

const { showConfirmModal } = useConfirmModal()
const { t } = useI18n()

const { isMobile } = useDevice()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const { showTagsView, fixedHeader } = storeToRefs(settingsStore)
const { userInfo } = useUserStore()

const openDrawer = ref(false)

/** Define the calculated property layoutClasses to control the class name of the layout */
const layoutClasses = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    withoutAnimation: appStore.sidebar.withoutAnimation,
    mobile: isMobile.value
  }
})

/** Used to handle the event of clicking the sidebar mask layer on the mobile side */
const handleClickOutside = () => {
  appStore.closeSidebar(false)
}

onMounted(() => {
  if (userInfo.firstLogin) {
    showConfirmModal({
      title: t('confirm.title.changePassword'),
      message: t('confirm.description.changePassword'),
      onConfirm: async (_instance, done) => {
        done()
        openDrawer.value = true
      },
      showMesageSucess: false,
      options: {
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false
      }
    })
  }
})
</script>

<template>
  <div :class="layoutClasses" class="app-wrapper">
    <!-- mobile sidebar mask layer -->
    <div v-if="layoutClasses.mobile && layoutClasses.openSidebar" class="drawer-bg" @click="handleClickOutside" />
    <!-- left sidebar -->
    <Sidebar class="sidebar-container" />
    <!-- main container -->
    <div :class="{ hasTagsView: showTagsView }" class="main-container">
      <!-- head navigation bar and tab bar -->
      <div :class="{ 'fixed-header': fixedHeader }" class="layout-header">
        <NavigationBar />
      </div>
      <!-- page body content -->
      <AppMain class="app-main" />
    </div>
  </div>
  <EIBDrawer title="profile.changePassword" v-model="openDrawer" require-confirm>
    <template #default>
      <div class="mt-3 flex flex-col gap-5">
        <el-text>{{ $t('profile.changePasswordDes') + '*&^%#@!' }}</el-text>
        <ChangePassword ref="changePasswordRef" @close="openDrawer = false" require-confirm />
      </div>
    </template>
  </EIBDrawer>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
$transition-time: 0.35s;

.app-wrapper {
  @extend %clearfix;
  position: relative;
  width: 100%;
}

.drawer-bg {
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.sidebar-container {
  background-color: var(--prefix-sidebar-menu-bg-color);
  transition: width $transition-time;
  width: var(--prefix-sidebar-width) !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  border-right: var(--prefix-sidebar-border-right);
}

.main-container {
  min-height: 100%;
  transition: margin-left $transition-time;
  margin-left: var(--prefix-sidebar-width);
  position: relative;
}

.fixed-header {
  position: fixed !important;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - var(--prefix-sidebar-width));
  transition: width $transition-time;
}

.layout-header {
  position: relative;
  z-index: 9;
  background-color: var(--prefix-header-bg-color);
  box-shadow: var(--prefix-header-box-shadow);
  border-bottom: var(--prefix-header-border-bottom);
}

.app-main {
  min-height: calc(100vh - var(--prefix-navigationbar-height));
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: var(--prefix-navigationbar-height);
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - var(--prefix-header-height));
  }
  .fixed-header + .app-main {
    // padding-top: var(--prefix-header-height);
    padding-top: 56px;
  }
}

.hideSidebar {
  .sidebar-container {
    width: var(--prefix-sidebar-hide-width) !important;
  }
  .main-container {
    margin-left: var(--prefix-sidebar-hide-width);
  }
  .fixed-header {
    width: calc(100% - var(--prefix-sidebar-hide-width));
  }
}

.mobile {
  .sidebar-container {
    transition: transform $transition-time;
    width: var(--prefix-sidebar-width) !important;
  }
  .main-container {
    margin-left: 0px;
  }
  .fixed-header {
    width: 100%;
  }
  &.openSidebar {
    position: fixed;
    top: 0;
  }
  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(calc(0px - var(--prefix-sidebar-width)), 0, 0);
    }
  }
}

.withoutAnimation {
  .sidebar-container,
  .main-container {
    transition: none;
  }
}
</style>

<script lang="ts" setup>
import { useDevice } from '@/hooks/useDevice'
import { useLayoutMode } from '@/hooks/useLayoutMode'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useSettingsStore } from '@/store/modules/settings'
import { getCssVariableValue } from '@/utils'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '../Logo/index.vue'
import SidebarItem from './SidebarItem.vue'

const v3SidebarMenuBgColor = getCssVariableValue('--prefix-sidebar-menu-bg-color')
const v3SidebarMenuTextColor = getCssVariableValue('--prefix-sidebar-menu-text-color')
const v3SidebarMenuActiveTextColor = getCssVariableValue('--prefix-sidebar-menu-active-text-color')

const { isMobile } = useDevice()
const { isLeft, isTop } = useLayoutMode()
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()

const activeMenu = computed(() => {
  const {
    meta: { activeMenu },
    path
  } = route
  return activeMenu ? activeMenu : path
})
const noHiddenRoutes = computed(() => permissionStore.routes.filter((item) => !item.meta?.hidden))
const isCollapse = computed(() => !appStore.sidebar.opened)
const isLogo = computed(() => isLeft.value && settingsStore.showLogo)
const backgroundColor = computed(() => (isLeft.value ? v3SidebarMenuBgColor : undefined))
const textColor = computed(() => (isLeft.value ? v3SidebarMenuTextColor : undefined))
const activeTextColor = computed(() => (isLeft.value ? v3SidebarMenuActiveTextColor : undefined))
const sidebarMenuItemHeight = computed(() => {
  return !isTop.value ? 'var(--prefix-sidebar-menu-item-height)' : 'var(--prefix-navigationbar-height)'
})
const sidebarMenuHoverBgColor = computed(() => {
  return !isTop.value ? 'var(--prefix-sidebar-menu-hover-bg-color)' : 'transparent'
})
const tipLineWidth = computed(() => {
  return !isTop.value ? '2px' : '0px'
})
// Hide vertical scrollbar when in top mode
const hiddenScrollbarVerticalBar = computed(() => {
  return isTop.value ? 'none' : 'block'
})
</script>

<template>
  <div :class="{ 'has-logo': isLogo }">
    <Logo v-if="isLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" :class="{ 'is-collapse': isCollapse }">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse && !isTop"
        :background-color="backgroundColor"
        :text-color="textColor"
        :active-text-color="activeTextColor"
        :unique-opened="true"
        :collapse-transition="false"
        :mode="isTop && !isMobile ? 'horizontal' : 'vertical'"
      >
        <SidebarItem
          v-for="route in noHiddenRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.has-logo {
  .el-scrollbar {
    // The 1% increase is to prevent the 1px white line at the bottom of the sidebar from being displayed in left mode
    height: calc(101% - var(--prefix-header-height));
  }
}

.el-menu {
  border: none;
  min-height: 100%;
  width: 100% !important;
}

.el-menu--horizontal {
  height: v-bind(sidebarMenuItemHeight);
}
</style>

<style lang="scss">
%tip-line {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind(tipLineWidth);
    height: 100%;
    background-color: var(--prefix-sidebar-menu-tip-line-bg-color);
  }
}

.el-scrollbar {
  // 1% more is to prevent vertical scrolling in top mode
  height: 101%;
  .scrollbar-wrapper {
    // Limit horizontal width
    overflow-x: hidden !important;
    .el-scrollbar__view {
      height: 100%;
    }
  }
  // Scrollbars
  .el-scrollbar__bar {
    &.is-horizontal {
      // Hide horizontal scroll bar
      display: none;
    }
    &.is-vertical {
      // Hide vertical scrollbar when in top mode
      display: v-bind(hiddenScrollbarVerticalBar);
    }
  }
}

.el-menu-item,
.el-sub-menu__title,
.el-sub-menu .el-menu-item,
.el-menu--horizontal .el-menu-item {
  height: v-bind(sidebarMenuItemHeight);
  line-height: v-bind(sidebarMenuItemHeight);
  &.is-active,
  &:hover {
    background-color: v-bind(sidebarMenuHoverBgColor);
  }
}

.el-sub-menu {
  &.is-active {
    > .el-sub-menu__title {
      color: v-bind(activeTextColor) !important;
    }
  }
}

.el-menu-item.is-active {
  @extend %tip-line;
}

.el-menu--collapse {
  .el-sub-menu.is-active {
    .el-sub-menu__title {
      @extend %tip-line;
    }
  }
}

.is-collapse {
  .el-sub-menu__icon-arrow {
    display: none;
  }

  .svg-icon {
    font-size: 24px;
  }

  .el-menu-tooltip__trigger {
    padding-left: 16px;
  }

  .el-tooltip__trigger {
    padding-left: 16px;
  }
}
</style>

<script lang="ts" setup>
import { isExternal } from '@/utils/validate'
import path from 'path-browserify'
import { computed, ref } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
import SidebarItemLink from './SidebarItemLink.vue'
// import { useTheme } from '@/hooks/useTheme'
import { useAppStore } from '@/store/modules/app'

interface Props {
  item: RouteRecordRaw
  basePath?: string
  isCollapse?: boolean
  pathActive?: string
}

const props = withDefaults(defineProps<Props>(), {
  basePath: ''
})

const appStore = useAppStore()

/** Whether to always show the root menu */
const alwaysShowRootMenu = computed(() => props.item.meta?.alwaysShow)

/** Display submenu */
const showingChildren = computed(() => {
  return props.item.children?.filter((child) => !child.meta?.hidden) ?? []
})

/** Number of submenus to display */
const showingChildNumber = computed(() => {
  return showingChildren.value.length
})

/** The only submenu item */
const theOnlyOneChild = computed(() => {
  const number = showingChildNumber.value
  switch (true) {
    case number > 1:
      return null
    case number === 1:
      return showingChildren.value[0]
    default:
      return { ...props.item, path: '' }
  }
})

/** Parsing Path */
const resolvePath = (routePath: string) => {
  switch (true) {
    case isExternal(routePath):
      return routePath
    case isExternal(props.basePath):
      return props.basePath
    default:
      return path.resolve(props.basePath, routePath)
  }
}

const hover = ref<boolean>(false)

const handleMouseOver = () => {
  hover.value = true
}

const handleMouseOut = () => {
  hover.value = false
}

// const { activeThemeName } = useTheme()
</script>

<template>
  <!-- <div class="shadow-sm shadow-[#3784a9]" :class="{ 'sidebar-item': activeThemeName !== 'dark' }"> -->
  <div class="sidebar-item">
    <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
      <SidebarItemLink v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
        >
          <SvgIcon
            v-if="theOnlyOneChild.meta.svgIcon"
            :name="
              hover || resolvePath(theOnlyOneChild?.path ?? '') === pathActive
                ? theOnlyOneChild.meta.svgIcon + '-active'
                : theOnlyOneChild.meta.svgIcon
            "
            class="!w-6 !h-6 sidebar-item-svg"
          />
          <component v-else-if="theOnlyOneChild.meta.elIcon" :is="theOnlyOneChild.meta.elIcon" class="el-icon" />
          <template v-if="theOnlyOneChild.meta.title" #title>
            {{ $t('router.' + theOnlyOneChild.meta.title) }}
          </template>
        </el-menu-item>
      </SidebarItemLink>
    </template>
    <el-sub-menu v-else :index="resolvePath(props.item.path)" teleported>
      <template #title>
        <div class="flex flex-row items-center" @mouseover="handleMouseOver" @mouseout="handleMouseOut">
          <SvgIcon
            v-if="props.item.meta?.svgIcon"
            :name="
              hover || resolvePath(theOnlyOneChild?.path ?? '') === pathActive
                ? props.item.meta.svgIcon + '-active'
                : props.item.meta.svgIcon
            "
            class="!w-6 !h-6 sidebar-item-svg"
          />
          <component v-else-if="props.item.meta?.elIcon" :is="props.item.meta.elIcon" class="el-icon" />
          <span v-if="props.item.meta?.title && !isCollapse">{{ $t('router.' + props.item.meta.title) }}</span>
        </div>
      </template>
      <div
        v-if="props.item.children"
        class="relative sidebar-sub-item"
        :class="{ 'active-sidebar': appStore.sidebar.opened }"
      >
        <SidebarItem
          v-for="child in showingChildren"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(child.path)"
        />
        <div v-if="appStore.sidebar.opened" class="h-full w-1 absolute top-0 left-7 rounded-sm bg-white" />
      </div>
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  font-size: 24px;
}

.el-icon {
  width: 1em !important;
  margin-right: 12px !important;
  font-size: 24px;
}

.el-menu-item.is-active,
.el-menu-item:hover {
  background-color: #e7f5ff !important;
  color: var(--el-color-primary);
}

.el-menu-item {
  color: #ffffff;
  font-weight: 500;
  min-height: 56px;
  border-radius: 8px;
}

// .el-menu-item[role='menuitem']:not(:has(.svg-icon)) {
//   padding-left: 56px !important;
// }

.sidebar-item {
  background-color: var(--el-menu-bg-color);
}
</style>

<style lang="scss">
.el-sub-menu__title {
  color: #ffffff;
  font-weight: 500;
  border-radius: 8px;
}

.el-menu .el-sub-menu .el-sub-menu__title:hover {
  background-color: #e7f5ff !important;
  color: var(--el-color-primary) !important;
}

.sidebar-sub-item.active-sidebar {
  .sidebar-item {
    padding-left: 40px;

    .el-menu-item {
      padding-left: 20px !important;
    }
  }
}
</style>

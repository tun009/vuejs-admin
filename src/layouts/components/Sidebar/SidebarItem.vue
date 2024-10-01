<script lang="ts" setup>
import { isExternal } from '@/utils/validate'
import path from 'path-browserify'
import { computed } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
import SidebarItemLink from './SidebarItemLink.vue'

interface Props {
  item: RouteRecordRaw
  basePath?: string
  isCollapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  basePath: ''
})

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
</script>

<template>
  <div class="shadow-sm shadow-[#3784a9]">
    <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
      <SidebarItemLink v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
        <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
          <SvgIcon v-if="theOnlyOneChild.meta.svgIcon" :name="theOnlyOneChild.meta.svgIcon" class="!w-6 !h-6" />
          <component v-else-if="theOnlyOneChild.meta.elIcon" :is="theOnlyOneChild.meta.elIcon" class="el-icon" />
          <template v-if="theOnlyOneChild.meta.title" #title>
            {{ $t('router.' + theOnlyOneChild.meta.title) }}
          </template>
        </el-menu-item>
      </SidebarItemLink>
    </template>
    <el-sub-menu v-else :index="resolvePath(props.item.path)" teleported>
      <template #title>
        <SvgIcon v-if="props.item.meta?.svgIcon" :name="props.item.meta.svgIcon" class="!w-6 !h-6" />
        <component v-else-if="props.item.meta?.elIcon" :is="props.item.meta.elIcon" class="el-icon" />
        <span v-if="props.item.meta?.title && !isCollapse">{{ $t('router.' + props.item.meta.title) }}</span>
      </template>
      <template v-if="props.item.children">
        <SidebarItem
          v-for="child in showingChildren"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(child.path)"
        />
      </template>
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
.el-menu-item:hover,
:deep(.el-sub-menu__title:hover) {
  background-color: #4192cd !important;
}

.el-menu-item,
:deep(.el-sub-menu__title) {
  color: #ffffff;
  font-weight: 500;
}
</style>

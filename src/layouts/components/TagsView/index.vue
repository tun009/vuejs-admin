<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { type RouteLocationNormalizedLoaded, type RouteRecordRaw, RouterLink, useRoute, useRouter } from 'vue-router'
import path from 'path-browserify'
import { Close } from '@element-plus/icons-vue'

import ScrollPane from './ScrollPane.vue'

import { type TagView, useTagsViewStore } from '@/store/modules/tags-view'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouteListener } from '@/hooks/useRouteListener'

const instance = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const { listenerRouteChange } = useRouteListener()

/** An array of references to tab component elements */
const tagRefs = ref<InstanceType<typeof RouterLink>[]>([])

/** Status of the right-click menu */
const visible = ref(false)
/** Top position of right-click menu */
const top = ref(0)
/** The left position of the right-click menu */
const left = ref(0)
/** The tab currently being right-clicked */
const selectedTag = ref<TagView>({})
/** Pinned tabs */
let affixTags: TagView[] = []

/** Check if the tab is active */
const isActive = (tag: TagView) => {
  return tag.path === route.path
}

/** Check if the tab is fixed */
const isAffix = (tag: TagView) => {
  return tag.meta?.affix
}

/** Filter out pinned tabs */
const filterAffixTags = (routes: RouteRecordRaw[], basePath = '/') => {
  const tags: TagView[] = []
  routes.forEach((route) => {
    if (isAffix(route)) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        meta: { ...route.meta },
        name: route.name,
        path: tagPath
      })
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path)
      tags.push(...childTags)
    }
  })
  return tags
}

/** Initialize the tab page */
const initTags = () => {
  affixTags = filterAffixTags(permissionStore.routes)
  for (const tag of affixTags) {
    // Must contain the name attribute
    tag.name && tagsViewStore.addVisitedView(tag)
  }
}

/** Add a tab page */
const addTags = (route: RouteLocationNormalizedLoaded) => {
  if (route.name) {
    tagsViewStore.addVisitedView(route)
    tagsViewStore.addCachedView(route)
  }
}

/** Refresh the tab page currently being right-clicked */
const refreshSelectedTag = (view: TagView) => {
  tagsViewStore.delCachedView(view)
  router.replace({ path: '/redirect' + view.path, query: view.query })
}

/** Close the tab currently being right-clicked */
const closeSelectedTag = (view: TagView) => {
  tagsViewStore.delVisitedView(view)
  tagsViewStore.delCachedView(view)
  isActive(view) && toLastView(tagsViewStore.visitedViews, view)
}

/** Close other tabs */
const closeOthersTags = () => {
  const fullPath = selectedTag.value.fullPath
  if (fullPath !== route.path && fullPath !== undefined) {
    router.push(fullPath)
  }
  tagsViewStore.delOthersVisitedViews(selectedTag.value)
  tagsViewStore.delOthersCachedViews(selectedTag.value)
}

/** Close all tabs */
const closeAllTags = (view: TagView) => {
  tagsViewStore.delAllVisitedViews()
  tagsViewStore.delAllCachedViews()
  if (affixTags.some((tag) => tag.path === route.path)) return
  toLastView(tagsViewStore.visitedViews, view)
}

/** Jump to the last tab */
const toLastView = (visitedViews: TagView[], view: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  const fullPath = latestView?.fullPath
  if (fullPath !== undefined) {
    router.push(fullPath)
  } else {
    // If all TagsViews are closed, redirect to the home page by default
    if (view.name === 'Dashboard') {
      // Reload the home page
      router.push({ path: '/redirect' + view.path, query: view.query })
    } else {
      router.push('/')
    }
  }
}

/** Open the right-click menu panel */
const openMenu = (tag: TagView, e: MouseEvent) => {
  const menuMinWidth = 105
  // The distance between the current component and the left end of the browser
  const offsetLeft = instance!.proxy!.$el.getBoundingClientRect().left
  // Current component width
  const offsetWidth = instance!.proxy!.$el.offsetWidth
  // Maximum left margin of the panel
  const maxLeft = offsetWidth - menuMinWidth
  // The distance between the panel and the mouse pointer
  const left15 = e.clientX - offsetLeft + 15
  left.value = left15 > maxLeft ? maxLeft : left15
  top.value = e.clientY
  // Display panel
  visible.value = true
  // Update the tab currently being right-clicked
  selectedTag.value = tag
}

/** Close the right-click menu panel */
const closeMenu = () => {
  visible.value = false
}

watch(visible, (value) => {
  value ? document.body.addEventListener('click', closeMenu) : document.body.removeEventListener('click', closeMenu)
})

onMounted(() => {
  initTags()
  /** Listening for route changes */
  listenerRouteChange(async (route) => {
    addTags(route)
  }, true)
})
</script>

<template>
  <div class="tags-view-container">
    <ScrollPane class="tags-view-wrapper" :tag-refs="tagRefs">
      <router-link
        ref="tagRefs"
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :class="{ active: isActive(tag) }"
        class="tags-view-item"
        :to="{ path: tag.path, query: tag.query }"
        @click.middle="!isAffix(tag) && closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ $t('router.' + tag.meta?.title) }}
        <el-icon v-if="!isAffix(tag)" :size="12" @click.prevent.stop="closeSelectedTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </ScrollPane>
    <ul v-show="visible" class="contextmenu" :style="{ left: left + 'px', top: top + 'px' }">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close other</li>
      <li @click="closeAllTags(selectedTag)">Close all</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: var(--prefix-tagsview-height);
  width: 100%;
  color: var(--prefix-tagsview-text-color);
  overflow: hidden;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid var(--prefix-tagsview-tag-border-color);
      border-radius: var(--prefix-tagsview-tag-border-radius);
      background-color: var(--prefix-tagsview-tag-bg-color);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 5px;
      }
      &:last-of-type {
        margin-right: 5px;
      }
      &.active {
        background-color: var(--prefix-tagsview-tag-active-bg-color);
        color: var(--prefix-tagsview-tag-active-text-color);
        border-color: var(--prefix-tagsview-tag-active-border-color);
      }
      .el-icon {
        margin: 0 2px;
        vertical-align: middle;
        border-radius: 50%;
        &:hover {
          background-color: var(--prefix-tagsview-tag-icon-hover-bg-color);
          color: var(--prefix-tagsview-tag-icon-hover-color);
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    color: var(--prefix-tagsview-contextmenu-text-color);
    background-color: var(--prefix-tagsview-contextmenu-bg-color);
    box-shadow: var(--prefix-tagsview-contextmenu-box-shadow);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        color: var(--prefix-tagsview-contextmenu-hover-text-color);
        background-color: var(--prefix-tagsview-contextmenu-hover-bg-color);
      }
    }
  }
}
</style>

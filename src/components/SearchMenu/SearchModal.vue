<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue'
import { type RouteRecordName, type RouteRecordRaw, useRouter } from 'vue-router'
import { ElMessage, ElScrollbar } from 'element-plus'
import { cloneDeep, debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

import SearchResult from './SearchResult.vue'
import SearchFooter from './SearchFooter.vue'

import { usePermissionStore } from '@/store/modules/permission'
import { useDevice } from '@/hooks/useDevice'
import { isExternal } from '@/utils/validate'
import { removeAccents } from '@/utils'

/** Control modal visibility */
const modelValue = defineModel<boolean>({ required: true })
const { t } = useI18n()
const router = useRouter()
const { isMobile } = useDevice()

const inputRef = ref<HTMLInputElement | null>(null)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null)
const searchResultRef = ref<InstanceType<typeof SearchResult> | null>(null)

const keyword = ref<string>('')
const resultList = shallowRef<RouteRecordRaw[]>([])
const activeRouteName = ref<RouteRecordName | undefined>(undefined)
/** Whether the up or down key is pressed (used to resolve conflicts with the mouseenter event) */
const isPressUpOrDown = ref<boolean>(false)

/** Control the width of the search dialog */
const modalWidth = computed(() => (isMobile.value ? '80vw' : '40vw'))
/** Tree menu */
const menusData = computed(() => cloneDeep(usePermissionStore().routes))

/** Search (Anti-shake) */
const handleSearch = debounce(() => {
  const flatMenusData = flatTree(menusData.value)
  resultList.value = flatMenusData.filter((menu) =>
    keyword.value
      ? (menu.meta?.title ? removeAccents(t('router.' + menu.meta?.title)) : '')
          ?.toLocaleLowerCase()
          .includes(removeAccents(keyword.value.toLocaleLowerCase().trim()))
      : false
  )
  // The first search result is selected by default
  const length = resultList.value?.length
  activeRouteName.value = length > 0 ? resultList.value[0].name : undefined
}, 500)

/** Flatten the tree menu into a one-dimensional array for menu search */
const flatTree = (arr: RouteRecordRaw[], result: RouteRecordRaw[] = []) => {
  arr.forEach((item) => {
    result.push(item)
    item.children && flatTree(item.children, result)
  })
  return result
}

/** Close the search dialog */
const handleClose = () => {
  modelValue.value = false
  // Delay processing prevents users from seeing the operation of resetting data
  setTimeout(() => {
    keyword.value = ''
    resultList.value = []
  }, 200)
}

/** Scroll according to the subscript position */
const scrollTo = (index: number) => {
  if (!searchResultRef.value) return
  const scrollTop = searchResultRef.value.getScrollTop(index)
  // Manually control the scroll bar scrolling of el-scrollbar and set the distance from the scroll bar to the top
  scrollbarRef.value?.setScrollTop(scrollTop)
}

/** Keyboard key */
const handleUp = () => {
  isPressUpOrDown.value = true
  const { length } = resultList.value
  if (length === 0) return
  // Get the position of the first occurrence of the name in the menu
  const index = resultList.value.findIndex((item) => item.name === activeRouteName.value)
  // If you are at the top
  if (index === 0) {
    const bottomName = resultList.value[length - 1].name
    // If the bottomName of the top and bottom are the same and the length is greater than 1, jump one position (this can solve the problem that the up key does not work when the first and last names are the same)
    if (activeRouteName.value === bottomName && length > 1) {
      activeRouteName.value = resultList.value[length - 2].name
      scrollTo(length - 2)
    } else {
      // Jump to bottom
      activeRouteName.value = bottomName
      scrollTo(length - 1)
    }
  } else {
    activeRouteName.value = resultList.value[index - 1].name
    scrollTo(index - 1)
  }
}

/** Keyboard down key */
const handleDown = () => {
  isPressUpOrDown.value = true
  const { length } = resultList.value
  if (length === 0) return
  // Get the position of the last occurrence of the name in the menu (this can solve the problem of the key not working when there are two consecutive identical names)
  const index = resultList.value.map((item) => item.name).lastIndexOf(activeRouteName.value)
  // If you are at the bottom
  if (index === length - 1) {
    const topName = resultList.value[0].name
    // If the topName of the bottom and top are the same and the length is greater than 1, jump one position (this can solve the problem that the down key cannot take effect when the first and last two names are the same)
    if (activeRouteName.value === topName && length > 1) {
      activeRouteName.value = resultList.value[1].name
      scrollTo(1)
    } else {
      // Jump to top
      activeRouteName.value = topName
      scrollTo(0)
    }
  } else {
    activeRouteName.value = resultList.value[index + 1].name
    scrollTo(index + 1)
  }
}

/** Keyboard Enter key */
const handleEnter = () => {
  const { length } = resultList.value
  if (length === 0) return
  const name = activeRouteName.value
  const path = resultList.value.find((item) => item.name === name)?.path
  if (path && isExternal(path)) {
    window.open(path, '_blank', 'noopener, noreferrer')
    return
  }
  if (!name) {
    ElMessage.warning('Unable to enter this menu through search, please set a unique Name for the corresponding route')
    return
  }
  try {
    router.push({ name })
  } catch {
    ElMessage.error('This menu has required dynamic parameters and cannot be entered through search')
    return
  }
  handleClose()
}

/** Release the up or down button */
const handleReleaseUpOrDown = () => {
  isPressUpOrDown.value = false
}
</script>

<template>
  <el-dialog
    v-model="modelValue"
    @opened="inputRef?.focus()"
    @closed="inputRef?.blur()"
    @keydown.up="handleUp"
    @keydown.down="handleDown"
    @keydown.enter="handleEnter"
    @keyup.up.down="handleReleaseUpOrDown"
    :before-close="handleClose"
    :width="modalWidth"
    top="5vh"
    class="search-modal__private"
    append-to-body
  >
    <el-input
      ref="inputRef"
      v-model="keyword"
      @input="handleSearch"
      :placeholder="$t('layouts.search.title')"
      size="large"
      clearable
    >
      <template #prefix>
        <SvgIcon name="search" />
      </template>
    </el-input>
    <el-empty v-if="resultList.length === 0" :description="$t('layouts.search.noResults')" :image-size="100" />
    <template v-else>
      <p class="mt-2">{{ $t('layouts.search.searchResults') }}</p>
      <el-scrollbar ref="scrollbarRef" max-height="40vh" always>
        <SearchResult
          ref="searchResultRef"
          v-model="activeRouteName"
          :list="resultList"
          :isPressUpOrDown="isPressUpOrDown"
          @click="handleEnter"
        />
      </el-scrollbar>
    </template>
    <template #footer>
      <SearchFooter :total="resultList.length" />
    </template>
  </el-dialog>
</template>

<style lang="scss">
.search-modal__private {
  .svg-icon {
    font-size: 18px;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__footer {
    border-top: 1px solid var(--el-border-color);
    padding: var(--el-dialog-padding-primary);
  }
}
</style>

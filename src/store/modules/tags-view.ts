import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'
import { type RouteLocationNormalized } from 'vue-router'
import { getVisitedViews, setVisitedViews, getCachedViews, setCachedViews } from '@/utils/cache/local-storage'

export type TagView = Partial<RouteLocationNormalized>

export const useTagsViewStore = defineStore('tags-view', () => {
  const { cacheTagsView } = useSettingsStore()
  const visitedViews = ref<TagView[]>(cacheTagsView ? getVisitedViews() : [])
  const cachedViews = ref<string[]>(cacheTagsView ? getCachedViews() : [])

  // Cache tab bar data
  watchEffect(() => {
    setVisitedViews(visitedViews.value)
    setCachedViews(cachedViews.value)
  })

  //#region Add Views
  const addVisitedView = (view: TagView) => {
    const index = findViewIndex(visitedViews.value, view.path as string)
    if (index !== -1) {
      updateVisitedView(index, view)
    } else {
      visitedViews.value.push({ ...view })
    }
  }

  const addCachedView = (view: TagView) => {
    if (isValidCachedView(view)) {
      cachedViews.value.push(view.name as string)
    }
  }

  const isValidCachedView = (view: TagView) => {
    return typeof view.name === 'string' && !cachedViews.value.includes(view.name) && view.meta?.keepAlive
  }

  const updateVisitedView = (index: number, view: TagView) => {
    if (visitedViews.value[index].fullPath !== view.fullPath) {
      visitedViews.value[index] = { ...view }
    }
  }

  const findViewIndex = (views: TagView[], path: string) => {
    return views.findIndex((v) => v.path === path)
  }
  //#endregion

  //#region Delete Views
  const delVisitedView = (view: TagView) => {
    deleteView(visitedViews.value, view.path as string)
  }

  const delCachedView = (view: TagView) => {
    if (typeof view.name === 'string') {
      deleteView(cachedViews.value, view.name)
    }
  }

  const deleteView = (views: Array<any>, identifier: string) => {
    const index = views.indexOf(identifier)
    if (index !== -1) views.splice(index, 1)
  }
  //#endregion

  //#region Delete Others
  const delOthersVisitedViews = (view: TagView) => {
    visitedViews.value = visitedViews.value.filter((v) => v.meta?.affix || v.path === view.path)
  }

  const delOthersCachedViews = (view: TagView) => {
    if (typeof view.name === 'string') {
      cachedViews.value = cachedViews.value.includes(view.name) ? [view.name] : []
    }
  }
  //#endregion

  //#region Delete All
  const delAllVisitedViews = () => {
    visitedViews.value = visitedViews.value.filter((tag) => tag.meta?.affix)
  }

  const delAllCachedViews = () => {
    cachedViews.value = []
  }
  //#endregion

  return {
    visitedViews,
    cachedViews,
    addVisitedView,
    addCachedView,
    delVisitedView,
    delCachedView,
    delOthersVisitedViews,
    delOthersCachedViews,
    delAllVisitedViews,
    delAllCachedViews
  }
})

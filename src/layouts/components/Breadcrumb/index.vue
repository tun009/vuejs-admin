<script lang="ts" setup>
import { ref } from 'vue'
import { type RouteLocationMatched, useRoute, useRouter } from 'vue-router'
import { useRouteListener } from '@/hooks/useRouteListener'
import { compile } from 'path-to-regexp'

const route = useRoute()
const router = useRouter()
const { listenerRouteChange } = useRouteListener()

/** Define responsive data breadcrumbs to store breadcrumb navigation information */
const breadcrumbs = ref<RouteLocationMatched[]>([])

/** Get breadcrumb navigation information */
const getBreadcrumb = () => {
  breadcrumbs.value = route.matched.filter((item) => item.meta?.title && item.meta?.breadcrumb !== false)
}

/** Compile route path */
const pathCompile = (path: string) => {
  const toPath = compile(path)
  return toPath(route.params)
}

/** Handle breadcrumb navigation click event */
const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect as string)
    return
  }
  router.push(pathCompile(path))
}

/** Listen for route changes and update breadcrumb navigation information */
listenerRouteChange((route) => {
  if (route.path.startsWith('/redirect/')) return
  getBreadcrumb()
}, true)
</script>

<template>
  <el-breadcrumb>
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <span v-if="item.redirect === 'noRedirect' || index === breadcrumbs.length - 1" class="no-redirect">
        {{ $t('router.' + item.meta.title) }}
      </span>
      <a v-else @click.prevent="handleLink(item)">
        {{ $t('router.' + item.meta.title) }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.el-breadcrumb {
  line-height: var(--prefix-navigationbar-height);
  .no-redirect {
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
  a {
    font-weight: normal;
    opacity: 0.8;
  }
}
</style>

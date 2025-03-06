<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { UserFilled } from '@element-plus/icons-vue'
import Breadcrumb from '../Breadcrumb/index.vue'
import Sidebar from '../Sidebar/index.vue'
import Notify from '@/components/Notify/index.vue'
import ThemeSwitch from '@/components/ThemeSwitch/index.vue'
import LanguageSwitch from '@/components/LanguageSwitch/index.vue'
import { useDevice } from '@/hooks/useDevice'
import { useLayoutMode } from '@/hooks/useLayoutMode'
import { PROFILE_PAGE } from '@/constants/router'
import { truncateString } from '@/utils/common'

const { isMobile } = useDevice()
const { isTop } = useLayoutMode()
const router = useRouter()
const userStore = useUserStore()

/** Sign out */
const logout = () => {
  userStore.logout()
}

/** Profile */
const goToProfile = () => {
  router.push(PROFILE_PAGE)
}
</script>

<template>
  <div class="navigation-bar">
    <Breadcrumb v-if="!isTop || isMobile" class="breadcrumb" />
    <Sidebar v-if="isTop && !isMobile" class="sidebar" />
    <div class="right-menu">
      <ThemeSwitch class="right-menu-item" />
      <LanguageSwitch class="right-menu-item" />
      <Notify class="right-menu-item" />
      <el-dropdown class="right-menu-item">
        <div class="right-menu-avatar">
          <el-avatar :icon="UserFilled" :size="30" />
          <span>{{ truncateString(userStore.userInfo.name) }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goToProfile" class="flex flex-row gap-2 items-center">
              <SvgIcon name="user-profile" class-name="!w-5 !h-5" />
              <span>{{ $t('layouts.navigation.profile') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout" class="flex flex-row gap-2 items-center">
              <SvgIcon name="sign-out" class-name="!w-5 !h-5" />
              <span style="display: block">{{ $t('layouts.navigation.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.navigation-bar {
  padding: 6px 20px;
  // height: var(--prefix-navigationbar-height);
  align-items: center;
  overflow: hidden;
  color: var(--prefix-navigationbar-text-color);
  display: flex;
  justify-content: space-between;
  .hamburger {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 15px;
    cursor: pointer;
  }
  .breadcrumb {
    flex: 1;
    @media screen and (max-width: 576px) {
      display: none;
    }
  }
  .sidebar {
    flex: 1;
    min-width: 0px;
    :deep(.el-menu) {
      background-color: transparent;
      // background-color: var(--el-menu-bg-color);
    }
    :deep(.el-sub-menu) {
      &.is-active {
        .el-sub-menu__title {
          color: var(--el-color-primary) !important;
        }
      }
    }
  }
  .right-menu {
    margin-right: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    .right-menu-item {
      padding: 0 10px;
      cursor: pointer;
      .right-menu-avatar {
        display: flex;
        align-items: center;
        .el-avatar {
          margin-right: 10px;
        }
        span {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.navigation-bar {
  .el-badge {
    display: flex;
  }
  .sidebar {
    flex: 1;
    min-width: 0px;
    .el-menu {
      background-color: transparent;
      // background-color: var(--el-menu-bg-color);
    }
    .el-sub-menu {
      &.is-active {
        .el-sub-menu__title {
          color: var(--el-color-primary) !important;
        }
      }
    }
  }
}
</style>

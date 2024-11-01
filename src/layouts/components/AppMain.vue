<script lang="ts" setup>
// import { useSettingsStore } from '@/store/modules/settings'
// import Footer from './Footer/index.vue'

// const settingsStore = useSettingsStore()
</script>

<template>
  <section class="app-main bg-[#f8f9fa] dark:bg-[#141414]">
    <div class="app-scrollbar">
      <!-- Using route.path and route.fullPath as key has different effects, path is more general in most cases -->
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
      <!-- Footer -->
    </div>
    <!-- Return to top -->
    <el-backtop />
    <!-- Return to the top (fixed Header) -->
    <el-backtop target=".app-scrollbar" />
  </section>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.app-main {
  width: 100%;
  display: flex;
  padding: 0 20px;
}

.app-scrollbar {
  flex-grow: 1;
  overflow: auto;
  padding-top: 20px;
  padding-right: 20px;
  @extend %scrollbar;
  display: flex;
  flex-direction: column;
  .app-container-grow {
    flex-grow: 1;
  }
}
</style>

<template>
  <div class="app-container">
    <h4>
      The third-level and above routing cache function is disabled by default. If you need it, please go to this
      configuration file to turn it on:
      <el-link
        type="primary"
        href="https://github.com/un-pany/v3-admin-vite/blob/main/src/config/route.ts"
        target="_blank"
      >
        src/config/route.ts
      </el-link>
    </h4>
    <el-card header="Secondary Routing - menu1">
      <router-view />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-link {
  font-size: 18px;
}
</style>

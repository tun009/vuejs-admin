<script lang="ts" setup>
import { checkPermission } from '@/utils/permission'
import SwitchRoles from './components/SwitchRoles.vue'
</script>

<template>
  <div class="app-container">
    <SwitchRoles />
    <!-- v-permission example -->
    <div class="margin-top-30">
      <div>
        <el-tag v-permission="['admin']" type="success" size="large" effect="plain">
          v-permission="['admin']" is used here, so only admin can see this sentence
        </el-tag>
      </div>
      <div>
        <el-tag v-permission="['editor']" type="success" size="large" effect="plain">
          v-permission="['editor']" is used here, so only editor can see this sentence
        </el-tag>
      </div>
      <div class="margin-top-15">
        <el-tag v-permission="['admin', 'editor']" type="success" size="large" effect="plain">
          v-permission="['admin', 'editor']" so both admin and editor can see this sentence
        </el-tag>
      </div>
    </div>
    <!-- checkPermission Example -->
    <div class="margin-top-30">
      <el-tag type="warning" size="large">
        For example, Element Plus's el-tab-pane or el-table-column and other scenarios with dynamic rendering of Dom are
        not suitable for using v-permission. In this case, you can use v-if and checkPermission to achieve it:
      </el-tag>
      <el-tabs type="border-card" class="margin-top-15">
        <el-tab-pane v-if="checkPermission(['admin'])" label="admin">
          Here, <el-tag>v-if="checkPermission(['admin'])"</el-tag> is used, so only admin can see this sentence
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['editor'])" label="editor">
          Here, <el-tag>v-if="checkPermission(['editor'])"</el-tag> is used, so only the editor can see this sentence
        </el-tab-pane>
        <el-tab-pane v-if="checkPermission(['admin', 'editor'])" label="admin 和 editor">
          Here, <el-tag>v-if="checkPermission(['admin', 'editor'])"</el-tag> is used, so both admin and editor can see
          this sentence
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.margin-top-15 {
  margin-top: 15px;
}

.margin-top-30 {
  margin-top: 30px;
}
</style>

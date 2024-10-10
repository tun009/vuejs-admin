<script lang="ts" setup>
import Admin from './components/Admin.vue'
import Editor from './components/Editor.vue'

import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const isAdmin = userStore.roles.includes('admin')
</script>

<template>
  <component :is="isAdmin ? Admin : Editor" />
</template>

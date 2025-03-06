<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'vi' ? 'en' : 'vi'
}
</script>

<template>
  <button
    @click="toggleLanguage"
    class="flex items-center space-x-1 px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
  >
    <span class="text-sm font-medium">{{ locale.toUpperCase() }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isMenuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial scroll position
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[isScrolled ? 'bg-white/80 shadow-lg py-1 backdrop-blur-md' : 'bg-white/60 backdrop-blur-sm py-2']"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-14">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-xl font-bold text-primary transition-all duration-300" :class="{ 'scale-95': isScrolled }">
              LicenseKey
            </h1>
          </div>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex md:items-center md:space-x-6">
          <a href="#features" class="text-gray-700 hover:text-primary transition-colors duration-200">Tính năng</a>
          <a href="#pricing" class="text-gray-700 hover:text-primary transition-colors duration-200">Sản phẩm</a>
          <a href="#contact" class="text-gray-700 hover:text-primary transition-colors duration-200">Liên hệ</a>
          <button class="btn-primary transform hover:scale-105 transition-transform duration-200">Mua ngay</button>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary transition-colors duration-200"
          >
            <Bars3Icon v-if="!isMenuOpen" class="h-5 w-5" />
            <XMarkIcon v-else class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="isMenuOpen"
      class="md:hidden bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out"
    >
      <div class="pt-2 pb-3 space-y-1">
        <a
          href="#features"
          class="block px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-200"
          @click="isMenuOpen = false"
          >Tính năng</a
        >
        <a
          href="#pricing"
          class="block px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-200"
          @click="isMenuOpen = false"
          >Sản phẩm</a
        >
        <a
          href="#contact"
          class="block px-3 py-2 text-gray-700 hover:text-primary transition-colors duration-200"
          @click="isMenuOpen = false"
          >Liên hệ</a
        >
        <div class="px-3 py-2">
          <button class="btn-primary w-full transform hover:scale-105 transition-transform duration-200">
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  </nav>
  <!-- Spacer to prevent content from being hidden under the fixed navbar -->
  <div class="h-16" />
</template>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>

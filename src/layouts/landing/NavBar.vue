<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isMenuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  // Chỉ xác định trạng thái đã cuộn để thay đổi giao diện navbar
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md"
    :class="[isScrolled ? 'bg-white/90 shadow-md py-2' : 'bg-white/80 py-4']"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-primary transition-all duration-300" :class="{ 'scale-90': isScrolled }">
              LicenseKey
            </h1>
          </div>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex md:items-center md:space-x-6">
          <a href="#features" class="text-gray-700 hover:text-primary transition-colors duration-200">Tính năng</a>
          <a href="#pricing" class="text-gray-700 hover:text-primary transition-colors duration-200">Sản phẩm</a>
          <a href="#contact" class="text-gray-700 hover:text-primary transition-colors duration-200">Liên hệ</a>
          <button @click="$router.push('/login')" class="btn-primary transition-transform duration-200 hover:scale-105">
            Đăng nhập
          </button>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary transition-colors duration-200"
          >
            <Bars3Icon v-if="!isMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="isMenuOpen"
      class="md:hidden bg-white/95 shadow-lg transition-all duration-300 max-h-screen backdrop-blur-sm"
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
          <button
            @click="$router.push('/login')"
            class="btn-primary w-full transition-transform duration-200 hover:scale-105"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Spacer để tránh nội dung bị che khi navbar fixed -->
  <div class="h-24" />

  <!-- Gradient overlay cho phần nội dung bên dưới navbar -->
  <div class="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-40" />
</template>

<style scoped>
.backdrop-blur-md {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>

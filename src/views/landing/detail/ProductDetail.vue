<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/layouts/landing/NavBar.vue'
import Footer from '@/layouts/landing/Footer.vue'
import PricingModal from '@/layouts/landing/PricingModal.vue'
import { LANDING_PAGE } from '@/constants/router'

const route = useRoute()
const router = useRouter()
const isModalOpen = ref(false)

const goBack = () => {
  router.push(LANDING_PAGE)
}

const product = {
  id: route.params.id,
  name: 'Windows 11 Pro',
  description:
    'Windows 11 Pro là phiên bản cao cấp của Windows 11, cung cấp các tính năng bảo mật và quản lý nâng cao cho doanh nghiệp và người dùng chuyên nghiệp.',
  detailHtml: `
    <h2>Giới thiệu Windows 11 Pro</h2>
    <p>Windows 11 Pro là phiên bản mới nhất của hệ điều hành Windows, được thiết kế đặc biệt cho người dùng chuyên nghiệp và doanh nghiệp. Với giao diện người dùng được thiết kế lại hoàn toàn, Windows 11 Pro mang đến trải nghiệm hiện đại và liền mạch hơn bao giờ hết.</p>

    <h3>Tính năng nổi bật</h3>
    <ul>
      <li>Giao diện người dùng được thiết kế lại hoàn toàn</li>
      <li>Tính năng bảo mật nâng cao với Windows Hello</li>
      <li>Hỗ trợ ảo hóa với Hyper-V</li>
      <li>BitLocker để mã hóa ổ đĩa</li>
      <li>Windows Defender Antivirus tích hợp</li>
    </ul>

    <h3>Lợi ích cho doanh nghiệp</h3>
    <p>Windows 11 Pro cung cấp các công cụ mạnh mẽ giúp doanh nghiệp của bạn vận hành hiệu quả và an toàn hơn. Từ khả năng quản lý thiết bị từ xa đến các tính năng bảo mật nâng cao, Windows 11 Pro là lựa chọn hoàn hảo cho môi trường doanh nghiệp.</p>
  `,
  image: 'https://dn720002.ca.archive.org/0/items/windows-11-pro-x-64-preactivated/Windows_11_Pro.jpg',
  downloads: 15234,
  rating: 4.8,
  totalReviews: 1250,
  keywords: ['Windows 11', 'Microsoft', 'Hệ điều hành', 'Bản quyền', 'Key kích hoạt']
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num)
}
const reviews = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    rating: 5,
    comment: 'Sản phẩm rất tốt, hỗ trợ nhiệt tình',
    date: '15/03/2024',
    points: '4.9/5'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    rating: 4,
    comment: 'Dễ sử dụng, tiện lợi',
    date: '14/03/2024',
    points: '4.8/5'
  }
]
</script>

<template>
  <div class="min-h-screen bg-white">
    <NavBar />

    <main class="py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <button @click="goBack" class="flex items-center text-primary hover:text-secondary transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <img :src="product.image" :alt="product.name" class="w-full rounded-lg shadow-lg" />
          </div>
          <div>
            <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>

            <div class="flex items-center space-x-6 mb-6">
              <div class="flex items-center">
                <div class="flex text-yellow-400 mr-2">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <span class="ml-1 font-semibold text-lg">{{ product.rating }}</span>
                </div>
                <span class="text-gray-500">({{ formatNumber(product.totalReviews) }} đánh giá)</span>
              </div>
              <div class="flex items-center text-gray-500">
                <svg class="h-6 w-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span class="text-lg">{{ formatNumber(product.downloads) }} lượt tải</span>
              </div>
            </div>

            <p class="text-gray-600 mb-6">{{ product.description }}</p>

            <button @click="isModalOpen = true" class="btn-primary w-full mb-6">Xem Các Gói</button>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">Từ khóa:</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="keyword in product.keywords"
                  :key="keyword"
                  class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="prose max-w-none" v-html="product.detailHtml" />

        <div class="mt-12">
          <h2 class="text-2xl font-bold mb-6">Đánh Giá từ Khách Hàng</h2>
          <div class="space-y-6">
            <div v-for="review in reviews" :key="review.id" class="bg-gray-50 p-6 rounded-lg">
              <div class="flex items-start space-x-4">
                <img :src="review.avatar" :alt="review.name" class="w-12 h-12 rounded-full" />
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h4 class="font-semibold">{{ review.name }}</h4>
                      <div class="flex items-center space-x-2">
                        <div class="flex text-yellow-400">
                          <svg
                            v-for="i in review.rating"
                            :key="i"
                            class="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            />
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-600">{{ review.points }}</span>
                      </div>
                    </div>
                    <span class="text-gray-500 text-sm">{{ review.date }}</span>
                  </div>
                  <p class="text-gray-600">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />

    <PricingModal :is-open="isModalOpen" :on-close="() => (isModalOpen = false)" />
  </div>
</template>

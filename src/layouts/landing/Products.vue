<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PricingModal from './PricingModal.vue'

const router = useRouter()
const isModalOpen = ref(false)

const products = [
  {
    id: 1,
    slug: 'windows-11-pro',
    name: 'Windows 11 Pro',
    price: '3.000.000 đ',
    description:
      'Windows 11 Pro là phiên bản cao cấp của Windows 11, cung cấp các tính năng bảo mật và quản lý nâng cao cho doanh nghiệp và người dùng chuyên nghiệp.',
    image: 'https://dn720002.ca.archive.org/0/items/windows-11-pro-x-64-preactivated/Windows_11_Pro.jpg',
    downloads: 15234,
    rating: 4.8,
    totalReviews: 1250,
    features: [
      'Kích hoạt trọn đời',
      'Cập nhật miễn phí',
      'Hỗ trợ kỹ thuật 24/7',
      'Bảo hành trọn đời',
      'Key chính hãng từ Microsoft'
    ]
  },
  {
    id: 2,
    slug: 'office-365',
    name: 'Office 365',
    price: '2.000.000 đ',
    description:
      'Microsoft Office 365 là bộ ứng dụng văn phòng đám mây hoàn chỉnh, bao gồm Word, Excel, PowerPoint và nhiều ứng dụng khác.',
    image: 'https://www.logo.wine/a/logo/Office_365/Office_365-Logo.wine.svg',
    downloads: 8765,
    rating: 4.6,
    totalReviews: 856,
    features: ['Truy cập trọn đời', 'OneDrive 1TB', 'Cập nhật tự động', 'Hỗ trợ đa nền tảng', 'Bảo mật cao cấp']
  },
  {
    id: 3,
    slug: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    price: '5.000.000 đ',
    description:
      'Adobe Creative Cloud là bộ công cụ sáng tạo chuyên nghiệp, bao gồm Photoshop, Illustrator, Premiere Pro và nhiều ứng dụng khác.',
    image: 'https://logowik.com/content/uploads/images/t_adobe-creative-cloud6378.jpg',
    downloads: 5432,
    rating: 4.7,
    totalReviews: 623,
    features: [
      'Truy cập tất cả ứng dụng Adobe',
      'Cloud Storage 100GB',
      'Fonts Adobe premium',
      'Behance Portfolio',
      'Cập nhật thường xuyên'
    ]
  }
]

const viewProductDetails = (slug: string) => {
  console.log('heheheh')
  router.push(`/product/${slug}`)
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num)
}
</script>

<template>
  <div id="pricing" class="section-padding">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Sản Phẩm Của Chúng Tôi</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300"
        >
          <img :src="product.image" :alt="product.name" class="w-full h-48 object-contain mb-4" />
          <h3 class="text-2xl font-bold mb-2">{{ product.name }}</h3>
          <div class="text-3xl font-bold text-primary mb-4">{{ product.price }}</div>
          <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="flex text-yellow-400 mr-2">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span class="ml-1 font-semibold">{{ product.rating }}</span>
              </div>
              <span class="text-gray-500">({{ formatNumber(product.totalReviews) }} đánh giá)</span>
            </div>
            <div class="flex items-center text-gray-500">
              <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {{ formatNumber(product.downloads) }}
            </div>
          </div>

          <div class="space-y-4">
            <button
              @click="viewProductDetails(product.slug)"
              class="w-full border-2 border-primary text-primary font-semibold py-2 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Xem Chi Tiết
            </button>
            <button @click="(isModalOpen = true), $router.push('/login')" class="btn-primary w-full">Mua Ngay</button>
          </div>
        </div>
      </div>
    </div>

    <PricingModal :is-open="isModalOpen" :on-close="() => (isModalOpen = false)" />
  </div>
</template>

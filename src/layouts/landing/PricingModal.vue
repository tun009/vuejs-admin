<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  isOpen: boolean
  onClose: () => void
}>()

const plans = [
  {
    name: 'GÓI SOLO',
    price: '3.000.000 đ',
    priceUSD: '$125',
    features: [
      '01 máy sử dụng vĩnh viễn',
      'Không giới hạn profile',
      'Nhận trình duyệt Chromium & Firefox',
      'Hỗ trợ trọn đời',
      'Automation API',
      'No code automation'
    ]
  },
  {
    name: 'GÓI TEAM 5PC',
    price: '6.000.000 đ',
    priceUSD: '$245',
    features: [
      '05 máy sử dụng vĩnh viễn',
      'Không giới hạn profile',
      'Nhận trình duyệt Chromium & Firefox',
      'Hỗ trợ duy nhất chủ license',
      'Automation API',
      'No code automation'
    ]
  },
  {
    name: 'GÓI TEAM 10PC',
    price: '10.000.000 đ',
    priceUSD: '$405',
    features: [
      '10 máy sử dụng vĩnh viễn',
      'Không giới hạn profile',
      'Nhận trình duyệt Chromium & Firefox',
      'Hỗ trợ duy nhất chủ license',
      'Automation API',
      'No code automation'
    ]
  }
]
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="onClose">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="flex justify-between items-start mb-6">
                <h3 class="text-2xl font-bold text-gray-900">Chọn Gói Sản Phẩm</h3>
                <button @click="onClose" class="text-gray-400 hover:text-gray-500">
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div class="grid md:grid-cols-3 gap-6">
                <div
                  v-for="plan in plans"
                  :key="plan.name"
                  class="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
                >
                  <h4 class="text-xl font-bold mb-4">{{ plan.name }}</h4>
                  <div class="mb-4">
                    <div class="text-3xl font-bold text-primary">{{ plan.price }}</div>
                    <div class="text-lg text-gray-600">{{ plan.priceUSD }}</div>
                  </div>
                  <ul class="space-y-3 mb-6">
                    <li v-for="feature in plan.features" :key="feature" class="flex items-start">
                      <svg
                        class="h-5 w-5 text-primary shrink-0 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span class="text-gray-600">{{ feature }}</span>
                    </li>
                  </ul>
                  <button class="btn-primary w-full">Mua Ngay</button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

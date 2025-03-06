<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isOpen: boolean
  product: any
  onClose: () => void
}>()
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
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="flex justify-between items-start">
                <DialogTitle as="h3" class="text-2xl font-bold text-gray-900">
                  {{ product.name }}
                </DialogTitle>
                <button @click="onClose" class="text-gray-400 hover:text-gray-500">
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div class="mt-6">
                <img :src="product.image" :alt="product.name" class="w-full rounded-lg mb-6" />

                <div class="space-y-6">
                  <div>
                    <h4 class="text-lg font-semibold mb-2">{{ t('products.description') }}</h4>
                    <p class="text-gray-600">{{ product.description }}</p>
                  </div>

                  <div>
                    <h4 class="text-lg font-semibold mb-2">{{ t('products.features') }}</h4>
                    <ul class="list-disc list-inside space-y-2">
                      <li v-for="feature in product.features" :key="feature" class="text-gray-600">
                        {{ feature }}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 class="text-lg font-semibold mb-2">{{ t('products.requirements') }}</h4>
                    <ul class="list-disc list-inside space-y-2">
                      <li v-for="req in product.requirements" :key="req" class="text-gray-600">
                        {{ req }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-8 flex justify-between items-center">
                  <div class="text-3xl font-bold text-primary">${{ product.price }}</div>
                  <button class="btn-primary">{{ t('products.buyNow') }}</button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

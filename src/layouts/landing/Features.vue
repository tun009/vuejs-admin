<script setup lang="ts">
const features = [
  {
    title: 'Instant Delivery',
    description: 'Get your license key immediately after purchase via email',
    icon: '⚡'
  },
  {
    title: 'Genuine Keys',
    description: '100% authentic and verified software licenses',
    icon: '🔑'
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock customer support for activation assistance',
    icon: '💬'
  },
  {
    title: 'Money-Back Guarantee',
    description: 'Full refund if you encounter any issues with your license',
    icon: '💰'
  }
]
</script>

<template>
  <div id="features" class="section-padding bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<template>
  <div id="contact" class="section-padding bg-gray-50">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Contact Us</h2>
      <form class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Your name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            rows="4"
            placeholder="Your message"
          />
        </div>
        <button type="submit" class="btn-primary w-full">Send Message</button>
      </form>
    </div>
  </div>
</template>

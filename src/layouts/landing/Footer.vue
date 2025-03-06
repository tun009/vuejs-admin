<script setup lang="ts"></script>

<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">LicenseKey</h3>
          <p class="text-gray-400">Your trusted source for genuine software licenses.</p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white">Home</a></li>
            <li><a href="#features" class="text-gray-400 hover:text-white">Features</a></li>
            <li><a href="#pricing" class="text-gray-400 hover:text-white">Pricing</a></li>
            <li><a href="#contact" class="text-gray-400 hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Legal</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white">Privacy Policy</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Terms of Service</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Refund Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-4">Contact</h4>
          <ul class="space-y-2 text-gray-400">
            <li>Email: support@licensekey.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Hours: 24/7 Support</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} LicenseKey. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

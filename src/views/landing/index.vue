<script setup lang="ts">
import NavBar from '@/layouts/landing/NavBar.vue'
import Hero from '@/layouts/landing/Hero.vue'
import Features from '@/layouts/landing/Features.vue'
import Products from '@/layouts/landing/Products.vue'
import Contact from '@/layouts/landing/Contact.vue'
import Footer from '@/layouts/landing/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <NavBar />
    <main>
      <Hero />
      <Features />
      <Products />
      <Contact />
    </main>
    <Footer />
  </div>
</template>

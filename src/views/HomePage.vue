<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import CategoriesGrid from '@/components/home/CategoriesGrid.vue'
import TrustSignals from '@/components/home/TrustSignals.vue'
import CustomerReviews from '@/components/home/CustomerReviews.vue'
</script>

<template>
  <div class="homepage">
    <HeroSection />
    <CategoriesGrid />
    <TrustSignals />
    <CustomerReviews />
  </div>
</template>

<style scoped>
.homepage {
  display: flex;
  flex-direction: column;
}
</style>
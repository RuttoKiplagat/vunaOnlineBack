<script setup>
const reviews = [
  {
    name: 'John Kamau',
    location: 'Nakuru County',
    text: 'VunaOnline transformed my farming. The quality of seeds is exceptional and delivery is always on time!',
    rating: 5,
    avatar: 'JK'
  },
  {
    name: 'Grace Ochieng',
    location: 'Kisumu County',
    text: 'Best prices I have found. The fertilizers have significantly improved my crop yields this season.',
    rating: 5,
    avatar: 'GO'
  },
  {
    name: 'Peter Mwangi',
    location: 'Kiambu County',
    text: 'Excellent customer service. They helped me choose the right pesticides for my tomato farm.',
    rating: 5,
    avatar: 'PM'
  }
]
</script>

<template>
  <section class="section-padding reviews-section">
    <v-container>
      <div class="section-header text-white">
        <h2 class="section-title text-white">What Our Farmers Say</h2>
        <p class="section-subtitle text-primary-50">Join thousands of successful farmers who trust VunaOnline.</p>
        <div class="section-divider bg-white"></div>
      </div>

      <v-row class="mt-12">
        <v-col
          v-for="(review, index) in reviews"
          :key="review.name"
          cols="12" md="4"
        >
          <v-card 
            class="review-card pa-8 h-100 d-flex flex-column" 
            elevation="0"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <v-rating
              :model-value="review.rating"
              color="amber-darken-1"
              density="compact"
              readonly
              size="small"
              class="mb-6"
            ></v-rating>
            
            <p class="text-body-1 font-italic text-on-surface mb-8 flex-grow-1 line-height-relaxed">
              "{{ review.text }}"
            </p>
            
            <div class="d-flex align-center mt-auto">
              <v-avatar color="primary-50" size="48" class="mr-4">
                <span class="text-primary font-weight-bold">{{ review.avatar }}</span>
              </v-avatar>
              <div>
                <h4 class="text-h4 font-weight-bold mb-1" style="font-size: 1rem;">{{ review.name }}</h4>
                <div class="text-caption text-muted d-flex align-center">
                  <v-icon icon="mdi-map-marker" size="small" class="mr-1" />
                  {{ review.location }}
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.reviews-section {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%) !important;
  position: relative;
}

.section-divider.bg-white {
  background: white;
  opacity: 0.8;
}

.review-card {
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  transition: transform var(--transition-base);
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

.review-card:hover {
  transform: translateY(-8px);
}

.line-height-relaxed {
  line-height: 1.7;
}

.text-on-surface {
  color: var(--color-on-surface);
}
</style>

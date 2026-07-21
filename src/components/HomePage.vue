<script setup>
import { ref, onMounted, onUnmounted} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentSlide = ref(0);
const isVisible = ref(true);

const farmSlides = [
    {
    title: 'Quality Farm Inputs Delivered',
    subtitle: 'Premium seeds, fertilizers & equipment for better yields',
    button: 'Shop Now',
    icon: 'mdi-sprout'
  },
  {
    title: 'Grow More, Earn More',
    subtitle: 'Expert-approved products for maximum productivity',
    button: 'Explore Products',
    icon: 'mdi-chart-line'
  },
  {
    title: 'From Farm to Your Doorstep',
    subtitle: 'Fast delivery across all 47 counties in Kenya',
    button: 'Order Today',
    icon: 'mdi-truck-fast'
  }
]

const stats = [
    {values: '10K+', label: 'Happy Farmers', icon: 'mdi-emoticon-happy'},
    {values: '500+', label: 'Products Available', icon: 'mdi-package-variant'},
    {values: '47', label: 'Counties Served', icon: 'mdi-map-marker'},
    {values: '24/7', label: 'Customer Support', icon: 'mdi-headset'}
]
const categories = ref([
  { id: 1, name: 'Seeds', icon: 'mdi-seed', color: 'green-lighten-4', count: '45 Products' },
  { id: 2, name: 'Fertilizers', icon: 'mdi-sack', color: 'amber-lighten-4', count: '32 Products' },
  { id: 3, name: 'Pesticides', icon: 'mdi-spray', color: 'red-lighten-4', count: '28 Products' },
  { id: 4, name: 'Equipment', icon: 'mdi-tools', color: 'blue-lighten-4', count: '56 Products' },
  { id: 5, name: 'Animal Feed', icon: 'mdi-barley', color: 'orange-lighten-4', count: '24 Products' },
  { id: 6, name: 'Irrigation', icon: 'mdi-water', color: 'cyan-lighten-4', count: '18 Products' }
])

const users = [
                  { icon: 'mdi-certificate', title: 'Certified Products', desc: 'All products meet Kenya Bureau of Standards' },
                  { icon: 'mdi-truck-delivery-outline', title: 'Free Delivery', desc: 'Free shipping on orders above KES 5,000' },
                  { icon: 'mdi-headset', title: 'Expert Support', desc: 'Access to agronomists and farming experts' },
                  { icon: 'mdi-refresh', title: 'Easy Returns', desc: '30-day return policy for unused products' }
                ]

const reviews = ref([
  {
    name: 'John Kamau',
    location: 'Nakuru County',
    image: '',
    text: 'FarmShop transformed my farming. The quality of seeds is exceptional and delivery is always on time!',
    rating: 5
  },
  {
    name: 'Grace Ochieng',
    location: 'Kisumu County',
    image: '',
    text: 'Best prices I have found. The fertilizers have significantly improved my crop yields this season.',
    rating: 5
  },
  {
    name: 'Peter Mwangi',
    location: 'Kiambu County',
    image: '',
    text: 'Excellent customer service. They helped me choose the right pesticides for my tomato farm.',
    rating: 5
  }
])

let slideInterval
onMounted(() => {
    slideInterval = setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % farmSlides.length
    }, 5000)
    })
onUnmounted(() => {
    clearInterval(slideInterval)
})
function nextSlide() {
    currentSlide.value = (currentSlide.value + 1) % farmSlides.length
}
function prevSlide() {
    currentSlide.value = (currentSlide.value - 1 + farmSlides.length) % farmSlides.length
}
function goToProducts() {
    router.push('/products')
}
function goToCategories(categoryId) {
    router.push(`/products?category=${categoryId}`)
}

</script>

<template>
   <div>
    <section class="farm-section">
        <v-container class="fill-height">
            <v-row align="center" justify="center">
                <v-col cols="12", md="10" lg="8" class="text-center text-white farm-content">
                    <!-- Animating Icon -->
                    <div class="farm-icon mb-6">
                        <v-icon :icon="farmSlides[currentSlide].icon" size="80" color="white">
                        </v-icon>
                    </div>

                    <!-- Animating title-->
                     <transition name="fade-slide" mode="out-in">
                        <h1 :key="currentSlide", class="text-h2 font-weight-bold mb-4 farm-title">
                            {{ farmSlides[currentSlide].title }}
                        </h1>
                     </transition>
                     <transition name="fade" mode="out-in">
                        <p1 :key="currentSlide", class="text-h1 font-weight-bold mb-4 farm-subtitle">
                            {{ farmSlides[currentSlide].subtitle }}
                        </p1>
                     </transition>
                     <div class="farm-button">
                        <v-btn
                           color="white",
                           size: x-large,
                           class="text-green-darken-3 font-weight-bold px-8 mr-4 farm-button-primary"
                           elevation="4"
                           @click="goToProducts">
                            {{ farmSlides[currentSlide].button }}

                        </v-btn>
                        <v-btn
                            variant="outlined"
                            
                           color="white",
                           elevation="4"
                           size="x-large"
                           to="/register">
                            Create Account
                        </v-btn>
                     </div>
                     <!-- Dot Indicators -->
                     <div class="dot-indicators mt-8">
                        <v-btn
                         v-for="(slide, index) in farmSlides"
                        :key="index"
                        icon
                        size="small"
                        :color="currentSlide === index ? 'white' : 'white'"
                        :variant="currentSlide === index ? 'flat' : 'text'"
                        class="mx-1 indicator-dot"
                        @click="currentSlide = index"
                        >
                        <v-icon>{{ currentSlide === index ? 'mdi-circle' : 'mdi-circle-outline' }}</v-icon>
                        
                        </v-btn>
                     </div>

                </v-col>
            </v-row>
        </v-container>
        <!-- Farm Animation -->
        <div class="farm-animation">
            <div class="floating-shape shape-1"></div>
            <div class="floating-shape shape-2"></div>
            <div class="floating-shape shape-3"></div>
        </div>
    </section>
    <!-- Stats Section -->
     <v-sheet color="green-darken-2">
        <v-container>
            <v-row>
                <v-col v-for="stat in stats"
                :key="stat.label"
                cols="12" md="3"
                :class="['text-center py-6']">
                    <div>
                        <v-icon>{{ stat.icon }}</v-icon>
                        <div class="text-h4 font-weight-bold">{{ stat.values }}</div>
                        <div>{{ stat.label }}</div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
     </v-sheet>
        <!-- Categories Section -->
    <section class="py-16"  >
        <v-container>
            <div>
                <h1 class="text-center">Shop by Category</h1>
                <p class="text-center">Explore our wide range of products across various categories</p>
            </div>
         <v-row class="py-6">
            <v-col
            v-for="category in categories"
            :key="category.id"
            cols="12" md="2" >
            <v-hover v-slot="isHovering, props">
                <v-card
                v-bind="props"
                @click="goToCategories(category.id)"
                :color="category.color"
                :class="['text-center pa-6 h-100', {elevated: isHovering}]">
                <div>
                    <v-icon :icon="category.icon", size="48" color="green-darken-3"></v-icon>
                </div>
                <h3 class="text-h6 font-weight-bold mt-2">{{ category.name }}</h3>
                <p>{{ category.count }}</p>
                <v-fade-transition>
                    <v-btn
                    v-if="isHovering"
                    :to="'/products'"
                    >
                        Explore
                    </v-btn>
                </v-fade-transition>
                </v-card>
            </v-hover>
            </v-col>
         </v-row>
        </v-container>
    </section>

    <!-- Why Choose Us -->
     <section class="py-16 " >
        <v-container>
            <v-row>
                <v-col>
                    <v-image
                    src="/farm.jpg"
                    height="500" 
                    cover
                    >

                    </v-image>
                </v-col>
                <v-col>
                  <v-row
                  v-for="user in users"
                  :key="user.id"
                  cols="12" md="6"
                  class="text-center py-1">
                  <div>
                    <v-icon color="green-darken-2">{{ user.icon }}</v-icon>
                    <h3 class="text-h6 font-weight-bold mt-2">{{ user.title }}</h3>
                    <p>{{ user.desc }}</p>
                  </div>

                  </v-row>
                </v-col>
            </v-row>
        </v-container>
     </section>
     <!-- Reviews -->
     <section class="py-16 bg-green-darken-3 text-white" >
        <v-container>
            <div>
                <h2 class="text-center">
                    What Our Customers Say
                </h2>
            </div>
            <v-row>
                <v-col
                v-for="review in reviews"
                :key="review.name"
                cols="12" md="4"
                >
                <v-card class="review-card pa-6 h-100" color="white" elevation="4" >
                <div>
                <v-icon icon="mdi-account" size="32" color="green-darken-2"></v-icon>
                <div>
                    <h3 class="text-h6 font-weight-bold mt-2 text-grey-darken-2">{{ review.name }}</h3>
                    <p class="text-body-2 text-grey" >{{ review.location }}</p>
                    
                </div>
                <v-rating
                :model-value="reviews.rating"
                color="amber"
                density="compact"
                readonly
                 size="small">

                </v-rating>
                <div>
                    <p class="text-body-1 text-grey-darken-2 italic">{{ review.text }}</p>
                </div>
                
                </div>
                </v-card>
                </v-col>
            </v-row>
        </v-container>
     </section>
   </div>
   

</template>

<style scoped>

.farm-section {
    background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%);
    align-items: center;
    min-height: 90vh;
    display: flex;
    position: relative;
    overflow: hidden;
}
.farm-content {
    position: relative;
    z-index: 1;
}
.farm-icon {
    animation: bounce 2s infinite;
}
.farm-title {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    animation: fadeInDown 1s ease-out;
}
.farm-subtitle {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.farm-button {
    animation: fadeIn 1s ease-out;
}
.farm-button-primary {
    transition: transform 0.3s , box-shadow 0.3s;
}
.farm-button-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 12px rgba(0, 0, 0, 0.2);
}
.review-card {
    border-radius: 10px;
    position: relative;
    overflow: hidden;
}
</style>
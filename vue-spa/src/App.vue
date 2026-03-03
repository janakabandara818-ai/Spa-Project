<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Product, ProductResponse } from './type';
import NavBar from './components/NavBar.vue';
import ProductCard from './components/ProductCard.vue';

const products = ref<Product[]>([]);
const loading = ref(false);
const isDark = ref(false);

const toggleDark = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await fetch('https://dummyjson.com/products?limit=20');
    const data: ProductResponse = await response.json();
    products.value = data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchProducts());
</script>

<template>
  <div :class="['min-h-screen transition-colors duration-300', isDark ? 'dark bg-gray-950' : 'bg-[#f5f4f0]']">
    <NavBar :is-dark="isDark" @toggle-dark="toggleDark" />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <!-- Page Heading -->
      <div class="mb-10">
        <p class="text-xs uppercase tracking-[0.3em] font-semibold mb-1"
           :class="isDark ? 'text-indigo-400' : 'text-indigo-500'">
          Curated Collection
        </p>
        <h2 class="text-3xl font-bold tracking-tight"
            :class="isDark ? 'text-white' : 'text-gray-900'">
          All Products
        </h2>
      </div>

      <!-- Skeleton Loader -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="n in 8" :key="n"
          :class="['rounded-2xl overflow-hidden animate-pulse', isDark ? 'bg-gray-800' : 'bg-white']">
          <div :class="['h-52 w-full', isDark ? 'bg-gray-700' : 'bg-gray-200']"></div>
          <div class="p-4 space-y-3">
            <div :class="['h-3 rounded-full w-1/3', isDark ? 'bg-gray-700' : 'bg-gray-200']"></div>
            <div :class="['h-4 rounded-full w-4/5', isDark ? 'bg-gray-700' : 'bg-gray-200']"></div>
            <div class="flex justify-between items-center pt-2">
              <div :class="['h-5 rounded-full w-1/4', isDark ? 'bg-gray-700' : 'bg-gray-200']"></div>
              <div :class="['h-8 rounded-xl w-1/3', isDark ? 'bg-gray-700' : 'bg-gray-200']"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          :is-dark="isDark"
          :style="{ animationDelay: `${index * 55}ms` }"
          class="fade-in-up"
        />
      </div>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Playfair+Display:wght@600&display=swap');

body { font-family: 'DM Sans', sans-serif; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

</style>
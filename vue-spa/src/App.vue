<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Product, ProductResponse } from './type';
import NavBar from './components/NavBar.vue';
import ProductCard from './components/ProductCard.vue';

const products = ref<Product[]>([]);
const loading = ref(false);
const isDark = ref(false);
const activeCategory = ref<'all' | 'clothing' | 'jewellery'>('all');

const toggleDark = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const [clothingRes, shoesRes, watchesRes, jewelleryRes] = await Promise.all([
      fetch('https://dummyjson.com/products/category/mens-shirts?limit=8'),
      fetch('https://dummyjson.com/products/category/mens-shoes?limit=4'),
      fetch('https://dummyjson.com/products/category/mens-watches?limit=4'),
      fetch('https://dummyjson.com/products/category/womens-jewellery?limit=8'),
    ]);

    const [clothing, shoes, watches, jewellery] = await Promise.all([
      clothingRes.json() as Promise<ProductResponse>,
      shoesRes.json()    as Promise<ProductResponse>,
      watchesRes.json()  as Promise<ProductResponse>,
      jewelleryRes.json() as Promise<ProductResponse>,
    ]);

    products.value = [
      ...clothing.products,
      ...shoes.products,
      ...watches.products,
      ...jewellery.products,
    ];
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return products.value;
  if (activeCategory.value === 'clothing')
    return products.value.filter(p =>
      ['mens-shirts', 'mens-shoes', 'mens-watches'].includes(p.category)
    );
  if (activeCategory.value === 'jewellery')
    return products.value.filter(p => p.category === 'womens-jewellery');
  return products.value;
});

const clothingProducts = computed(() =>
  products.value.filter(p => ['mens-shirts', 'mens-shoes', 'mens-watches'].includes(p.category)).slice(0, 4)
);

const jewelleryProducts = computed(() =>
  products.value.filter(p => p.category === 'womens-jewellery').slice(0, 4)
);

onMounted(() => fetchProducts());
</script>

<template>
  <div class="min-h-screen" style="background-color: #faf6f1; font-family: 'DM Sans', sans-serif;">
    <NavBar :is-dark="isDark" @toggle-dark="toggleDark" />

    <!-- Hero Banner -->
    <section class="relative w-full overflow-hidden" style="background: linear-gradient(135deg, #7a4a2e 0%, #a0673a 50%, #c4855a 100%); min-height: 420px;">
      <div class="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center" style="min-height: 420px;">
        <p class="uppercase tracking-[0.4em] text-xs font-semibold mb-3" style="color: #f0c070;">
          Celebrating Your Radiance
        </p>
        <h1 style="font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; color: #fff5e6; line-height: 1.2;" class="mb-4">
          Golden Crest Collection
        </h1>
        <p class="mb-8 text-sm" style="color: #f0dfc0; max-width: 480px;">
          Shirts, shoes, watches & fine jewellery — curated with elegance, crafted for you.
        </p>
      </div>

      <!-- Decorative wave -->
      <div style="position: absolute; bottom: -2px; left: 0; right: 0;">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%; height:60px; display:block;">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#faf6f1"/>
        </svg>
      </div>
    </section>

    <main id="shop" class="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      <!-- Discover Your Style Section -->
      <section class="mb-16">
        <div class="flex items-center gap-4 mb-6">
          <div style="flex: 1; height: 1px; background: #d4b896;"></div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #3d1a0e; white-space: nowrap;">
            Discover Your Style
          </h2>
          <div style="flex: 1; height: 1px; background: #d4b896;"></div>
        </div>

        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="n in 4" :key="n" class="rounded-2xl overflow-hidden animate-pulse" style="background:#ede0d4;">
            <div style="height: 180px; background: #d4b896;"></div>
            <div class="p-3 space-y-2">
              <div style="height:10px; background:#d4b896; border-radius:99px; width:50%;"></div>
              <div style="height:12px; background:#d4b896; border-radius:99px; width:80%;"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ProductCard
            v-for="(product, index) in clothingProducts"
            :key="product.id"
            :product="product"
            :is-dark="false"
            :style="{ animationDelay: `${index * 55}ms` }"
            class="fade-in-up"
          />
        </div>
      </section>

      <!-- Featured Jewellery Section -->
      <section class="mb-16">
        <div class="rounded-2xl mb-8 px-8 py-6 flex items-center justify-between flex-wrap gap-4"
             style="background: linear-gradient(90deg, #7a4a2e, #a0673a);">
          <div>
            <p class="uppercase tracking-widest text-xs mb-1" style="color: #f0c070;">Limited Edition</p>
            <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #fff5e6;">
              Featured Jewellery
            </h3>
          </div>
          <button
            @click="activeCategory = 'jewellery'"
            style="border: 1px solid #f0c070; color: #f0c070; background: transparent; padding: 8px 24px; font-size: 0.8rem; letter-spacing: 0.12em; border-radius: 50px; cursor: pointer;"
          >
            VIEW ALL
          </button>
        </div>

        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="n in 4" :key="n" class="rounded-2xl overflow-hidden animate-pulse" style="background:#ede0d4;">
            <div style="height: 180px; background: #d4b896;"></div>
            <div class="p-3 space-y-2">
              <div style="height:10px; background:#d4b896; border-radius:99px; width:50%;"></div>
              <div style="height:12px; background:#d4b896; border-radius:99px; width:80%;"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ProductCard
            v-for="(product, index) in jewelleryProducts"
            :key="product.id"
            :product="product"
            :is-dark="false"
            :style="{ animationDelay: `${index * 55}ms` }"
            class="fade-in-up"
          />
        </div>
      </section>

      <!-- All Products Section -->
      <section>
        <div class="flex items-center gap-4 mb-6">
          <div style="flex: 1; height: 1px; background: #d4b896;"></div>
          <h2 style="font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #3d1a0e; white-space: nowrap;">
            All Products
          </h2>
          <div style="flex: 1; height: 1px; background: #d4b896;"></div>
        </div>

        <!-- Category Filter Tabs -->
        <div class="flex gap-2 mb-8 flex-wrap">
          <button
            v-for="tab in [
              { key: 'all',       label: 'All Items' },
              { key: 'clothing',  label: '👕 Clothing & Accessories' },
              { key: 'jewellery', label: '💍 Jewellery' },
            ]"
            :key="tab.key"
            @click="activeCategory = tab.key as any"
            :style="activeCategory === tab.key
              ? 'background:#7a4a2e; color:#f0c070; border-color:#7a4a2e;'
              : 'background:white; color:#6b4226; border-color:#d4b896;'"
            style="padding: 6px 20px; border-radius: 50px; font-size: 0.85rem; font-weight: 500; border: 1px solid; cursor: pointer; transition: all 0.2s;"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="rounded-2xl overflow-hidden animate-pulse" style="background:#ede0d4;">
            <div style="height: 208px; background: #d4b896;"></div>
            <div class="p-4 space-y-3">
              <div style="height:10px; background:#d4b896; border-radius:99px; width:33%;"></div>
              <div style="height:14px; background:#d4b896; border-radius:99px; width:80%;"></div>
              <div class="flex justify-between pt-2">
                <div style="height:18px; background:#d4b896; border-radius:99px; width:25%;"></div>
                <div style="height:32px; background:#d4b896; border-radius:12px; width:33%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            :product="product"
            :is-dark="false"
            :style="{ animationDelay: `${index * 55}ms` }"
            class="fade-in-up"
          />
        </div>

        <!-- Empty state -->
        <div v-if="!loading && filteredProducts.length === 0" class="text-center py-20" style="color: #a0826d;">
          <p class="text-4xl mb-3">🛍️</p>
          <p class="text-lg font-medium">No products found.</p>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="mt-16 py-6 text-center text-sm" style="background:#7a4a2e; color:#d4a875;">
      <p style="font-family: 'Playfair Display', serif; font-size: 1rem; color: #f0c070;" class="mb-1">Golden Crest</p>
      <p>© 2025 Golden Crest. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Playfair+Display:wght@600;700&display=swap');

body { font-family: 'DM Sans', sans-serif; margin: 0; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Product, ProductResponse, CartItem } from './type';
import NavBar from './components/NavBar.vue';
import ProductCard from './components/ProductCard.vue';
import CartDrawer from './components/CartDrawer.vue';
import ProductDetailModal from './components/ProductDetailModal.vue';

// ─────────────────────────────────────────
// Auth Types
// ─────────────────────────────────────────
interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
  refreshToken: string;
}

// ─────────────────────────────────────────
// Auth State
// ─────────────────────────────────────────
const showAuthModal  = ref(false);
const isLoginMode    = ref(true);
const isLoggedIn     = ref(false);
const authLoading    = ref(false);
const authError      = ref('');
const loggedInUser   = ref<AuthResponse | null>(null);

const authForm = ref({ username: '', password: '' });

// Check localStorage on mount — persist login across refresh
onMounted(() => {
  const token = localStorage.getItem('gc_token');
  const user  = localStorage.getItem('gc_user');
  if (token && user) {
    isLoggedIn.value  = true;
    loggedInUser.value = JSON.parse(user) as AuthResponse;
  }
});

// ── Real DummyJSON /auth/login ──
const handleLogin = async () => {
  authError.value   = '';
  authLoading.value = true;

  try {
    const res = await fetch('https://dummyjson.com/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username:          authForm.value.username,
        password:          authForm.value.password,
        expiresInMins:     60,
      }),
    });

    if (!res.ok) {
      // DummyJSON returns 400 for wrong credentials
      const err = await res.json();
      throw new Error(err.message || 'Invalid credentials');
    }

    const data: AuthResponse = await res.json();

    // Store JWT token + user in localStorage
    localStorage.setItem('gc_token', data.token);
    localStorage.setItem('gc_user',  JSON.stringify(data));

    isLoggedIn.value   = true;
    loggedInUser.value = data;
    showAuthModal.value = false;
    authForm.value      = { username: '', password: '' };

  } catch (err: unknown) {
    authError.value = err instanceof Error ? err.message : 'Login failed. Try again.';
  } finally {
    authLoading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('gc_token');
  localStorage.removeItem('gc_user');
  isLoggedIn.value   = false;
  loggedInUser.value = null;
};

// ─────────────────────────────────────────
// Cart State
// ─────────────────────────────────────────
const cartOpen  = ref(false);
const cartItems = ref<CartItem[]>([]);

const cartCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
);

const addToCart = (product: Product) => {
  const existing = cartItems.value.find(i => i.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cartItems.value.push({
      id:        product.id,
      title:     product.title,
      price:     product.price,
      thumbnail: product.thumbnail,
      quantity:  1,
    });
  }
};

const increaseQty    = (id: number) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) item.quantity++;
};
const decreaseQty    = (id: number) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) { if (item.quantity <= 1) removeFromCart(id); else item.quantity--; }
};
const removeFromCart = (id: number) => {
  cartItems.value = cartItems.value.filter(i => i.id !== id);
};

// ─────────────────────────────────────────
// Detail Modal State
// ─────────────────────────────────────────
const selectedProduct = ref<Product | null>(null);
const openDetail  = (product: Product) => { selectedProduct.value = product; };
const closeDetail = () => { selectedProduct.value = null; };

// ─────────────────────────────────────────
// Product State
// ─────────────────────────────────────────
const products       = ref<Product[]>([]);
const loading        = ref(false);
const isDark         = ref(false);
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
      clothingRes.json()  as Promise<ProductResponse>,
      shoesRes.json()     as Promise<ProductResponse>,
      watchesRes.json()   as Promise<ProductResponse>,
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
    return products.value.filter(p => ['mens-shirts','mens-shoes','mens-watches'].includes(p.category));
  if (activeCategory.value === 'jewellery')
    return products.value.filter(p => p.category === 'womens-jewellery');
  return products.value;
});

const clothingProducts = computed(() =>
  products.value.filter(p => ['mens-shirts','mens-shoes','mens-watches'].includes(p.category)).slice(0, 4)
);
const jewelleryProducts = computed(() =>
  products.value.filter(p => p.category === 'womens-jewellery').slice(0, 4)
);

onMounted(() => fetchProducts());
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-300"
    :style="isDark ? 'background-color:#0f0f0f;' : 'background-color:#faf6f1;'"
    style="font-family:'DM Sans',sans-serif;"
  >

    <NavBar
      :is-dark="isDark"
      :cart-count="cartCount"
      @toggle-dark="toggleDark"
      @open-login="showAuthModal = true"
      @open-cart="cartOpen = true"
    />

    <!-- Cart Drawer -->
    <CartDrawer
      :is-open="cartOpen"
      :is-dark="isDark"
      :items="cartItems"
      @close="cartOpen = false"
      @increase="increaseQty"
      @decrease="decreaseQty"
      @remove="removeFromCart"
    />

    <!-- Product Detail Modal -->
    <ProductDetailModal
      :product="selectedProduct"
      :is-dark="isDark"
      @close="closeDetail"
      @add-to-cart="addToCart"
    />

    <!-- ✅ Auth Modal -->
    <div v-if="showAuthModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div :class="['rounded-2xl p-8 w-full max-w-md shadow-2xl fade-in-up border', isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-[#d4b896]']">

        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 :style="`font-family:'Playfair Display',serif; font-size:1.8rem; color:${isDark ? '#f0c070' : '#3d1a0e'};`">
            {{ isLoginMode ? 'Welcome Back' : 'Register' }}
          </h2>
          <button @click="showAuthModal = false; authError = ''"
            class="text-3xl transition-colors"
            :class="isDark ? 'text-gray-500 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'"
          >&times;</button>
        </div>

        <!-- ✅ Real Login Form -->
        <form v-if="isLoginMode" @submit.prevent="handleLogin" class="space-y-4">

          <!-- DummyJSON test credentials hint -->
          <div class="rounded-xl p-3 text-xs" :style="isDark ? 'background:#1a1a1a; color:#888;' : 'background:#f5ede4; color:#7a6050;'">
            💡 Test credentials — username: <strong>emilys</strong> &nbsp; password: <strong>emilyspass</strong>
          </div>

          <div>
            <label :class="['block text-xs font-bold uppercase mb-1', isDark ? 'text-gray-400' : 'text-gray-500']">Username</label>
            <input
              v-model="authForm.username"
              type="text"
              :class="['w-full p-3 rounded-lg border focus:outline-none transition-colors', isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus:border-[#7a4a2e]']"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label :class="['block text-xs font-bold uppercase mb-1', isDark ? 'text-gray-400' : 'text-gray-500']">Password</label>
            <input
              v-model="authForm.password"
              type="password"
              :class="['w-full p-3 rounded-lg border focus:outline-none transition-colors', isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-amber-500' : 'bg-white border-gray-200 text-gray-900 focus:border-[#7a4a2e]']"
              placeholder="••••••••"
              required
            />
          </div>

          <!-- Error message -->
          <p v-if="authError" class="text-sm text-rose-500 font-medium">⚠ {{ authError }}</p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="authLoading"
            class="w-full py-4 rounded-full font-bold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            :style="isDark ? 'background:#f0c070; color:#3d1a0e;' : 'background:#7a4a2e; color:#f0c070;'"
          >
            {{ authLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- ✅ Logged In State shown inside modal if somehow opened -->
        <div v-if="isLoggedIn && loggedInUser" class="text-center space-y-4">
          <img :src="loggedInUser.image" class="w-16 h-16 rounded-full mx-auto border-2 border-amber-400" />
          <p :style="`font-family:'Playfair Display',serif; font-size:1.1rem; color:${isDark ? '#f0c070' : '#3d1a0e'};`">
            Welcome, {{ loggedInUser.firstName }}!
          </p>
          <button @click="logout(); showAuthModal = false"
            class="w-full py-3 rounded-full font-bold text-sm transition-all active:scale-95"
            style="background:#ef4444; color:#fff;"
          >
            Log Out
          </button>
        </div>

        <div class="text-center mt-6 text-sm">
          <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ isLoginMode ? "Don't have an account?" : "Already a member?" }}
          </span>
          <button @click="isLoginMode = !isLoginMode; authError = ''" class="ml-2 font-bold underline"
            :style="isDark ? 'color:#f0c070;' : 'color:#7a4a2e;'">
            {{ isLoginMode ? 'Register' : 'Back to Login' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ Logged-in user greeting in top (optional small banner) -->
    <div
      v-if="isLoggedIn && loggedInUser"
      class="flex items-center justify-between px-6 py-2 text-xs"
      :style="isDark ? 'background:#1a1108; color:#f0c070; border-bottom:1px solid #2a1f10;' : 'background:#f5ede4; color:#7a4a2e; border-bottom:1px solid #e8d5c0;'"
    >
      <span>
        👋 Welcome back, <strong>{{ loggedInUser.firstName }} {{ loggedInUser.lastName }}</strong>!
      </span>
      <button
        @click="logout"
        class="font-semibold underline text-xs transition-opacity hover:opacity-70"
      >
        Log Out
      </button>
    </div>

    <!-- Hero -->
    <section class="relative w-full overflow-hidden" style="background:linear-gradient(135deg,#7a4a2e 0%,#a0673a 50%,#c4855a 100%); min-height:420px;">
      <div class="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center" style="min-height:420px;">
        <p class="uppercase tracking-[0.4em] text-xs font-semibold mb-3" style="color:#f0c070;">Celebrating Your Radiance</p>
        <h1 style="font-family:'Playfair Display',serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:700; color:#fff5e6; line-height:1.2;" class="mb-4">
          Golden Crest Collection
        </h1>
        <p class="mb-8 text-sm" style="color:#f0dfc0; max-width:480px;">
          Shirts, shoes, watches & fine jewellery — curated with elegance, crafted for you.
        </p>
      </div>
      <div style="position:absolute; bottom:-2px; left:0; right:0;">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%; height:60px; display:block;">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" :fill="isDark ? '#0f0f0f' : '#faf6f1'"/>
        </svg>
      </div>
    </section>

    <main id="shop" class="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      <!-- Discover Your Style -->
      <section class="mb-16">
        <div class="flex items-center gap-4 mb-6">
          <div :style="`flex:1; height:1px; background:${isDark ? '#3a2e22' : '#d4b896'};`"></div>
          <h2 :style="`font-family:'Playfair Display',serif; font-size:1.6rem; white-space:nowrap; color:${isDark ? '#f0c070' : '#3d1a0e'};`">
            Discover Your Style
          </h2>
          <div :style="`flex:1; height:1px; background:${isDark ? '#3a2e22' : '#d4b896'};`"></div>
        </div>
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="n in 4" :key="n" class="rounded-2xl overflow-hidden animate-pulse" :style="`background:${isDark ? '#1a1a1a' : '#ede0d4'};`">
            <div :style="`height:180px; background:${isDark ? '#2a2a2a' : '#d4b896'};`"></div>
            <div class="p-3 space-y-2">
              <div :style="`height:10px; background:${isDark ? '#2a2a2a' : '#d4b896'}; border-radius:99px; width:50%;`"></div>
              <div :style="`height:12px; background:${isDark ? '#2a2a2a' : '#d4b896'}; border-radius:99px; width:80%;`"></div>
            </div>
          </div>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ProductCard
            v-for="(product, index) in clothingProducts"
            :key="product.id"
            :product="product"
            :is-dark="isDark"
            :style="{ animationDelay: `${index * 55}ms` }"
            class="fade-in-up"
            @add-to-cart="addToCart"
            @view-detail="openDetail"
          />
        </div>
      </section>

      <!-- Featured Jewellery -->
      <section class="mb-16">
        <div class="rounded-2xl mb-8 px-8 py-6 flex items-center justify-between flex-wrap gap-4"
          :style="isDark ? 'background:linear-gradient(90deg,#1c1008,#2e1f0e); border:1px solid #3a2a10;' : 'background:linear-gradient(90deg,#7a4a2e,#a0673a);'"
        >
          <div>
            <p class="uppercase tracking-widest text-xs mb-1" style="color:#f0c070;">Limited Edition</p>
            <h3 :style="`font-family:'Playfair Display',serif; font-size:1.5rem; color:${isDark ? '#f0c070' : '#fff5e6'};`">Featured Jewellery</h3>
          </div>
          <button @click="activeCategory = 'jewellery'"
            style="border:1px solid #f0c070; color:#f0c070; background:transparent; padding:8px 24px; font-size:0.8rem; letter-spacing:0.12em; border-radius:50px; cursor:pointer;">
            VIEW ALL
          </button>
        </div>
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="n in 4" :key="n" class="rounded-2xl overflow-hidden animate-pulse" :style="`background:${isDark ? '#1a1a1a' : '#ede0d4'};`">
            <div :style="`height:180px; background:${isDark ? '#2a2a2a' : '#d4b896'};`"></div>
            <div class="p-3 space-y-2">
              <div :style="`height:10px; background:${isDark ? '#2a2a2a' : '#d4b896'}; border-radius:99px; width:50%;`"></div>
              <div :style="`height:12px; background:${isDark ? '#2a2a2a' : '#d4b896'}; border-radius:99px; width:80%;`"></div>
            </div>
          </div>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ProductCard
            v-for="(product, index) in jewelleryProducts"
            :key="product.id"
            :product="product"
            :is-dark="isDark"
            :style="{ animationDelay: `${index * 55}ms` }"
            class="fade-in-up"
            @add-to-cart="addToCart"
            @view-detail="openDetail"
          />
        </div>
      </section>

      <!-- All Products -->
      <section>
        <div class="flex items-center gap-4 mb-6">
          <div :style="`flex:1; height:1px; background:${isDark ? '#3a2e22' : '#d4b896'};`"></div>
          <h2 :style="`font-family:'Playfair Display',serif; font-size:1.6rem; white-space:nowrap; color:${isDark ? '#f0c070' : '#3d1a0e'};`">All Products</h2>
          <div :style="`flex:1; height:1px; background:${isDark ? '#3a2e22' : '#d4b896'};`"></div>
        </div>
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
              ? (isDark ? 'background:#f0c070; color:#3d1a0e; border-color:#f0c070;' : 'background:#7a4a2e; color:#f0c070; border-color:#7a4a2e;')
              : (isDark ? 'background:#1a1a1a; color:#a08060; border-color:#3a2e22;' : 'background:white; color:#6b4226; border-color:#d4b896;')"
            style="padding:6px 20px; border-radius:50px; font-size:0.85rem; font-weight:500; border:1px solid; cursor:pointer; transition:all 0.2s;"
          >{{ tab.label }}</button>
        </div>
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="rounded-2xl overflow-hidden animate-pulse" :style="`background:${isDark ? '#1a1a1a' : '#ede0d4'};`">
            <div :style="`height:208px; background:${isDark ? '#2a2a2a' : '#d4b896'};`"></div>
            <div class="p-4 space-y-3">
              <div :style="`height:10px; background:${isDark ? '#2a2a2a' : '#d4b896'}; border-radius:99px; width:33%;`"></div>
              <div :style="`height:14px; background:${isDark ? '#2a2a2a' : '#d4b896'}; border-radius:99px; width:80%;`"></div>
            </div>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            :product="product"
            :is-dark="isDark"
            :style="{ animationDelay: `${index * 55}ms` }"
            class="fade-in-up"
            @add-to-cart="addToCart"
            @view-detail="openDetail"
          />
        </div>
        <div v-if="!loading && filteredProducts.length === 0" class="text-center py-20"
          :style="`color:${isDark ? '#6b4226' : '#a0826d'};`">
          <p class="text-4xl mb-3">🛍️</p>
          <p class="text-lg font-medium">No products found.</p>
        </div>
      </section>
    </main>

    <footer class="mt-16 py-8 text-center text-sm transition-colors duration-300"
      :style="isDark ? 'background:#0a0a0a; border-top:1px solid #2a1f10; color:#6b4226;' : 'background:#7a4a2e; color:#d4a875;'"
    >
      <p style="font-family:'Playfair Display',serif; font-size:1rem; color:#f0c070;" class="mb-1">Golden Crest</p>
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

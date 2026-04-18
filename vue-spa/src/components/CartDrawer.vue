<script setup lang="ts">
import type { CartItem } from '../type';

const props = defineProps<{
  isOpen: boolean;
  isDark: boolean;
  items: CartItem[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'increase', id: number): void;
  (e: 'decrease', id: number): void;
  (e: 'remove', id: number): void;
}>();

const total = computed(() =>
  props.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

import { computed } from 'vue';
</script>

<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
      @click="emit('close')"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-full max-w-sm z-[201] flex flex-col shadow-2xl transition-colors duration-300"
      :style="isDark ? 'background:#111111; border-left: 1px solid #2a1f10;' : 'background:#fdf8f3; border-left: 1px solid #d4b896;'"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-5 border-b"
        :style="isDark ? 'border-color:#2a1f10;' : 'border-color:#e8d5c0;'"
      >
        <div class="flex items-center gap-2">
          <span class="text-xl">🛒</span>
          <h2 :style="`font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:700; color:${isDark ? '#f0c070' : '#3d1a0e'};`">
            Your Cart
          </h2>
          <span
            v-if="items.length"
            class="text-xs font-bold px-2 py-0.5 rounded-full"
            :style="isDark ? 'background:#2a1a08; color:#f0c070;' : 'background:#f0e0c8; color:#7a4a2e;'"
          >
            {{ items.length }}
          </span>
        </div>
        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95"
          :style="isDark ? 'background:#1e1e1e; color:#aaa;' : 'background:#ede0d4; color:#7a4a2e;'"
        >
          ✕
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="items.length === 0" class="flex-1 flex flex-col items-center justify-center gap-3 px-6">
        <span class="text-5xl">🛍️</span>
        <p :style="`font-family:'Playfair Display',serif; font-size:1.1rem; color:${isDark ? '#6b4226' : '#a0826d'};`">
          Your cart is empty
        </p>
        <p class="text-sm text-center" :style="`color:${isDark ? '#4a3020' : '#c4a882'};`">
          Add some items to get started!
        </p>
      </div>

      <!-- Cart Items -->
      <div v-else class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <TransitionGroup name="cart-item">
          <div
            v-for="item in items"
            :key="item.id"
            class="flex gap-3 p-3 rounded-2xl border transition-colors duration-200"
            :style="isDark ? 'background:#1a1a1a; border-color:#2a2a2a;' : 'background:#fff; border-color:#ede0d4;'"
          >
            <!-- Image -->
            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" :style="isDark ? 'background:#2a2a2a;' : 'background:#f5ede4;'">
              <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-cover" />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold truncate" :style="`color:${isDark ? '#f5f5f5' : '#3d1a0e'};`">
                {{ item.title }}
              </p>
              <p class="text-xs mt-0.5" :style="`color:${isDark ? '#f0c070' : '#7a4a2e'};`">
                ${{ item.price.toFixed(2) }}
              </p>

              <!-- Quantity controls -->
              <div class="flex items-center gap-2 mt-2">
                <button
                  @click="emit('decrease', item.id)"
                  class="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-110 active:scale-95"
                  :style="isDark ? 'background:#2e2e2e; color:#f0c070;' : 'background:#f0e0c8; color:#7a4a2e;'"
                >−</button>
                <span class="text-sm font-bold min-w-[1.2rem] text-center" :style="`color:${isDark ? '#fff' : '#3d1a0e'};`">
                  {{ item.quantity }}
                </span>
                <button
                  @click="emit('increase', item.id)"
                  class="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-110 active:scale-95"
                  :style="isDark ? 'background:#2e2e2e; color:#f0c070;' : 'background:#f0e0c8; color:#7a4a2e;'"
                >+</button>
                <span class="ml-auto text-xs font-bold" :style="`color:${isDark ? '#f0c070' : '#7a4a2e'};`">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Remove -->
            <button
              @click="emit('remove', item.id)"
              class="self-start text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
              :style="isDark ? 'background:#2a0f0f; color:#f87171;' : 'background:#fef2f2; color:#ef4444;'"
            >✕</button>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer / Checkout -->
      <div
        v-if="items.length"
        class="px-6 py-5 border-t space-y-4"
        :style="isDark ? 'border-color:#2a1f10;' : 'border-color:#e8d5c0;'"
      >
        <!-- Subtotal -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium" :style="`color:${isDark ? '#a08060' : '#7a6050'};`">Subtotal</span>
          <span class="text-lg font-bold" :style="`font-family:'Playfair Display',serif; color:${isDark ? '#f0c070' : '#3d1a0e'};`">
            ${{ total.toFixed(2) }}
          </span>
        </div>

        <!-- Checkout button -->
        <button
          class="w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all hover:shadow-lg active:scale-95"
          :style="isDark ? 'background:#f0c070; color:#3d1a0e; box-shadow: 0 4px 20px rgba(240,192,112,0.25);' : 'background:#7a4a2e; color:#f0c070; box-shadow: 0 4px 20px rgba(122,74,46,0.3);'"
        >
          Proceed to Checkout →
        </button>

        <!-- Clear cart -->
        <button
          @click="items.forEach(item => emit('remove', item.id))"
          class="w-full py-2 text-xs font-medium transition-colors"
          :style="`color:${isDark ? '#6b4226' : '#c4a882'};`"
        >
          Clear cart
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.cart-item-enter-active { transition: all 0.3s ease; }
.cart-item-leave-active { transition: all 0.2s ease; }
.cart-item-enter-from { opacity: 0; transform: translateX(20px); }
.cart-item-leave-to   { opacity: 0; transform: translateX(20px); height: 0; margin: 0; padding: 0; }
</style>

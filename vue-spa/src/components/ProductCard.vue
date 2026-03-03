<script setup lang="ts">
import type { Product } from '../type';

defineProps<{
  product: Product;
  isDark: boolean;
}>();
</script>

<template>
  <div :class="[
    'group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col',
    isDark
      ? 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:shadow-black/40'
      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-gray-200/60'
  ]">
    <!-- Image -->
    <div class="relative overflow-hidden bg-gray-50 h-48">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <!-- Discount badge -->
      <span
        v-if="product.discountPercentage >= 10"
        class="absolute top-2 left-2 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </span>
      <!-- Rating badge -->
      <span :class="[
        'absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1',
        isDark ? 'bg-gray-800/90 text-yellow-400' : 'bg-white/90 text-yellow-500'
      ]">
        ★ {{ product.rating.toFixed(1) }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1">
      <!-- Category -->
      <p class="text-[11px] uppercase tracking-widest font-medium mb-1"
         :class="isDark ? 'text-indigo-400' : 'text-indigo-500'">
        {{ product.category }}
      </p>

      <!-- Title -->
      <h3 class="text-sm font-semibold leading-snug line-clamp-2 mb-1 flex-1"
          :class="isDark ? 'text-white' : 'text-gray-900'">
        {{ product.title }}
      </h3>

      <!-- Brand -->
      <p class="text-xs mb-3" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
        {{ product.brand }}
      </p>

      <!-- Price + CTA -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            ${{ product.price.toFixed(2) }}
          </span>
          <span v-if="product.discountPercentage >= 10"
                class="ml-2 text-xs line-through"
                :class="isDark ? 'text-gray-600' : 'text-gray-400'">
            ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
          </span>
        </div>
        <button :class="[
          'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95',
          isDark
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md hover:shadow-indigo-500/30'
        ]">
          Add to Cart
        </button>
      </div>

      <!-- Stock indicator -->
      <div class="mt-3 flex items-center gap-1.5">
        <div :class="['w-1.5 h-1.5 rounded-full', product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400']"></div>
        <span class="text-[11px]" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          {{ product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock' }}
        </span>
      </div>
    </div>
  </div>
</template>
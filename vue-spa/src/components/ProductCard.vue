<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '../type';

const props = defineProps<{
  product: Product;
  isDark: boolean;
}>();

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void;
  (e: 'view-detail', product: Product): void;
}>();

const added = ref(false);

const handleAddToCart = (e: MouseEvent) => {
  e.stopPropagation(); // card click trigger වෙන්නේ නෑ
  emit('add-to-cart', props.product);
  added.value = true;
  setTimeout(() => { added.value = false; }, 1200);
};
</script>

<template>
  <!-- Whole card click → detail modal -->
  <div
    :class="[
      'group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col cursor-pointer',
      isDark
        ? 'bg-gray-900 border-gray-700 hover:border-amber-800 hover:shadow-black/60'
        : 'bg-white border-gray-100 hover:border-amber-200 hover:shadow-amber-100/60'
    ]"
    @click="emit('view-detail', product)"
  >
    <!-- Image -->
    <div :class="['relative overflow-hidden h-48', isDark ? 'bg-gray-800' : 'bg-gray-50']">
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
        isDark ? 'bg-gray-900/90 text-amber-400' : 'bg-white/90 text-amber-500'
      ]">
        ★ {{ product.rating.toFixed(1) }}
      </span>

      <!-- Hover overlay hint -->
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        :style="isDark ? 'background:rgba(0,0,0,0.45);' : 'background:rgba(61,26,14,0.35);'"
      >
        <span class="text-white text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border border-white/40">
          View Details
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1">
      <!-- Category -->
      <p class="text-[11px] uppercase tracking-widest font-medium mb-1"
         :class="isDark ? 'text-amber-500' : 'text-amber-700'">
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
          <span class="text-lg font-bold" :class="isDark ? 'text-amber-400' : 'text-gray-900'">
            ${{ product.price.toFixed(2) }}
          </span>
          <span
            v-if="product.discountPercentage >= 10"
            class="ml-2 text-xs line-through"
            :class="isDark ? 'text-gray-600' : 'text-gray-400'"
          >
            ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
          </span>
        </div>

        <!-- Add to Cart — stopPropagation so card click doesn't fire -->
        <button
          @click="handleAddToCart"
          :class="[
            'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95',
            added
              ? 'bg-emerald-600 text-white'
              : (isDark
                  ? 'bg-amber-600 hover:bg-amber-500 text-white hover:shadow-md hover:shadow-amber-600/30'
                  : 'bg-[#7a4a2e] hover:bg-[#5c3520] text-[#f0c070] hover:shadow-md hover:shadow-amber-900/30')
          ]"
        >
          {{ added ? '✓ Added' : 'Add to Cart' }}
        </button>
      </div>

      <!-- Stock indicator -->
      <div class="mt-3 flex items-center gap-1.5">
        <div :class="[
          'w-1.5 h-1.5 rounded-full',
          product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'
        ]"></div>
        <span class="text-[11px]" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
          {{ product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock' }}
        </span>
      </div>
    </div>
  </div>
</template>

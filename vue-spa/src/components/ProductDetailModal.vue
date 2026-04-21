<script setup lang="ts">
import type { Product } from '../type';

const props = defineProps<{
  product: Product | null;
  isDark: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'add-to-cart', product: Product): void;
}>();

import { ref, computed } from 'vue';

const quantity = ref(1);
const added = ref(false);

const originalPrice = computed(() => {
  if (!props.product) return 0;
  return props.product.price / (1 - props.product.discountPercentage / 100);
});

const handleAdd = () => {
  if (!props.product) return;
  for (let i = 0; i < quantity.value; i++) {
    emit('add-to-cart', props.product);
  }
  added.value = true;
  setTimeout(() => { added.value = false; }, 1500);
};

const stockStatus = computed(() => {
  if (!props.product) return { label: '', color: '' };
  if (props.product.stock > 10) return { label: 'In Stock', color: '#34d399' };
  if (props.product.stock > 0)  return { label: `Only ${props.product.stock} left`, color: '#fbbf24' };
  return { label: 'Out of Stock', color: '#f87171' };
});

const stars = computed(() => {
  if (!props.product) return [];
  return Array.from({ length: 5 }, (_, i) => i < Math.round(props.product!.rating));
});
</script>

<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="product"
      class="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
      @click="emit('close')"
    />
  </Transition>

  <!-- Modal -->
  <Transition name="modal-up">
    <div
      v-if="product"
      class="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none"
    >
      <div
        class="pointer-events-auto w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row transition-colors duration-300"
        :style="isDark
          ? 'background:#161616; border:1px solid #2a2a2a;'
          : 'background:#ffffff; border:1px solid #e8d5c0;'"
        @click.stop
      >
        <!-- Left — Image -->
        <div
          class="relative sm:w-2/5 h-64 sm:h-auto flex-shrink-0"
          :style="isDark ? 'background:#1e1e1e;' : 'background:#f5ede4;'"
        >
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="w-full h-full object-cover"
          />

          <!-- Discount badge -->
          <span
            v-if="product.discountPercentage >= 10"
            class="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-xl"
          >
            -{{ Math.round(product.discountPercentage) }}% OFF
          </span>

          <!-- Close button -->
          <button
            @click="emit('close')"
            class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-110 active:scale-95"
            :style="isDark ? 'background:rgba(0,0,0,0.6); color:#fff;' : 'background:rgba(255,255,255,0.85); color:#3d1a0e;'"
          >✕</button>
        </div>

        <!-- Right — Details -->
        <div class="flex-1 p-7 flex flex-col gap-4 overflow-y-auto" style="max-height:90vh;">

          <!-- Category + Brand -->
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span
              class="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              :style="isDark ? 'background:#2a1a08; color:#f0c070;' : 'background:#f5ede4; color:#7a4a2e;'"
            >{{ product.category }}</span>
            <span class="text-xs font-medium" :style="`color:${isDark ? '#666' : '#b0907a'};`">
              by {{ product.brand }}
            </span>
          </div>

          <!-- Title -->
          <h2
            :style="`font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:700; line-height:1.3; color:${isDark ? '#fff5e6' : '#3d1a0e'};`"
          >{{ product.title }}</h2>

          <!-- Stars + Rating -->
          <div class="flex items-center gap-2">
            <div class="flex gap-0.5">
              <span
                v-for="(full, i) in stars"
                :key="i"
                class="text-base"
                :style="`color:${full ? '#f59e0b' : (isDark ? '#333' : '#e5e7eb')};`"
              >★</span>
            </div>
            <span class="text-sm font-semibold" :style="`color:${isDark ? '#f0c070' : '#92400e'};`">
              {{ product.rating.toFixed(1) }}
            </span>
            <span class="text-xs" :style="`color:${isDark ? '#555' : '#c4a882'};`">/ 5.0</span>
          </div>

          <!-- Description -->
          <p
            class="text-sm leading-relaxed"
            :style="`color:${isDark ? '#9a8070' : '#7a6050'};`"
          >{{ product.description }}</p>

          <!-- Divider -->
          <div :style="`height:1px; background:${isDark ? '#2a2a2a' : '#ede0d4'};`"></div>

          <!-- Price -->
          <div class="flex items-end gap-3">
            <span
              :style="`font-family:'Playfair Display',serif; font-size:2rem; font-weight:700; color:${isDark ? '#f0c070' : '#3d1a0e'};`"
            >${{ product.price.toFixed(2) }}</span>
            <span
              v-if="product.discountPercentage >= 10"
              class="text-sm line-through mb-1"
              :style="`color:${isDark ? '#444' : '#c4a882'};`"
            >${{ originalPrice.toFixed(2) }}</span>
          </div>

          <!-- Stock status -->
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full"
              :style="`background:${stockStatus.color};`"
            ></div>
            <span class="text-xs font-semibold" :style="`color:${stockStatus.color};`">
              {{ stockStatus.label }}
            </span>
          </div>

          <!-- Quantity + Add to Cart -->
          <div class="flex items-center gap-3 mt-auto pt-2">
            <!-- Qty controls -->
            <div
              class="flex items-center gap-3 rounded-xl px-4 py-2 border"
              :style="isDark ? 'background:#1e1e1e; border-color:#3a3a3a;' : 'background:#f5ede4; border-color:#e0cdb8;'"
            >
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="text-lg font-bold w-6 h-6 flex items-center justify-center transition-all hover:scale-110 active:scale-95 rounded-full"
                :style="`color:${isDark ? '#f0c070' : '#7a4a2e'};`"
              >−</button>
              <span
                class="text-sm font-bold min-w-[1.5rem] text-center"
                :style="`color:${isDark ? '#fff' : '#3d1a0e'};`"
              >{{ quantity }}</span>
              <button
                @click="quantity++"
                class="text-lg font-bold w-6 h-6 flex items-center justify-center transition-all hover:scale-110 active:scale-95 rounded-full"
                :style="`color:${isDark ? '#f0c070' : '#7a4a2e'};`"
              >+</button>
            </div>

            <!-- Add to Cart -->
            <button
              @click="handleAdd"
              class="flex-1 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-lg active:scale-95"
              :style="added
                ? 'background:#059669; color:#fff;'
                : (isDark
                    ? 'background:#f0c070; color:#3d1a0e; box-shadow:0 4px 20px rgba(240,192,112,0.2);'
                    : 'background:#7a4a2e; color:#f0c070; box-shadow:0 4px 20px rgba(122,74,46,0.25);')"
            >
              {{ added ? '✓ Added to Cart!' : `Add ${quantity > 1 ? quantity + ' items' : 'to Cart'}` }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-up-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-up-leave-active { transition: all 0.2s ease; }
.modal-up-enter-from  { opacity: 0; transform: scale(0.94) translateY(20px); }
.modal-up-leave-to    { opacity: 0; transform: scale(0.96) translateY(10px); }
</style>

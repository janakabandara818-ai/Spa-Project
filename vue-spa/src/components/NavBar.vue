<script setup lang="ts">
defineProps<{ isDark: boolean }>();
const emit = defineEmits<{ (e: 'toggle-dark'): void }>();
</script>

<template>
  <nav :class="[
    'sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b backdrop-blur-md transition-colors duration-300',
    isDark
      ? 'bg-gray-950/90 border-gray-800 text-white'
      : 'bg-white/90 border-gray-100 text-gray-900'
  ]">
    <!-- Logo -->
    <h1 class="text-xl font-semibold tracking-tight"
        style="font-family: 'Playfair Display', serif;">
      <span class="text-indigo-500">Nexus</span>Shop
    </h1>

    <!-- Search -->
    <div class="relative hidden sm:block">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        type="text"
        placeholder="Search products..."
        :class="[
          'pl-9 pr-4 py-2 rounded-xl text-sm w-64 border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500',
          isDark
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
        ]"
      />
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <!-- Dark mode toggle -->
      <button
        @click="emit('toggle-dark')"
        :class="[
          'w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95',
          isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
        ]"
        :title="isDark ? 'Light mode' : 'Dark mode'"
      >
        {{ isDark ? '☀️' : '🌙' }}
      </button>

      <!-- Cart -->
      <button :class="[
        'w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 relative',
        isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
      ]">
        🛒
        <span class="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          3
        </span>
      </button>

      <!-- Login -->
      <button class="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95">
        Login
      </button>
    </div>
  </nav>
</template>
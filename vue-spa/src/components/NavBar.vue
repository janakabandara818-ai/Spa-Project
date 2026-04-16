<script setup lang="ts">
defineProps<{ isDark: boolean }>();
const emit = defineEmits<{
  (e: 'toggle-dark'): void;
  (e: 'open-login'): void;
}>();
</script>

<template>
  <nav :class="[
    'sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b backdrop-blur-md transition-colors duration-300',
    isDark
      ? 'bg-gray-950/90 border-gray-800 text-white'
      : 'bg-[#3d2b1f]/95 border-[#5a3e2b] text-white'
  ]">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <div class="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-5 h-5">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.73V7.5l6.5 4.5H16v1h-1v-1H9v1H8v-1H4.5L11 7.5V5.73A2 2 0 0 1 12 2z"/>
          <path d="M3 18h18v2H3z"/>
          <path d="M2 13l3 3 3.5-4L12 16l3.5-4L19 15l3-2-1 5H3l-1-5z"/>
        </svg>
      </div>
      <h1 style="font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; letter-spacing: -0.5px; line-height: 1;">
        <span class="text-amber-400">Golden</span><span class="text-white"> Crest</span>
      </h1>
    </div>

    <!-- Search -->
    <div class="relative hidden sm:block">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        type="text"
        placeholder="Search products..."
        :class="[
          'pl-9 pr-4 py-2 rounded-xl text-sm w-64 border transition-all focus:outline-none focus:ring-2 focus:ring-amber-500',
          isDark
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-[#2e1f14] border-[#5a3e2b] text-white placeholder-gray-400'
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
          isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-[#2e1f14] hover:bg-[#4a3020]'
        ]"
        :title="isDark ? 'Light mode' : 'Dark mode'"
      >
        {{ isDark ? '☀️' : '🌙' }}
      </button>

      <!-- Cart -->
      <button :class="[
        'w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 active:scale-95 relative',
        isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-[#2e1f14] hover:bg-[#4a3020]'
      ]">
        🛒
        <span class="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          3
        </span>
      </button>

      <!-- Login -->
      <button
        @click="emit('open-login')"
        class="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/25 active:scale-95"
      >
        Login
      </button>
    </div>
  </nav>
</template>

<template>
  <footer class="mt-auto border-t border-gray-200 bg-white py-6 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
    <div class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
      <div class="text-sm text-gray-500 dark:text-gray-400">© {{ year }} 米情局 (miqingju.com)</div>
      <div class="flex items-center gap-4">
        <NuxtLink to="/about" class="text-sm text-gray-500 transition-colors hover:text-brand-500">关于我们</NuxtLink>
        <a
          href="https://t.me/miqingju"
          target="_blank"
          class="text-sm text-gray-500 transition-colors hover:text-brand-500"
        >
          Telegram
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>


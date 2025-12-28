<template>
  <header
    class="sticky top-0 z-50 border-b border-gray-200 bg-white/75 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/75"
  >
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="group flex select-none items-center gap-2">
          <span class="text-xl font-bold text-gray-900 transition-colors group-hover:text-brand-500 dark:text-white">米情局</span>
          <span class="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <span class="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">域名界的中情局</span>
        </NuxtLink>
      </div>

      <nav class="flex items-center gap-2 sm:gap-6">
        <NuxtLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="text-sm font-medium text-gray-600 transition-colors hover:text-brand-500 dark:text-gray-300"
          active-class="!text-brand-500 font-bold"
        >
          {{ link.name }}
        </NuxtLink>
        <div class="mx-2 hidden h-4 w-px bg-gray-300 dark:bg-gray-700 sm:block" />
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const links = [
  { name: '价格查询', path: '/' },
  { name: '系统状态', path: '/status' },
  { name: '关于我们', path: '/about' }
]
</script>


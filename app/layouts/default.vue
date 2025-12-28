<template>
  <div class="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 selection:bg-brand-500/30 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
    <Navbar />
    <main class="w-full flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  srcDir: 'app',
  serverDir: 'server',
  typescript: {
    strict: true
  },
  modules: [
    '@nuxt/ui',
    '@vueuse/motion/nuxt'
  ],
  app: {
    head: {
      title: '米情局 - 域名界的中情局',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})

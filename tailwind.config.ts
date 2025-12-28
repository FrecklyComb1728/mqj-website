import type { Config } from 'tailwindcss'

const config = {
  darkMode: 'class',
  content: [
    './app/app.vue',
    './app/error.vue',
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2fbff',
          100: '#e6f7ff',
          200: '#bfecff',
          300: '#99e1ff',
          400: '#8ee3ff',
          500: '#4dccff',
          600: '#00b3ff',
          700: '#008fb3',
          800: '#006b86',
          900: '#004759',
          950: '#002e3a'
        }
      }
    }
  }
} satisfies Config

export default config

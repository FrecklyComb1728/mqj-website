<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
      color="gray"
      variant="ghost"
      size="sm"
      class="h-8 w-8 !p-0"
      :aria-label="isDark ? '切换到浅色' : '切换到深色'"
      @click="toggle($event)"
    />
    <template #fallback>
      <div class="h-8 w-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useColorMode, usePreferredDark } from '@vueuse/core'

const mode = useColorMode({
  selector: 'html',
  attribute: 'class',
  storageKey: 'tld-color-mode',
  initialValue: 'auto'
})

const preferredDark = usePreferredDark()

const isDark = computed({
  get: () => mode.value === 'dark' || (mode.value === 'auto' && preferredDark.value),
  set: (v) => (mode.value = v ? 'dark' : 'light')
})

const toggle = (event?: MouseEvent) => {
  const startViewTransition = (document as unknown as {
    startViewTransition?: (callback: () => Promise<void> | void) => { ready: Promise<void> }
  }).startViewTransition

  const isAppearanceTransition =
    typeof startViewTransition === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const transition = startViewTransition.call(document, async () => {
    isDark.value = !isDark.value
    await nextTick()
  })

  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}
</script>

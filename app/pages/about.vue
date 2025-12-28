<template>
  <div class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-900/40" />
      <div class="absolute -right-28 top-24 h-80 w-80 rounded-full bg-blue-200/35 blur-3xl dark:bg-blue-900/35" />
      <div class="absolute -bottom-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/30" />
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="mx-auto max-w-5xl">
        <section
          v-motion-fade
          :initial="{ opacity: 0, y: 18 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 520, type: 'cubic-bezier', ease: [0.25, 1, 0.5, 1] } }"
          class="relative rounded-2xl border border-gray-100 bg-white/70 p-8 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/60"
        >
          <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <div
                class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-xs font-medium text-gray-600 backdrop-blur dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-brand-500" />
                miqingju.com
              </div>
              <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                关于
                <span
                  class="bg-gradient-to-r from-brand-500 via-sky-500 to-purple-500 bg-clip-text text-transparent"
                >
                  米情局
                </span>
              </h1>
              <p class="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                聚合多家注册商价格，帮你快速对比、直观选价，把“查价”变成一个更顺手的决策动作。
              </p>

              <div class="mt-5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
                  <UIcon name="i-heroicons-currency-yen" class="h-4 w-4" />
                  多币种展示
                </div>
                <div class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
                  <UIcon name="i-heroicons-adjustments-horizontal" class="h-4 w-4" />
                  智能排序
                </div>
                <div class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
                  <UIcon name="i-heroicons-shield-check" class="h-4 w-4" />
                  状态监控
                </div>
              </div>
            </div>

            <div class="flex shrink-0 flex-col gap-2 sm:items-end">
              <UButton
                color="primary"
                size="md"
                icon="i-heroicons-chat-bubble-left-right"
                to="https://t.me/miqingju"
                target="_blank"
                class="font-semibold"
              >
                加入 Telegram
              </UButton>
              <UButton
                color="gray"
                variant="ghost"
                size="md"
                icon="i-heroicons-signal"
                to="/status"
              >
                查看系统状态
              </UButton>
            </div>
          </div>
        </section>

        <section class="mt-10" v-motion-slide-visible-bottom :delay="80">
          <div class="flex items-end justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">我们做什么</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">保持信息密度，减少打扰，让你更快得到可用结论。</p>
            </div>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="item in features"
              :key="item.title"
              class="group rounded-xl border border-gray-100 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-brand-800"
            >
              <div class="flex items-center justify-between">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-brand-50 group-hover:text-brand-700 dark:bg-gray-800/70 dark:text-gray-200 dark:group-hover:bg-brand-900/20 dark:group-hover:text-brand-200"
                >
                  <UIcon :name="item.icon" class="h-5 w-5" />
                </div>
                <div class="h-6 w-6 rounded-full bg-gray-100/60 opacity-0 blur-sm transition-opacity group-hover:opacity-100 dark:bg-gray-800/60" />
              </div>
              <div class="mt-4 text-sm font-bold text-gray-900 dark:text-white">{{ item.title }}</div>
              <div class="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{{ item.desc }}</div>
            </div>
          </div>
        </section>

        <section class="mt-10" v-motion-slide-visible-bottom :delay="140">
          <div class="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-0">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">交流与反馈</h2>
                <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  有想加的注册商、币种或排序维度，直接在群里抛需求，迭代会更快。
                </p>
                <div class="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
                  <UIcon name="i-heroicons-link" class="h-4 w-4" />
                  https://t.me/miqingju
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-arrow-top-right-on-square"
                  to="https://t.me/miqingju"
                  target="_blank"
                  class="font-semibold"
                >
                  打开链接
                </UButton>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-10" v-motion-slide-visible-bottom :delay="200">
          <details class="group rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur open:shadow-md dark:border-gray-800 dark:bg-gray-900/60">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800/70 dark:text-gray-200">
                  <UIcon name="i-heroicons-shield-exclamation" class="h-5 w-5" />
                </div>
                <div>
                  <div class="text-sm font-bold text-gray-900 dark:text-white">免责声明</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">价格信息仅供参考，以注册商官网为准</div>
                </div>
              </div>
              <UIcon
                name="i-heroicons-chevron-down"
                class="h-5 w-5 text-gray-400 transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <div class="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              本平台提供的价格信息仅供参考，实际价格以各注册商官网为准。我们努力确保数据的准确性与及时性，但不对因使用本平台信息而产生的任何损失承担责任。在进行域名注册前，请务必到相关注册商官网确认最新价格和政策。
            </div>
          </details>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '关于我们'
})

type Feature = {
  icon: string
  title: string
  desc: string
}

const features: Feature[] = [
  { icon: 'i-heroicons-chart-bar', title: '实时价格对比', desc: '聚合多家注册商，少走弯路。' },
  { icon: 'i-heroicons-currency-yen', title: '多币种显示', desc: '原币种 + 参考 CNY，一眼读懂。' },
  { icon: 'i-heroicons-adjustments-horizontal', title: '智能排序', desc: '按注册/续费/转入维度快速筛选。' },
  { icon: 'i-heroicons-signal', title: '系统状态', desc: '监控与日志，让数据更可依赖。' }
]
</script>


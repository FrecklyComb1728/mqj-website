<template>
  <div class="container mx-auto space-y-8 px-4 py-8">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3" v-motion-slide-visible-bottom>
      <div
        class="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-800"
      >
        <div class="rounded-full bg-brand-50 p-3 text-brand-500 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-900/20">
          <UIcon name="i-heroicons-chart-bar" class="h-8 w-8" />
        </div>
        <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.data?.total_prices || '-' }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">价格数据</span>
      </div>

      <div
        class="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-800"
      >
        <div class="rounded-full bg-blue-50 p-3 text-blue-500 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-900/20">
          <UIcon name="i-heroicons-building-office-2" class="h-8 w-8" />
        </div>
        <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.data?.total_registrars || '-' }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">注册商</span>
      </div>

      <div
        class="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-800"
      >
        <div class="rounded-full bg-purple-50 p-3 text-purple-500 transition-transform duration-300 group-hover:scale-110 dark:bg-purple-900/20">
          <UIcon name="i-heroicons-globe-alt" class="h-8 w-8" />
        </div>
        <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.data?.total_tlds || '-' }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">支持后缀</span>
      </div>
    </div>

    <div class="mx-auto max-w-2xl" v-motion-slide-visible-bottom :delay="100">
      <div class="flex gap-2">
        <UInput
          v-model="searchInput"
          icon="i-heroicons-magnifying-glass"
          placeholder="输入域名后缀，例如 com"
          size="xl"
          class="flex-1"
          :ui="{ icon: { trailing: { pointer: '' } } }"
          @keydown.enter="handleSearch"
        >
        </UInput>
        <UButton
          size="xl"
          color="primary"
          class="px-8 font-bold"
          :loading="isFetching"
          :disabled="isFetching"
          @click="handleSearch"
        >
          查询价格
        </UButton>
      </div>

      <div class="mt-2 flex h-5 items-center justify-center">
        <div v-if="isFetching" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div class="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
          正在查询 .{{ tld }} 的价格
        </div>
      </div>

      <div class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        大家都在搜：
        <span class="mx-1 cursor-pointer transition-colors hover:text-brand-500">.com</span>
        <span class="mx-1 cursor-pointer transition-colors hover:text-brand-500">.net</span>
        <span class="mx-1 cursor-pointer transition-colors hover:text-brand-500">.io</span>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      v-motion-slide-visible-bottom
      :delay="200"
    >
      <div class="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
        <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <span class="text-brand-500">.{{ tld }}</span>
          价格列表
        </h2>
        <div v-if="pricesData?.data" class="text-sm text-gray-500">共 {{ displayRows.length }} 个注册商</div>
      </div>

      <div v-if="isFetching" class="h-1 w-full bg-gray-100 dark:bg-gray-800">
        <div class="h-full w-1/2 animate-pulse bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
      </div>

      <UTable
        :rows="displayRows"
        :columns="columns"
        :loading="status === 'pending'"
        :sort="sort"
        sort-mode="manual"
        :ui="{
          th: { base: 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium' },
          td: { base: 'whitespace-nowrap align-top' },
          tr: { base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors' }
        }"
        @update:sort="sort = $event"
      >
        <template #registrar-data="{ row, index }">
          <div class="flex items-center gap-3">
            <div v-if="getRankStyle(index)" class="flex items-center gap-2">
              <span class="h-6 w-1 rounded-full" :class="getRankStyle(index)?.bar" />
              <span
                class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                :class="getRankStyle(index)?.badge"
              >
                {{ index + 1 }}
              </span>
            </div>
            <UAvatar
              :src="row?.registrar?.website ? getFaviconSrc(row.registrar.website) : undefined"
              :alt="row?.registrar?.name || ''"
              :text="row?.registrar?.name?.slice(0, 1) || ''"
              size="sm"
              class="bg-white"
            />
            <span class="font-medium text-gray-900 dark:text-white">{{ row?.registrar?.name || '-' }}</span>
          </div>
        </template>

        <template #price_first_year-data="{ row, index }">
          <div class="flex flex-col leading-tight">
            <div :class="getRankStyle(index)?.price">{{ getPriceDisplay(row, 'price_first_year').primary }}</div>
            <div v-if="getPriceDisplay(row, 'price_first_year').secondary" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ getPriceDisplay(row, 'price_first_year').secondary }}
            </div>
          </div>
        </template>

        <template #price_renewal-data="{ row, index }">
          <div class="flex flex-col leading-tight">
            <div :class="getRankStyle(index)?.price">{{ getPriceDisplay(row, 'price_renewal').primary }}</div>
            <div v-if="getPriceDisplay(row, 'price_renewal').secondary" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ getPriceDisplay(row, 'price_renewal').secondary }}
            </div>
          </div>
        </template>

        <template #price_transfer-data="{ row, index }">
          <div class="flex flex-col leading-tight">
            <div :class="getRankStyle(index)?.price">{{ getPriceDisplay(row, 'price_transfer').primary }}</div>
            <div v-if="getPriceDisplay(row, 'price_transfer').secondary" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ getPriceDisplay(row, 'price_transfer').secondary }}
            </div>
          </div>
        </template>

        <template #action-data="{ row }">
          <div class="flex justify-end">
            <UButton
              size="xs"
              color="gray"
              variant="ghost"
              :to="row?.registrar?.website"
              target="_blank"
              class="hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 dark:hover:text-brand-400"
            >
              前往官网
            </UButton>
          </div>
        </template>
      </UTable>

      <div v-if="isEmpty" class="p-8 text-center text-gray-500">
        <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center opacity-50">
          <UIcon name="i-heroicons-face-frown" class="h-12 w-12" />
        </div>
        暂无该后缀的价格数据
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type SortDirection = 'asc' | 'desc'

type TableSort = {
  column: string
  direction: SortDirection
}

type Registrar = {
  name?: string
  website?: string
}

type PriceRow = {
  registrar?: Registrar
  currency?: string
  price_first_year?: number
  price_first_year_cny?: number
  price_renewal?: number
  price_renewal_cny?: number
  price_transfer?: number
  price_transfer_cny?: number
  class?: string
}

type ApiEnvelope<T> = {
  data?: T
  timestamp?: string
}

type StatsData = {
  total_prices?: number
  total_registrars?: number
  total_tlds?: number
}

useHead({
  title: '价格查询'
})

const route = useRoute()
const router = useRouter()

const tld = ref(String(route.query.tld || ''))
const searchInput = ref(tld.value)
const sort = ref<TableSort>({ column: 'price_first_year', direction: 'asc' })

watch(
  () => String(route.query.tld || ''),
  (next) => {
    const normalized = (next || 'com').trim().toLowerCase().replace(/^\./, '')
    if (!normalized || normalized === tld.value) return
    tld.value = normalized
    searchInput.value = normalized
  }
)

const { data: stats } = useLazyFetch<ApiEnvelope<StatsData>>('/api/status')

const { data: pricesData, status, refresh } = useLazyFetch<ApiEnvelope<PriceRow[]>>(
  '/api/prices',
  {
    query: computed(() => ({
      tld: tld.value,
      page_size: 100
    })),
    watch: [tld]
  }
)

const sortedRows = computed<PriceRow[]>(() => {
  const rows = pricesData.value?.data || []
  const column = sort.value.column
  const direction = sort.value.direction

  const cnyKeyByColumn: Record<string, keyof PriceRow> = {
    price_first_year: 'price_first_year_cny',
    price_renewal: 'price_renewal_cny',
    price_transfer: 'price_transfer_cny'
  }

  const cnyKey = cnyKeyByColumn[column]
  if (!cnyKey) return rows

  const factor = direction === 'asc' ? 1 : -1

  return rows
    .slice()
    .sort((a, b) => {
      const av = a[cnyKey]
      const bv = b[cnyKey]

      const aNum = typeof av === 'number' ? av : null
      const bNum = typeof bv === 'number' ? bv : null

      if (aNum === null && bNum === null) return 0
      if (aNum === null) return 1
      if (bNum === null) return -1

      if (aNum === bNum) return 0
      return (aNum < bNum ? -1 : 1) * factor
    })
})

const displayRows = computed<PriceRow[]>(() => {
  return sortedRows.value.map((row, index) => {
    const isTop = index < 3
    return {
      ...row,
      class: isTop ? 'bg-brand-50/40 dark:bg-brand-900/10' : ''
    }
  })
})

const isFetching = computed(() => status.value === 'pending')
const isEmpty = computed(() => !isFetching.value && (displayRows.value.length || 0) === 0)

const handleSearch = () => {
  const nextTld = searchInput.value.trim().toLowerCase().replace(/^\./, '')
  if (!nextTld) return

  searchInput.value = nextTld

  const current = String(route.query.tld || '').trim().toLowerCase().replace(/^\./, '')
  if (nextTld === current) {
    refresh()
    return
  }

  router.push({ query: { ...route.query, tld: nextTld } })
}

const columns = [
  { key: 'registrar', label: '注册商', class: 'text-left' },
  { key: 'price_first_year', label: '注册价格', sortable: true, class: 'text-left' },
  { key: 'price_renewal', label: '续费价格', sortable: true, class: 'text-left' },
  { key: 'price_transfer', label: '转入价格', sortable: true, class: 'text-left' },
  { key: 'action', label: '操作', class: 'text-right' }
]

const cnyFieldByKey = {
  price_first_year: 'price_first_year_cny',
  price_renewal: 'price_renewal_cny',
  price_transfer: 'price_transfer_cny'
} as const

type PriceKey = keyof typeof cnyFieldByKey

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(amount)
}

const formatPrimaryPrice = (amount: number, currency?: string) => {
  const c = String(currency || '').toUpperCase()
  return c === 'CNY' ? `${formatAmount(amount)} 元` : `${formatAmount(amount)} ${c || '-'}`
}

const getPriceDisplay = (row: PriceRow, key: PriceKey) => {
  const amount = row[key]
  const currency = String(row.currency || '').toUpperCase()
  if (typeof amount !== 'number') return { primary: '-', secondary: '' }
  const cnyKey = cnyFieldByKey[key]
  const cnyValue = row[cnyKey]
  const secondary = currency !== 'CNY' && typeof cnyValue === 'number' ? `≈ ${formatAmount(cnyValue)} 元` : ''
  return { primary: formatPrimaryPrice(amount, currency), secondary }
}

const getFaviconSrc = (website: string) => {
  return `https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(website)}&size=128`
}

const rankStyles = [
  {
    bar: 'bg-brand-500',
    badge:
      'bg-brand-500/10 text-brand-700 ring-1 ring-inset ring-brand-200/70 dark:bg-brand-400/10 dark:text-brand-200 dark:ring-brand-800/40',
    price: 'text-brand-700 dark:text-brand-200 font-semibold'
  },
  {
    bar: 'bg-blue-500',
    badge:
      'bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-200/70 dark:bg-blue-400/10 dark:text-blue-200 dark:ring-blue-800/40',
    price: 'text-blue-700 dark:text-blue-200 font-semibold'
  },
  {
    bar: 'bg-purple-500',
    badge:
      'bg-purple-500/10 text-purple-700 ring-1 ring-inset ring-purple-200/70 dark:bg-purple-400/10 dark:text-purple-200 dark:ring-purple-800/40',
    price: 'text-purple-700 dark:text-purple-200 font-semibold'
  }
]

type RankStyle = (typeof rankStyles)[number]

const getRankStyle = (index: number): RankStyle | null => {
  return index >= 0 && index < rankStyles.length ? rankStyles[index]! : null
}
</script>

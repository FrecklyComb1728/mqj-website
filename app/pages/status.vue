<template>
  <div class="container mx-auto space-y-8 px-4 py-8">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" v-motion-slide-visible-bottom>
      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">总注册商</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statsData?.data?.total_registrars || 0 }}</div>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">正常运行</div>
        <div class="text-2xl font-bold text-green-500">{{ refreshedTodayCount }}</div>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">异常/警告</div>
        <div class="text-2xl font-bold text-yellow-500">{{ (statsData?.data?.total_registrars || 0) - refreshedTodayCount }}</div>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-1 text-sm text-gray-500 dark:text-gray-400">今日刷新</div>
        <div class="text-2xl font-bold text-brand-500">{{ refreshedTodayCount }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div
        class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2"
        v-motion-slide-visible-bottom
        :delay="100"
      >
        <div class="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">注册商状态</h2>
          <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" @click="refreshStats" />
        </div>

        <UTable
          :rows="registrarRows"
          :columns="registrarColumns"
          :ui="{ th: { base: 'bg-gray-50 dark:bg-gray-800/50' } }"
        >
          <template #registrar-data="{ row }">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="row.website ? getFaviconSrc(row.website) : undefined"
                :alt="row.name"
                :text="row.name.slice(0, 1)"
                size="sm"
                class="bg-white"
              />
              <div class="min-w-0">
                <div class="truncate font-medium text-gray-900 dark:text-white">{{ row.name }}</div>
                <div v-if="row.website" class="truncate text-xs text-gray-400">{{ row.website }}</div>
              </div>
            </div>
          </template>

          <template #crawl_stats-data="{ row }">
            <div class="space-y-1 text-xs">
              <div :class="row.refreshed_today ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ row.refreshed_today ? '今日已刷新' : '今日刷新失败' }}
              </div>
              <div class="text-gray-500 dark:text-gray-400">{{ row.last_crawl_at || '-' }}</div>
            </div>
          </template>

          <template #status-data="{ row }">
            <UBadge :color="getStatusColor(row.status)" variant="subtle" size="xs">{{ row.status_text }}</UBadge>
          </template>

          <template #actions-data="{ row }">
            <UButton
              size="xs"
              color="gray"
              variant="ghost"
              icon="i-heroicons-document-text"
              @click="openLogs(row)"
            >
              日志
            </UButton>
          </template>
        </UTable>
      </div>

      <div
        class="flex h-[600px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        v-motion-slide-visible-bottom
        :delay="200"
      >
        <div class="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">问题日志</h2>
          <span class="text-xs text-gray-500">最近20条</span>
        </div>

        <div class="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
          <div
            v-for="(log, index) in problemLogs?.data || []"
            :key="`${log.id}-${index}`"
            class="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div class="mb-1 flex items-start justify-between">
              <span class="font-bold text-gray-900 dark:text-white">{{ log.registrar }}</span>
              <span class="text-xs text-gray-400">{{ log.created_at }}</span>
            </div>
            <div class="mb-1 text-xs font-medium uppercase" :class="getLogColor(log.type)">{{ log.type }}</div>
            <p class="break-all text-gray-600 dark:text-gray-300">{{ log.message }}</p>
          </div>

          <div v-if="!(problemLogs?.data?.length || 0)" class="py-8 text-center text-gray-500">暂无异常日志</div>
        </div>
      </div>
    </div>

    <UModal v-model="isLogModalOpen" :ui="{ width: 'sm:max-w-4xl' }">
      <div class="p-6">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedRegistrar?.name }} - 详细日志</h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="isLogModalOpen = false" />
        </div>

        <div class="custom-scrollbar max-h-[60vh] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <UTable
            :rows="modalLogRows"
            :loading="logsStatus === 'pending'"
            :columns="[
              { key: 'created_at', label: '时间' },
              { key: 'type', label: '类型' },
              { key: 'message', label: '内容' }
            ]"
          >
            <template #type-data="{ row }">
              <span :class="getLogColor(row.type)">{{ row.type }}</span>
            </template>
            <template #message-data="{ row }">
              <span class="whitespace-pre-wrap break-all">{{ row.message }}</span>
            </template>
          </UTable>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '系统状态'
})

type ApiEnvelope<T> = {
  data?: T
  timestamp?: string
}

type Registrar = {
  name: string
  website?: string
  refreshed_today?: boolean
  last_updated?: string
  last_crawl_at?: string
  price_count?: number
}

type StatusData = {
  total_registrars?: number
  registrars?: Registrar[]
}

type RegistrarRow = Registrar & {
  status: 'normal' | 'error' | 'unknown'
  status_text: string
}

type LogItem = {
  id: string | number
  created_at: string
  registrar: string
  type: string
  message: string
}

const getFaviconSrc = (website: string) => {
  return `https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(website)}&size=128`
}

const { data: statsData, refresh: refreshStats } = useLazyFetch<ApiEnvelope<StatusData>>('/api/status')

const registrarRows = computed<RegistrarRow[]>(() => {
  const registrars = statsData.value?.data?.registrars || []
  return registrars.map((r) => {
    const refreshed = !!r.refreshed_today
    return {
      ...r,
      status: refreshed ? 'normal' : 'error',
      status_text: refreshed ? '正常' : '异常'
    }
  })
})

const refreshedTodayCount = computed(() => registrarRows.value.filter((r) => r.refreshed_today).length)

const { data: problemLogs } = useLazyFetch<ApiEnvelope<LogItem[]>>(
  '/api/logs',
  {
    query: { problems_only: 'true', page_size: 20 }
  }
)

const isLogModalOpen = ref(false)
const selectedRegistrar = ref<RegistrarRow | null>(null)

const { data: registrarLogs, status: logsStatus, execute: fetchRegistrarLogs } = useLazyFetch<ApiEnvelope<LogItem[]>>(
  '/api/logs',
  {
    immediate: false,
    query: computed(() => ({
      registrar: selectedRegistrar.value?.name,
      problems_only: 'false',
      page_size: 50,
      page: 1
    }))
  }
)

const modalLogRows = computed(() => {
  const logs = registrarLogs.value?.data || []
  const name = selectedRegistrar.value?.name
  if (!name) return logs
  const filtered = logs.filter((l) => l.registrar === name)
  return filtered.length ? filtered : logs
})

const openLogs = async (registrar: RegistrarRow) => {
  selectedRegistrar.value = registrar
  isLogModalOpen.value = true
  await fetchRegistrarLogs()
}

const registrarColumns = [
  { key: 'registrar', label: '注册商' },
  { key: 'price_count', label: '价格记录数', sortable: true },
  { key: 'last_updated', label: '最后更新', sortable: true },
  { key: 'crawl_stats', label: '最近爬取' },
  { key: 'status', label: '状态', sortable: true },
  { key: 'actions', label: '操作' }
]

const getStatusColor = (status: RegistrarRow['status'] | string | undefined) => {
  switch (String(status || '').toLowerCase()) {
    case 'normal':
      return 'green'
    case 'error':
      return 'red'
    default:
      return 'gray'
  }
}

const getLogColor = (type: string | undefined) => {
  switch (String(type || '').toLowerCase()) {
    case 'success':
      return 'text-green-500'
    case 'warning':
      return 'text-yellow-500'
    case 'error':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  --tw-bg-opacity: 1;
  background-color: rgb(var(--color-gray-200) / var(--tw-bg-opacity, 1));
}

.custom-scrollbar:is(.dark *)::-webkit-scrollbar-thumb {
  --tw-bg-opacity: 1;
  background-color: rgb(var(--color-gray-700) / var(--tw-bg-opacity, 1));
}
</style>


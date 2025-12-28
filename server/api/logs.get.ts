export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { page, page_size, registrar, problems_only } = query

  const params = new URLSearchParams()
  if (page) params.append('page', String(page))
  if (page_size) params.append('page_size', String(page_size))
  params.append('type', 'crawler')
  if (typeof problems_only === 'string') {
    params.append('problems_only', problems_only)
  } else {
    params.append('problems_only', 'true')
  }

  if (registrar) {
    params.append('provider_name', String(registrar))
  }

  try {
    const data: any = await fetch404(`/logs?${params.toString()}`, {}, event)

    if (data?.data) {
      data.data = data.data.map((log: any) => {
        const createdAt = formatDate(log.CreatedAt || log.created_at)
        const updatedAt = formatDate(log.UpdatedAt || log.updated_at)

        return {
          id: log.ID ?? log.id,
          created_at: createdAt,
          updated_at: updatedAt,
          registrar: log.provider_name ?? log.registrar,
          type: log.status ?? log.type,
          message: log.message,
          records_found: log.records_found,
          duration: log.duration
        }
      })
    }
    
    if (data?.timestamp) {
      data.timestamp = formatDate(data.timestamp)
    }

    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message
    })
  }
})

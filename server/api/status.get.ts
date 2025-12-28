export default defineEventHandler(async (event) => {
  try {
    const data: any = await fetch404('/stats', {}, event)

    if (data?.data?.registrars) {
      data.data.registrars = data.data.registrars.map((registrar: any) => {
        const website = String(registrar.website || '')
          .replace(/`/g, '')
          .trim()

        return {
          ...registrar,
          website,
          last_updated: formatDate(registrar.last_updated),
          last_crawl_at: formatDate(registrar.last_crawl_at)
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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { tld, sort, order, page, page_size } = query

  const params = new URLSearchParams()
  if (tld) params.append('tld', String(tld))
  if (sort) params.append('sort', String(sort))
  if (order) params.append('order', String(order))
  if (page) params.append('page', String(page))
  if (page_size) params.append('page_size', String(page_size))

  try {
    const data: any = await fetch404(`/prices?${params.toString()}`, {}, event)
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message
    })
  }
})

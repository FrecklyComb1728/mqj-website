export const fetch404 = async <T>(path: string, options: any = {}, event?: any): Promise<T> => {
  const payload = await getAltchaPayload()
  
  const headers = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    priority: 'u=1, i',
    'x-altcha-payload': payload,
    Referer: 'https://miqingju.com/',
    ...options.headers
  }

  const startedAt = Date.now()

  let res: Response
  try {
    res = await fetch(`https://api.404.name/api/v1${path}`, {
      ...options,
      headers
    })
  } catch (error: any) {
    const durationMs = Date.now() - startedAt
    if (event) {
      if (!Array.isArray(event.context?.upstream_calls)) event.context.upstream_calls = []
      event.context.upstream_calls.push({
        path,
        status: 0,
        duration_ms: durationMs,
        ok: false
      })
    }
    throw error
  }

  const durationMs = Date.now() - startedAt
  if (event) {
    if (!Array.isArray(event.context?.upstream_calls)) event.context.upstream_calls = []
    event.context.upstream_calls.push({
      path,
      status: res.status,
      duration_ms: durationMs,
      ok: res.ok
    })
  }

  if (!res.ok) {
    const text = await res.text()
    throw createError({
      statusCode: res.status,
      statusMessage: res.statusText,
      message: text
    })
  }

  return await res.json()
}

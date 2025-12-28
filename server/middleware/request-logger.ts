const pad = (n: number) => String(n).padStart(2, '0')

const formatTimeLocal = (date: Date) => {
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${y}/${m}/${d} ${hh}:${mm}:${ss}`
}

const toByteLength = (chunk: any, encoding?: any) => {
  if (!chunk) return 0
  if (typeof chunk === 'string') return Buffer.byteLength(chunk, encoding)
  if (Buffer.isBuffer(chunk)) return chunk.length
  if (ArrayBuffer.isView(chunk)) return chunk.byteLength
  return 0
}

const isLogEnabled = () => {
  const level = String(process.env.LOG_LEVEL || 'info').toLowerCase()
  return level !== 'silent' && level !== 'off' && level !== 'none'
}

export default defineEventHandler((event) => {
  if (!isLogEnabled()) return

  const req = event.node.req
  const res = event.node.res

  const startNs = process.hrtime.bigint()
  const startedAt = new Date()

  let bytesSent = 0

  const originalWrite = res.write.bind(res)
  const originalEnd = res.end.bind(res)

  ;(res as any).write = (chunk: any, encoding?: any, cb?: any) => {
    bytesSent += toByteLength(chunk, encoding)
    return originalWrite(chunk, encoding, cb)
  }

  ;(res as any).end = (chunk: any, encoding?: any, cb?: any) => {
    bytesSent += toByteLength(chunk, encoding)

    const durationMs = Number(process.hrtime.bigint() - startNs) / 1e6
    if (!res.headersSent) {
      res.setHeader('x-response-time', `${durationMs.toFixed(1)}ms`)
    }

    const xForwardedFor = String(req.headers['x-forwarded-for'] || '-').trim()
    const xForwardedForFirst = xForwardedFor === '-'
      ? ''
      : xForwardedFor.split(',')[0]?.trim()

    const xRealIp = String(req.headers['x-real-ip'] || '').trim()
    const socketIp = String(req.socket?.remoteAddress || '').trim().replace(/^::ffff:/, '')
    const remoteAddr = (xRealIp || socketIp || xForwardedForFirst || '-').replace(/^::ffff:/, '')
    const timeLocal = formatTimeLocal(startedAt)
    const method = req.method || '-'
    const url = req.url || '-'
    const httpVersion = req.httpVersion ? `HTTP/${req.httpVersion}` : '-'
    const requestLine = `${method} ${url} ${httpVersion}`
    const status = res.statusCode || 0

    const referer = String(req.headers.referer || '-')
    const userAgent = String(req.headers['user-agent'] || '-')

    const upstreamCalls = Array.isArray((event as any).context?.upstream_calls)
      ? (event as any).context.upstream_calls
      : []
    const upstream = upstreamCalls.length
      ? upstreamCalls.map((c: any) => `${c.path}:${c.status}:${c.duration_ms}ms`).join(';')
      : '-'

    const line = `${remoteAddr} - [${timeLocal}] "${requestLine}" ${status} ${bytesSent} "${referer}" "${userAgent}" "${xForwardedFor}" "${upstream}"`
    console.log(line)

    return originalEnd(chunk, encoding, cb)
  }
})

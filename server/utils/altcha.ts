import { createHash } from 'node:crypto'

interface AltchaChallenge {
  algorithm: string
  challenge: string
  salt: string
  signature: string
  maxNumber: number
}

interface SolvedPayload extends AltchaChallenge {
  number: number
}

const normalizeAlgorithm = (algorithm: string): string => {
  const value = String(algorithm).toUpperCase()
  if (value === 'SHA-1') return 'sha1'
  if (value === 'SHA-256') return 'sha256'
  if (value === 'SHA-512') return 'sha512'
  throw new Error(`不支持的 algorithm: ${algorithm}`)
}

const hashHex = (algorithm: string, input: string): string =>
  createHash(normalizeAlgorithm(algorithm)).update(input, 'utf8').digest('hex')

const solveAltcha = (challengeData: AltchaChallenge): number => {
  const { algorithm, challenge, salt, maxNumber } = challengeData
  const max = Number(maxNumber)
  
  if (!Number.isFinite(max) || max < 0) {
    throw new Error(`无效的 maxNumber: ${maxNumber}`)
  }

  for (let number = 0; number <= max; number += 1) {
    if (hashHex(algorithm, `${salt}${number}`) === challenge) {
      return number
    }
  }

  throw new Error(`未在 0..${max} 内找到匹配 number`)
}

const fetchChallenge = async (): Promise<AltchaChallenge> => {
  const ts = Date.now()
  const res = await fetch(`https://api.404.name/api/v1/altcha/challenge?t=${ts}`, {
    method: 'GET',
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9',
      priority: 'u=1, i',
      Referer: 'https://miqingju.com/'
    }
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`challenge 请求失败: ${res.status} ${res.statusText}\n${text}`)
  }

  return await res.json()
}

export const getAltchaPayload = async (): Promise<string> => {
  const challenge = await fetchChallenge()
  const number = solveAltcha(challenge)
  const solvedPayload: SolvedPayload = { ...challenge, number }
  return Buffer.from(JSON.stringify(solvedPayload), 'utf8').toString('base64')
}

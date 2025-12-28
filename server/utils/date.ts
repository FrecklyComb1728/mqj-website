export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const pad = (n: number) => n.toString().padStart(2, '0')
  
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

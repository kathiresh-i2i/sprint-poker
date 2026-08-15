const VOTE_PALETTE: readonly string[] = [
  '#60a5fa',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#f472b6',
  '#2dd4bf',
  '#fb923c',
  '#818cf8',
]

export function colorForValue(value: string, fibSeries: string[]): string {
  const index = fibSeries.indexOf(value)
  if (index === -1) return VOTE_PALETTE[0]
  return VOTE_PALETTE[index % VOTE_PALETTE.length]
}

export function hexToRgba(hex: string, alpha: number): string {
  const parsed = hex.replace('#', '')
  const r = parseInt(parsed.substring(0, 2), 16)
  const g = parseInt(parsed.substring(2, 4), 16)
  const b = parseInt(parsed.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const VOTE_PALETTE: readonly string[] = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
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

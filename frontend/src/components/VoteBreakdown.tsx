import { motion } from 'framer-motion'
import type { ReactElement } from 'react'
import type { Participant } from '../types'
import { colorForValue, hexToRgba } from '../voteColors'

interface VoteBreakdownProps {
  estimators: Participant[]
  fibSeries: string[]
}

interface VoteGroup {
  value: string
  count: number
}

function groupVotes(estimators: Participant[]): VoteGroup[] {
  const counts = new Map<string, number>()
  for (const p of estimators) {
    if (p.vote === null) continue
    counts.set(p.vote, (counts.get(p.vote) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || Number(a.value) - Number(b.value))
}

function VoteBreakdown({ estimators, fibSeries }: VoteBreakdownProps): ReactElement | null {
  const groups = groupVotes(estimators)
  if (groups.length === 0) return null

  const total = groups.reduce((sum, g) => sum + g.count, 0)
  const [top, ...rest] = groups
  const hasMajority = groups.length === 1 || top.count > rest[0].count
  const topColor = colorForValue(top.value, fibSeries)

  if (hasMajority) {
    return (
      <motion.div
        className="flex flex-col items-center gap-1 rounded-2xl px-10 py-6"
        style={{ background: hexToRgba(topColor, 0.1) }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <span className="text-xs font-semibold tracking-wide text-(--color-text-secondary) uppercase">
          Team estimate
        </span>
        <span className="text-6xl font-extrabold" style={{ color: topColor }}>
          {top.value}
        </span>
        <span className="text-xs text-(--color-text-secondary)">
          {top.count} of {total} agree
        </span>
      </motion.div>
    )
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-2.5">
      <p className="text-center text-xs text-(--color-text-secondary)">No clear majority — here's the spread</p>
      {groups.map((group, index) => {
        const color = colorForValue(group.value, fibSeries)
        return (
          <motion.div
            key={group.value}
            className="grid items-center gap-3 rounded-xl px-3 py-2"
            style={{ gridTemplateColumns: '2.25rem 1fr 3.5rem' }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ background: color }}
            >
              {group.value}
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-(--color-neutral-soft)">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${(group.count / top.count) * 100}%` }}
                transition={{ delay: index * 0.06 + 0.1, duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <span className="text-right text-sm tabular-nums text-(--color-text-secondary)">
              {group.count}/{total}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

export default VoteBreakdown

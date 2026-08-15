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
  const isUnanimous = hasMajority && top.count === total
  const agreedNames = estimators.filter((p) => p.vote === top.value).map((p) => p.name)

  return (
    <div
      className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-10 shadow-(--shadow-lg)"
      style={{
        backgroundImage: hasMajority
          ? `radial-gradient(circle at 50% 0%, ${hexToRgba(topColor, 0.12)}, transparent 60%)`
          : undefined,
      }}
    >
      {hasMajority ? (
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {isUnanimous && (
            <span className="rounded-full bg-(--color-success-soft) px-3 py-1 text-xs font-semibold text-(--color-success)">
              🎉 Full agreement
            </span>
          )}

          <span className="text-xs font-semibold tracking-wide text-(--color-text-secondary) uppercase">
            Team estimate
          </span>

          <div className="relative flex items-center justify-center">
            <div
              className="absolute h-32 w-32 rounded-full blur-2xl"
              style={{ background: hexToRgba(topColor, 0.25) }}
            />
            <span className="relative text-8xl font-extrabold" style={{ color: topColor }}>
              {top.value}
            </span>
          </div>

          <span className="text-sm text-(--color-text-secondary)">
            {top.count} of {total} agree
          </span>

          {agreedNames.length > 0 && (
            <div className="mt-2 flex -space-x-2">
              {agreedNames.map((agreedName) => (
                <div
                  key={agreedName}
                  title={agreedName}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-(--color-surface)"
                  style={{ background: topColor }}
                >
                  {agreedName.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-center text-sm font-medium text-(--color-text-secondary)">
            No clear majority — here's the spread
          </p>
          <div className="flex flex-col gap-3.5">
            {groups.map((group, index) => {
              const color = colorForValue(group.value, fibSeries)
              return (
                <motion.div
                  key={group.value}
                  className="grid items-center gap-4"
                  style={{ gridTemplateColumns: '2.5rem 1fr 3.5rem' }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold text-white shadow-(--shadow-xs)"
                    style={{ background: color }}
                  >
                    {group.value}
                  </div>
                  <div className="h-3.5 overflow-hidden rounded-full bg-(--color-neutral-soft)">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}, ${hexToRgba(color, 0.75)})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(group.count / top.count) * 100}%` }}
                      transition={{ delay: index * 0.06 + 0.1, duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-right text-sm font-semibold tabular-nums text-(--color-text-primary)">
                    {group.count}/{total}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default VoteBreakdown

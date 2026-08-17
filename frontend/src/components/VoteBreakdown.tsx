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
  const isUnanimous = groups.length === 1
  const isLeaderClear = !isUnanimous && top.count > rest[0].count

  return (
    <div className="flex flex-col items-center gap-6">
      {isUnanimous ? (
        <span className="rounded-full bg-(--color-success-soft) px-3 py-1 text-xs font-semibold text-(--color-success)">
          🎉 Everyone agrees — all {total} voted the same
        </span>
      ) : isLeaderClear ? (
        <p className="text-sm font-medium text-(--color-text-secondary)">
          {top.count} of {total} leaned toward {top.value} — not a full agreement
        </p>
      ) : (
        <p className="text-sm font-medium text-(--color-text-secondary)">
          No clear leader — the team is evenly split
        </p>
      )}

      <div className="flex flex-wrap items-stretch justify-center gap-4">
        {groups.map((group, index) => {
          const color = colorForValue(group.value, fibSeries)
          const isLeading = isLeaderClear && group.value === top.value
          return (
            <motion.div
              key={group.value}
              className="relative flex w-28 flex-col items-center gap-3 rounded-2xl border p-5"
              style={{
                background: hexToRgba(color, isUnanimous || isLeading ? 0.12 : 0.06),
                borderColor: hexToRgba(color, isUnanimous || isLeading ? 0.55 : 0.25),
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, type: 'spring', stiffness: 260, damping: 22 }}
            >
              {isLeading && (
                <span className="absolute -top-2.5 rounded-full bg-(--color-surface) px-2 py-0.5 text-[10px] font-semibold text-(--color-text-secondary) shadow-(--shadow-sm)">
                  Most votes
                </span>
              )}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-extrabold text-white"
                style={{ background: color }}
              >
                {group.value}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-(--color-text-primary)">{group.count}</span>
                <span className="text-xs text-(--color-text-muted)">{group.count === 1 ? 'vote' : 'votes'}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default VoteBreakdown

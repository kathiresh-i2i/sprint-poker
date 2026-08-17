import type { ReactElement } from 'react'
import type { Participant } from '../types'
import { colorForValue } from '../voteColors'
import VoteResultCard from './VoteResultCard'

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

function summaryText(groups: VoteGroup[], total: number, isUnanimous: boolean, isLeaderClear: boolean): string {
  const [top] = groups
  if (isUnanimous) return `Everyone agrees — all ${total} voted the same`
  if (isLeaderClear) return `${top.count} of ${total} leaned toward ${top.value} — not a full agreement`
  return 'No clear leader — the team is evenly split'
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
          🎉 {summaryText(groups, total, isUnanimous, isLeaderClear)}
        </span>
      ) : (
        <p className="text-sm font-medium text-(--color-text-secondary)">
          {summaryText(groups, total, isUnanimous, isLeaderClear)}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        {groups.map((group, index) => {
          const isLeading = isUnanimous || (isLeaderClear && group.value === top.value)
          const isDimmed = isLeaderClear && !isLeading
          return (
            <VoteResultCard
              key={group.value}
              value={group.value}
              count={group.count}
              color={colorForValue(group.value, fibSeries)}
              isLeading={isLeading}
              isDimmed={isDimmed}
              showBadge={isLeaderClear && isLeading}
              index={index}
            />
          )
        })}
      </div>
    </div>
  )
}

export default VoteBreakdown

import { motion } from 'framer-motion'
import type { CSSProperties, ReactElement } from 'react'
import { hexToRgba } from '../voteColors'

interface VoteResultCardProps {
  value: string
  count: number
  color: string
  isLeading: boolean
  isDimmed: boolean
  showBadge: boolean
  index: number
}

function VoteResultCard({ value, count, color, isLeading, isDimmed, showBadge, index }: VoteResultCardProps): ReactElement {
  const cssVars = {
    '--vote-color': color,
    '--vote-bg': hexToRgba(color, isLeading ? 0.16 : isDimmed ? 0.07 : 0.14),
    '--vote-border': hexToRgba(color, isLeading ? 1 : isDimmed ? 0.22 : 0.35),
    '--vote-shadow': hexToRgba(color, 0.35),
  } as CSSProperties

  return (
    <motion.div
      className={`relative flex w-28 flex-col items-center gap-3 rounded-2xl bg-(--vote-bg) p-5 ${
        isLeading
          ? 'border-2 border-(--vote-border) shadow-[0_4px_10px_-4px_var(--vote-shadow)]'
          : 'border border-(--vote-border)'
      }`}
      style={cssVars}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isDimmed ? 0.75 : 1, y: 0, scale: isLeading ? 1.06 : 1 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 260, damping: 22 }}
    >
      {showBadge && (
        <span className="absolute -top-3 rounded-full bg-(--color-surface) px-2.5 py-1 text-[10px] font-semibold text-(--color-text-secondary) shadow-(--shadow-sm)">
          Most votes
        </span>
      )}
      <div
        className={`flex items-center justify-center rounded-full bg-(--vote-color) font-extrabold text-white ${
          isLeading ? 'h-[3.75rem] w-[3.75rem] text-2xl' : 'h-[3.25rem] w-[3.25rem] text-xl'
        }`}
      >
        {value}
      </div>
      <div className="flex flex-col items-center">
        <span className={`font-bold text-(--color-text-primary) ${isLeading ? 'text-lg' : 'text-base'}`}>
          {count}
        </span>
        <span className="text-xs text-(--color-text-muted)">{count === 1 ? 'vote' : 'votes'}</span>
      </div>
    </motion.div>
  )
}

export default VoteResultCard

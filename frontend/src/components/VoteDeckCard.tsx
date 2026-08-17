import { motion } from 'framer-motion'
import type { CSSProperties, ReactElement } from 'react'

interface VoteDeckCardProps {
  value: string
  color: string
  isSelected: boolean
  disabled: boolean
  angle: number
  lift: number
  zIndex: number
  onSelect: (value: string) => void
}

function VoteDeckCard({ value, color, isSelected, disabled, angle, lift, zIndex, onSelect }: VoteDeckCardProps): ReactElement {
  const cssVars = { '--vote-color': color } as CSSProperties

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(value)}
      className={`relative -mx-1 flex h-28 w-20 shrink-0 flex-col overflow-hidden rounded-2xl bg-(--color-surface) disabled:cursor-not-allowed ${
        isSelected ? 'shadow-(--shadow-md)' : 'border border-(--color-border) shadow-(--shadow-sm)'
      }`}
      style={{ ...cssVars, zIndex }}
      initial={false}
      animate={{
        rotate: angle,
        y: isSelected ? -lift - 14 : -lift,
        scale: isSelected ? 1.1 : 1,
        opacity: disabled && !isSelected ? 0.4 : 1,
      }}
      whileHover={disabled ? undefined : { y: -lift - 8, scale: 1.06, zIndex: 20 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <div className="h-2 w-full shrink-0 bg-(--vote-color)" />
      <div className={`flex flex-1 items-center justify-center ${isSelected ? 'bg-(--vote-color)' : 'bg-(--color-surface)'}`}>
        <span className={`text-3xl font-extrabold ${isSelected ? 'text-white' : 'text-(--vote-color)'}`}>{value}</span>
      </div>

      {isSelected && (
        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-white">
          <i className="pi pi-check text-[10px]" />
        </span>
      )}
    </motion.button>
  )
}

export default VoteDeckCard

import { motion } from 'framer-motion'
import type { ReactElement } from 'react'
import { colorForValue } from '../voteColors'

interface VoteSelectorProps {
  fibSeries: string[]
  selectedValue: string | null
  disabled: boolean
  revealed?: boolean
  onSelect: (value: string) => void
}

const MAX_ANGLE = 18
const ARC_HEIGHT = 30

function caption(selectedValue: string | null, revealed: boolean): string {
  if (selectedValue === null) return 'Pick your estimate'
  return revealed ? `Your pick: ${selectedValue}` : `You picked ${selectedValue} — waiting for others`
}

function VoteSelector({ fibSeries, selectedValue, disabled, revealed = false, onSelect }: VoteSelectorProps): ReactElement {
  const mid = (fibSeries.length - 1) / 2
  const step = fibSeries.length > 1 ? MAX_ANGLE / mid : 0

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-medium text-(--color-text-secondary)">{caption(selectedValue, revealed)}</p>

      <div className="flex items-end justify-center" style={{ height: 160 }}>
        {fibSeries.map((value, index) => {
          const offset = index - mid
          const angle = offset * step
          const lift = ARC_HEIGHT * (1 - (offset / (mid || 1)) ** 2)
          const isSelected = value === selectedValue
          const color = colorForValue(value, fibSeries)

          return (
            <motion.button
              key={value}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(value)}
              className="relative -mx-1 flex h-28 w-20 shrink-0 flex-col overflow-hidden rounded-2xl bg-(--color-surface) disabled:cursor-not-allowed"
              style={{
                zIndex: isSelected ? 20 : index,
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                border: isSelected ? 'none' : '1px solid var(--color-border)',
              }}
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
              <div className="h-2 w-full shrink-0" style={{ background: color }} />
              <div
                className="flex flex-1 items-center justify-center"
                style={{ background: isSelected ? color : 'var(--color-surface)' }}
              >
                <span className="text-3xl font-extrabold" style={{ color: isSelected ? '#ffffff' : color }}>
                  {value}
                </span>
              </div>

              {isSelected && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-white">
                  <i className="pi pi-check text-[10px]" />
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default VoteSelector

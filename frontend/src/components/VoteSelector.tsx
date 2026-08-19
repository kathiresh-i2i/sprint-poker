import type { ReactElement } from 'react'
import { colorForValue } from '../voteColors'
import VoteDeckCard from './VoteDeckCard'

interface VoteSelectorProps {
  fibSeries: string[]
  selectedValue: string | null
  disabled: boolean
  revealed?: boolean
  onSelect: (value: string) => void
}

const MAX_ANGLE = 18
const ARC_HEIGHT = 30

function caption(selectedValue: string | null, revealed: boolean): string | null {
  if (selectedValue === null) return null
  return revealed ? `Your pick: ${selectedValue}` : `You picked ${selectedValue} — waiting for others`
}

function VoteSelector({ fibSeries, selectedValue, disabled, revealed = false, onSelect }: VoteSelectorProps): ReactElement {
  const mid = (fibSeries.length - 1) / 2
  const step = fibSeries.length > 1 ? MAX_ANGLE / mid : 0
  const captionText = caption(selectedValue, revealed)

  return (
    <div className="flex flex-col items-center gap-6">
      {captionText && <p className="text-sm font-medium text-(--color-text-secondary)">{captionText}</p>}

      <div className="flex h-40 items-end justify-center">
        {fibSeries.map((value, index) => {
          const offset = index - mid
          const angle = offset * step
          const lift = ARC_HEIGHT * (1 - (offset / (mid || 1)) ** 2)
          const isSelected = value === selectedValue

          return (
            <VoteDeckCard
              key={value}
              value={value}
              color={colorForValue(value, fibSeries)}
              isSelected={isSelected}
              disabled={disabled}
              angle={angle}
              lift={lift}
              zIndex={isSelected ? 20 : index}
              onSelect={onSelect}
            />
          )
        })}
      </div>

      <p className="mt-2 text-xs text-(--color-text-muted)">
        You can change your pick anytime until the facilitator resets
      </p>
    </div>
  )
}

export default VoteSelector

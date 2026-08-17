import type { ReactElement } from 'react'
import { colorForValue } from '../voteColors'

interface FibonacciPreviewProps {
  cardClassName: string
  size?: 'sm' | 'lg'
}

const SERIES = ['1', '2', '3', '5', '8']
const MIDDLE_INDEX = 2

const SIZE_CLASSES: Record<NonNullable<FibonacciPreviewProps['size']>, { gap: string; card: string; bar: string; text: string; lift: string }> = {
  sm: { gap: 'gap-2', card: 'h-16 w-11', bar: 'h-1', text: 'text-base', lift: 'mb-2.5' },
  lg: { gap: 'gap-3', card: 'h-20 w-14', bar: 'h-1.5', text: 'text-xl', lift: 'mb-3' },
}

function FibonacciPreview({ cardClassName, size = 'sm' }: FibonacciPreviewProps): ReactElement {
  const sizing = SIZE_CLASSES[size]

  return (
    <div className={`flex items-end justify-center ${sizing.gap}`}>
      {SERIES.map((value, index) => {
        const color = colorForValue(value, SERIES)
        const isMiddle = index === MIDDLE_INDEX
        return (
          <div
            key={value}
            className={`flex flex-col overflow-hidden ${sizing.card} ${cardClassName} ${isMiddle ? sizing.lift : ''}`}
          >
            <div className={`w-full ${sizing.bar}`} style={{ background: color }} />
            <div className="flex flex-1 items-center justify-center">
              <span className={`font-extrabold ${sizing.text}`} style={{ color }}>
                {value}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FibonacciPreview

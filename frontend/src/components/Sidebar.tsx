import type { ReactElement } from 'react'
import type { Participant } from '../types'
import { colorForValue } from '../voteColors'

interface SidebarProps {
  estimators: Participant[]
  revealed: boolean
  fibSeries: string[]
}

function Sidebar({ estimators, revealed, fibSeries }: SidebarProps): ReactElement {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-5 border-r border-(--color-border) bg-(--color-surface) p-6">
      <div>
        <h3 className="text-xs font-semibold tracking-wide text-(--color-text-secondary) uppercase">Participants</h3>
        <p className="text-xs text-(--color-text-muted)">
          {estimators.length} {estimators.length === 1 ? 'person has' : 'people have'} joined
        </p>
      </div>

      {estimators.length === 0 ? (
        <p className="text-sm text-(--color-text-muted)">
          No one has joined yet. Share the room link so your team can hop in.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {estimators.map((participant) => (
            <li key={participant.id} className="flex items-center justify-between gap-2">
              <span className="truncate text-sm text-(--color-text-primary)">{participant.name}</span>
              {revealed && participant.vote ? (
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: colorForValue(participant.vote, fibSeries) }}
                >
                  {participant.vote}
                </span>
              ) : (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    background: participant.has_voted ? 'var(--color-success)' : 'var(--color-neutral-border)',
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default Sidebar

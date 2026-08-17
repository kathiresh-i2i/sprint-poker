import type { ReactElement } from 'react'
import type { Participant } from '../types'
import ParticipantRow from './ParticipantRow'

interface SidebarProps {
  estimators: Participant[]
}

function Sidebar({ estimators }: SidebarProps): ReactElement {
  return (
    <aside className="flex w-72 shrink-0 flex-col gap-5 border-r border-(--color-border) bg-(--color-surface) p-6">
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
        <ul className="flex flex-col gap-0.5">
          {estimators.map((participant) => (
            <ParticipantRow key={participant.id} participant={participant} />
          ))}
        </ul>
      )}
    </aside>
  )
}

export default Sidebar

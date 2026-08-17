import type { ReactElement } from 'react'
import type { Participant } from '../types'
import Avatar from './Avatar'

interface ParticipantRowProps {
  participant: Participant
}

function ParticipantRow({ participant }: ParticipantRowProps): ReactElement {
  return (
    <li className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-(--color-neutral-soft)">
      <Avatar name={participant.name} variant="neutral" size="md" />
      <span className="flex-1 truncate text-sm text-(--color-text-primary)">{participant.name}</span>

      {participant.has_voted ? (
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-success-soft) text-(--color-success)"
          title="Voted"
        >
          <i className="pi pi-check text-xs" />
        </span>
      ) : (
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-neutral-soft) text-(--color-text-muted)"
          title="Voting"
        >
          <i className="pi pi-clock text-xs" />
        </span>
      )}
    </li>
  )
}

export default ParticipantRow

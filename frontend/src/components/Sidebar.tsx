import type { ReactElement } from 'react'
import type { Participant } from '../types'

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
        <ul className="flex flex-col gap-1.5">
          {estimators.map((participant) => (
            <li
              key={participant.id}
              className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-(--color-neutral-soft)"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-neutral-soft) text-xs font-semibold text-(--color-text-secondary)">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <span className="flex-1 truncate text-sm text-(--color-text-primary)">{participant.name}</span>

              {participant.has_voted ? (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-(--color-success-soft) px-2.5 py-1 text-xs font-medium text-(--color-success)">
                  <i className="pi pi-check text-[10px]" />
                  Voted
                </span>
              ) : (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-(--color-neutral-soft) px-2.5 py-1 text-xs font-medium text-(--color-text-muted)">
                  <i className="pi pi-clock text-[10px]" />
                  Waiting
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default Sidebar

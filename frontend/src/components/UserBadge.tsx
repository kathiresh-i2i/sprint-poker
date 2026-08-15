import type { ReactElement } from 'react'

interface UserBadgeProps {
  name: string
  isAdmin: boolean
}

function UserBadge({ name, isAdmin }: UserBadgeProps): ReactElement {
  return (
    <div className="flex items-center gap-2 rounded-full bg-(--color-neutral-soft) py-1.5 pl-1.5 pr-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-accent) text-xs font-semibold text-(--color-accent-contrast)">
        {name.charAt(0).toUpperCase()}
      </div>
      <span className="max-w-32 truncate text-sm font-medium text-(--color-text-primary)">{name}</span>
      {isAdmin && <i className="pi pi-crown text-xs text-(--color-accent)" />}
    </div>
  )
}

export default UserBadge

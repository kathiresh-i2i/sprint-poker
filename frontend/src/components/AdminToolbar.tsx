import { Button } from 'primereact/button'
import type { ReactElement } from 'react'

interface AdminToolbarProps {
  revealed: boolean
  hasVotes: boolean
  onReveal: () => void
  onReset: () => void
}

function AdminToolbar({ revealed, hasVotes, onReveal, onReset }: AdminToolbarProps): ReactElement {
  return (
    <div className="flex items-center justify-center gap-3">
      {!revealed ? (
        <Button label="Reveal votes" icon="pi pi-eye" disabled={!hasVotes} onClick={onReveal} />
      ) : (
        <Button label="Reset votes" icon="pi pi-refresh" text severity="secondary" size="small" onClick={onReset} />
      )}
    </div>
  )
}

export default AdminToolbar

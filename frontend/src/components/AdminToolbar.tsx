import { Button } from 'primereact/button'
import { motion } from 'framer-motion'
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
        <motion.button
          type="button"
          disabled={!hasVotes}
          onClick={onReveal}
          whileHover={hasVotes ? { scale: 1.03 } : undefined}
          whileTap={hasVotes ? { scale: 0.97 } : undefined}
          className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            hasVotes
              ? 'bg-(--color-accent) text-(--color-accent-contrast) shadow-(--shadow-sm) hover:bg-(--color-accent-hover)'
              : 'cursor-not-allowed bg-(--color-neutral-soft) text-(--color-text-muted)'
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              hasVotes ? 'bg-white/20' : 'bg-(--color-border)'
            }`}
          >
            <i className="pi pi-eye text-xs" />
          </span>
          Reveal votes
        </motion.button>
      ) : (
        <Button label="Reset votes" icon="pi pi-refresh" text severity="secondary" size="small" onClick={onReset} />
      )}
    </div>
  )
}

export default AdminToolbar

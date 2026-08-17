import type { ReactElement } from 'react'

interface LoadingScreenProps {
  message?: string
}

function LoadingScreen({ message = 'Loading…' }: LoadingScreenProps): ReactElement {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-accent-soft)">
        <i className="pi pi-spin pi-spinner text-xl text-(--color-accent)" />
      </div>
      <p className="text-sm text-(--color-text-secondary)">{message}</p>
    </div>
  )
}

export default LoadingScreen

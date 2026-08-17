import { Button } from 'primereact/button'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

interface NotFoundScreenProps {
  title: string
  message: string
  icon?: string
}

function NotFoundScreen({ title, message, icon = 'pi-compass' }: NotFoundScreenProps): ReactElement {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl bg-gradient-glow" />

      <div className="relative flex flex-col items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-(--color-accent-soft) shadow-(--shadow-sm)">
          <i className={`pi ${icon} text-3xl text-(--color-accent)`} />
        </div>
        <div className="flex max-w-sm flex-col gap-2">
          <h1 className="text-2xl font-bold text-(--color-text-primary)">{title}</h1>
          <p className="text-sm text-(--color-text-secondary)">{message}</p>
        </div>
        <Button label="Back to home" icon="pi pi-arrow-left" onClick={() => navigate('/')} className="mt-2" />
      </div>
    </div>
  )
}

export default NotFoundScreen

import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { useState } from 'react'
import type { FormEvent, ReactElement } from 'react'

interface JoinFormProps {
  onJoin: (name: string) => void
  isCreator: boolean
}

function JoinForm({ onJoin, isCreator }: JoinFormProps): ReactElement {
  const [name, setName] = useState('')

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length === 0) return
    onJoin(trimmed)
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, var(--color-accent-soft), transparent)' }}
      />

      <Card
        className="relative w-full max-w-sm rounded-2xl shadow-(--shadow-lg)"
        pt={{ body: { className: 'p-8' } }}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-accent-soft)">
            <i className="pi pi-table text-xl text-(--color-accent)" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-(--color-text-primary)">
              {isCreator ? 'Set up your room' : "You're invited to estimate"}
            </h1>
            <p className="text-sm text-(--color-text-secondary)">
              {isCreator
                ? 'Enter your name so your team knows who is facilitating.'
                : "Enter your name to join this team's planning session."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-3">
            <InputText
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full"
            />
            <Button
              type="submit"
              label={isCreator ? 'Enter room' : 'Join room'}
              icon="pi pi-arrow-right"
              iconPos="right"
              className="w-full"
            />
          </form>
        </div>
      </Card>
    </div>
  )
}

export default JoinForm

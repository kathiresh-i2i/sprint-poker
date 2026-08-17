import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useState } from 'react'
import type { FormEvent, ReactElement } from 'react'
import FibonacciPreview from './FibonacciPreview'
import Logo from './Logo'

interface JoinFormProps {
  onJoin: (name: string) => void
  isCreator: boolean
  adminName: string | null
}

function JoinForm({ onJoin, isCreator, adminName }: JoinFormProps): ReactElement {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length === 0) {
      setError('Please enter your name to continue.')
      return
    }
    onJoin(trimmed)
  }

  const heading = isCreator
    ? 'Set up your room'
    : adminName
      ? `${adminName} is inviting you to estimate`
      : "You're invited to estimate"

  const subtext = isCreator
    ? 'Your name will be shown to your team once they join.'
    : "Enter your name to join this team's planning session."

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <div className="bg-gradient-brand relative flex flex-col items-center justify-center gap-10 overflow-hidden px-8 py-14 md:w-[45%]">
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white opacity-20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-3 text-center">
          <Logo size="lg" variant="white" />
          <h1 className="text-3xl font-bold text-white">Sprint Poker</h1>
          <p className="max-w-xs text-sm text-white/80">
            Planning poker for agile teams — estimate together, in real time, from anywhere.
          </p>
        </div>

        <div className="relative">
          <FibonacciPreview size="sm" cardClassName="rounded-lg bg-white shadow-lg" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-(--color-text-primary)">{heading}</h2>
          <p className="mt-2 text-sm text-(--color-text-secondary)">{subtext}</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="join-name" className="text-xs font-semibold text-(--color-text-secondary) uppercase">
                Your name
              </label>
              <InputText
                id="join-name"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="e.g. James"
                className="w-full py-3 text-base"
                invalid={Boolean(error)}
              />
              {error && <p className="text-sm text-(--color-danger)">{error}</p>}
            </div>
            <Button
              type="submit"
              label={isCreator ? 'Enter room' : 'Join room'}
              icon="pi pi-arrow-right"
              iconPos="right"
              className="w-full py-3 text-base"
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default JoinForm

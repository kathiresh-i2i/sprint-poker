import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { useState } from 'react'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom } from '../api'
import { saveAdminToken } from '../adminToken'
import { colorForValue } from '../voteColors'

interface Highlight {
  icon: string
  title: string
  description: string
}

const HIGHLIGHTS: Highlight[] = [
  {
    icon: 'pi-bolt',
    title: 'No sign-up',
    description: 'Create a room in one click, no account needed.',
  },
  {
    icon: 'pi-sync',
    title: 'Real-time voting',
    description: 'Everyone sees votes come in live, no refreshing.',
  },
  {
    icon: 'pi-share-alt',
    title: 'One link to share',
    description: 'Send the room link and your team is in.',
  },
]

interface Step {
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    title: 'Create a room',
    description:
      'Click "Create a room" and your private planning session is ready instantly — no account, no email, nothing to install.',
  },
  {
    title: 'Share the link',
    description:
      'Send the room link to your team over Slack, email, or your video call chat. They just enter a name and they\'re in.',
  },
  {
    title: 'Estimate together',
    description:
      'Everyone picks a card in private. When the team is ready, reveal the votes together and discuss any gaps before locking in an estimate.',
  },
]

const PREVIEW_SERIES = ['1', '2', '3', '5', '8']

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: 'Do participants need to create an account?',
    answer:
      'No. Only the room link is required. Anyone who opens it enters a name and can start estimating immediately.',
  },
  {
    question: 'Can we reuse the same room for multiple tickets?',
    answer:
      'Yes. A room stays open for your whole session — the facilitator resets the votes after each reveal so the team can move straight to the next ticket.',
  },
  {
    question: 'What estimation scale do you use?',
    answer:
      'A simplified Fibonacci sequence (1, 2, 3, 5, 8), which is the most common scale for story-point estimation in agile teams.',
  },
  {
    question: 'Does the facilitator also vote?',
    answer:
      "No. Whoever creates the room facilitates the session — revealing votes and resetting for the next ticket — while the rest of the team estimates.",
  },
]

function CreateRoomPage(): ReactElement {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleCreate = async (): Promise<void> => {
    setIsCreating(true)
    setError(null)
    try {
      const { room_id, admin_token } = await createRoom()
      saveAdminToken(room_id, admin_token)
      navigate(`/room/${room_id}`)
    } catch {
      setError('Could not create room. Please try again.')
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden px-4 pt-16 pb-12">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, var(--color-accent-soft), transparent)' }}
        />

        <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-accent-soft) shadow-(--shadow-sm)">
              <i className="pi pi-table text-2xl text-(--color-accent)" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-(--color-text-primary)">Sprint Poker</h1>
            <p className="max-w-sm text-(--color-text-secondary)">
              Planning poker for agile teams. Create a room, share the link, and estimate together in seconds.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3">
            <Button
              label={isCreating ? 'Creating…' : 'Create a room'}
              icon="pi pi-plus"
              loading={isCreating}
              onClick={handleCreate}
              size="large"
              className="w-full max-w-xs"
            />
            {error && <p className="text-sm text-(--color-danger)">{error}</p>}
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-5 text-center shadow-(--shadow-xs)"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--color-accent-soft)">
                  <i className={`pi ${item.icon} text-(--color-accent)`} />
                </div>
                <p className="text-sm font-semibold text-(--color-text-primary)">{item.title}</p>
                <p className="text-xs text-(--color-text-secondary)">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="border-y border-(--color-border) bg-(--color-surface) px-4 py-14">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
          <p className="text-xs font-semibold tracking-wide text-(--color-text-secondary) uppercase">
            A familiar Fibonacci scale
          </p>
          <div className="flex items-end justify-center gap-3">
            {PREVIEW_SERIES.map((value, index) => {
              const color = colorForValue(value, PREVIEW_SERIES)
              return (
                <div
                  key={value}
                  className="flex h-20 w-14 flex-col overflow-hidden rounded-xl bg-(--color-bg) shadow-(--shadow-sm)"
                  style={{ marginBottom: index === 2 ? 12 : 0 }}
                >
                  <div className="h-1.5 w-full" style={{ background: color }} />
                  <div className="flex flex-1 items-center justify-center">
                    <span className="text-xl font-extrabold" style={{ color }}>
                      {value}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="max-w-md text-center text-sm text-(--color-text-secondary)">
            No fifty-page point systems to agree on — just a simple, well-known scale your whole team already
            understands.
          </p>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto w-full max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-(--color-text-primary)">How it works</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-(--color-text-secondary)">
            Three steps between you and a well-estimated backlog.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-2 text-center sm:text-left">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-(--color-accent) text-sm font-bold text-(--color-accent-contrast) sm:mx-0">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-(--color-text-primary)">{step.title}</h3>
                <p className="text-sm text-(--color-text-secondary)">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-(--color-border) bg-(--color-surface) px-4 py-16">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-(--color-text-primary)">Frequently asked questions</h2>
          <div className="mt-8">
            <Accordion>
              {FAQS.map((faq) => (
                <AccordionTab key={faq.question} header={faq.question}>
                  <p className="text-sm text-(--color-text-secondary)">{faq.answer}</p>
                </AccordionTab>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <footer className="border-t border-(--color-border) px-4 py-8 text-center text-xs text-(--color-text-muted)">
        Built for agile teams who just want to estimate and get back to work.
      </footer>
    </div>
  )
}

export default CreateRoomPage

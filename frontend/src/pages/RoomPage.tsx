import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchRoom } from '../api'
import { getAdminToken } from '../adminToken'
import { getParticipantName, saveParticipantName } from '../participantName'
import { useRoomSocket } from '../hooks/useRoomSocket'
import JoinForm from '../components/JoinForm'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import VoteSelector from '../components/VoteSelector'
import VoteBreakdown from '../components/VoteBreakdown'
import AdminToolbar from '../components/AdminToolbar'

type RoomLookupStatus = 'loading' | 'found' | 'not-found'

function RoomPage(): ReactElement {
  const { roomId = '' } = useParams<{ roomId: string }>()
  const [lookupStatus, setLookupStatus] = useState<RoomLookupStatus>('loading')
  const [name, setName] = useState<string | null>(() => getParticipantName(roomId))
  const [adminName, setAdminName] = useState<string | null>(null)

  const handleJoin = (joinedName: string): void => {
    saveParticipantName(roomId, joinedName)
    setName(joinedName)
  }

  const adminToken = getAdminToken(roomId)

  useEffect(() => {
    let cancelled = false
    fetchRoom(roomId).then((room) => {
      if (cancelled) return
      setLookupStatus(room ? 'found' : 'not-found')
      setAdminName(room?.admin_name ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [roomId])

  const { status, roomState, isAdmin, myVote, vote, reveal, reset } = useRoomSocket(roomId, name, adminToken)

  if (lookupStatus === 'loading') {
    return <p className="p-8 text-center text-(--color-text-muted)">Loading room…</p>
  }

  if (lookupStatus === 'not-found') {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold text-(--color-text-primary)">Room not found</h1>
        <Link to="/" className="text-(--color-accent) hover:underline">
          Create a new room
        </Link>
      </div>
    )
  }

  if (!name) {
    return <JoinForm onJoin={handleJoin} isCreator={Boolean(adminToken)} adminName={adminName} />
  }

  const revealed = roomState?.revealed ?? false
  const participants = roomState?.participants ?? []
  const fibSeries = roomState?.fib_series ?? []
  const estimators = participants.filter((p) => !p.is_admin)
  const hasVotes = estimators.some((p) => p.has_voted)

  let headline = ''
  let subtext = ''
  if (isAdmin && !revealed) {
    headline = 'Waiting for your team'
    subtext = hasVotes
      ? 'Reveal whenever you’re ready, or wait for a few more votes.'
      : 'Once your team starts voting, you’ll be able to reveal the results here.'
  } else if (isAdmin && revealed) {
    headline = 'Results are in'
    subtext = 'Discuss as a team, then reset to estimate the next ticket.'
  } else if (!revealed) {
    headline = 'Time to estimate'
    subtext = 'Select the value that best reflects the effort for this ticket.'
  } else {
    headline = 'Votes are in'
    subtext = 'You can still change your pick until the facilitator resets for the next ticket.'
  }

  return (
    <div className="flex min-h-svh flex-col bg-(--color-bg)">
      <TopBar
        status={status}
        shareLink={window.location.href}
        shareDisplayPath={`${window.location.host}/room/${roomId}`}
        myName={name}
        isAdmin={isAdmin}
      />

      <div className="flex flex-1">
        {isAdmin && <Sidebar estimators={estimators} revealed={revealed} fibSeries={fibSeries} />}

        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10">
          <div className="max-w-sm text-center">
            <h1 className="text-2xl font-bold text-(--color-text-primary)">{headline}</h1>
            <p className="mt-1 text-sm text-(--color-text-secondary)">{subtext}</p>
          </div>

          {isAdmin && !revealed && (
            <AdminToolbar revealed={revealed} hasVotes={hasVotes} onReveal={reveal} onReset={reset} />
          )}

          {isAdmin && revealed && (
            <div className="flex w-full max-w-md flex-col items-center gap-6">
              <VoteBreakdown estimators={estimators} fibSeries={fibSeries} />
              <AdminToolbar revealed={revealed} hasVotes={hasVotes} onReveal={reveal} onReset={reset} />
            </div>
          )}

          {!isAdmin && (
            <VoteSelector
              fibSeries={fibSeries}
              selectedValue={myVote}
              disabled={false}
              revealed={revealed}
              onSelect={vote}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default RoomPage

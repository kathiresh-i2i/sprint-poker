import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { fetchRoom } from '../api'
import { getAdminToken } from '../adminToken'
import { getParticipantName, saveParticipantName } from '../participantName'
import { useRoomSocket } from '../hooks/useRoomSocket'
import JoinForm from '../components/JoinForm'
import LoadingScreen from '../components/LoadingScreen'
import NotFoundScreen from '../components/NotFoundScreen'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'
import VoteSelector from '../components/VoteSelector'
import VoteBreakdown from '../components/VoteBreakdown'
import AdminToolbar from '../components/AdminToolbar'

type RoomLookupStatus = 'loading' | 'found' | 'not-found'

interface HeadlineCopy {
  headline: string
  subtext: string
}

function getHeadlineCopy(isAdmin: boolean, revealed: boolean, hasVotes: boolean): HeadlineCopy {
  if (isAdmin && !revealed) {
    return {
      headline: 'Waiting for your team',
      subtext: hasVotes
        ? 'Reveal whenever you’re ready, or wait for a few more votes.'
        : 'Once your team starts voting, you’ll be able to reveal the results here.',
    }
  }
  if (isAdmin && revealed) {
    return {
      headline: "Here's what the team said",
      subtext: 'Discuss as a team, then reset to estimate the next ticket.',
    }
  }
  if (!revealed) {
    return {
      headline: 'Time to estimate',
      subtext: 'Pick the card that matches this ticket’s effort.',
    }
  }
  return {
    headline: "You're all set",
    subtext: 'The facilitator is reviewing the team’s estimates.',
  }
}

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
    return <LoadingScreen message="Loading room…" />
  }

  if (lookupStatus === 'not-found') {
    return (
      <NotFoundScreen
        icon="pi-ban"
        title="Room not found"
        message="This link may be mistyped, expired, or the room was never created. Start a new session instead."
      />
    )
  }

  if (!name) {
    return <JoinForm onJoin={handleJoin} isCreator={Boolean(adminToken)} adminName={adminName} />
  }

  if (!roomState) {
    return <LoadingScreen message="Joining room…" />
  }

  const revealed = roomState.revealed
  const participants = roomState.participants
  const fibSeries = roomState.fib_series
  const estimators = participants.filter((p) => !p.is_admin)
  const hasVotes = estimators.some((p) => p.has_voted)

  const { headline, subtext } = getHeadlineCopy(isAdmin, revealed, hasVotes)

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
        {isAdmin && <Sidebar estimators={estimators} />}

        <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10">
          <div className="max-w-sm text-center">
            <h1 className="text-2xl font-bold text-(--color-text-primary)">{headline}</h1>
            <p className="mt-3 text-sm text-(--color-text-secondary)">{subtext}</p>
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

import { useCallback, useEffect, useRef, useState } from 'react'
import { WS_BASE_URL } from '../config'
import type { ClientMessage, RoomState, ServerMessage } from '../types'

export type ConnectionStatus = 'connecting' | 'open' | 'closed'

interface UseRoomSocketResult {
  status: ConnectionStatus
  roomState: RoomState | null
  participantId: string | null
  isAdmin: boolean
  myVote: string | null
  vote: (value: string) => void
  reveal: () => void
  reset: () => void
}

const RECONNECT_DELAY_MS = 2000

export function useRoomSocket(
  roomId: string,
  name: string | null,
  adminToken: string | null,
): UseRoomSocketResult {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [myVote, setMyVote] = useState<string | null>(null)

  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shouldReconnectRef = useRef(true)
  const participantIdRef = useRef<string | null>(null)

  const send = useCallback((message: ClientMessage) => {
    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }, [])

  useEffect(() => {
    if (!name) return

    shouldReconnectRef.current = true

    const connect = (): void => {
      setStatus('connecting')
      const socket = new WebSocket(`${WS_BASE_URL}/ws/rooms/${roomId}`)
      socketRef.current = socket

      socket.onopen = () => {
        if (socketRef.current !== socket) return
        setStatus('open')
        socket.send(
          JSON.stringify({ type: 'join', name, admin_token: adminToken ?? undefined } satisfies ClientMessage),
        )
      }

      socket.onmessage = (event) => {
        if (socketRef.current !== socket) return
        const data: ServerMessage = JSON.parse(event.data)
        if (data.type === 'welcome') {
          participantIdRef.current = data.participant_id
          setParticipantId(data.participant_id)
          setIsAdmin(data.is_admin)
        } else if (data.type === 'state') {
          setRoomState(data.room)
          const me = data.room.participants.find((p) => p.id === participantIdRef.current)
          if (!me || !me.has_voted) {
            setMyVote(null)
          } else if (data.room.revealed) {
            setMyVote(me.vote)
          }
        }
      }

      socket.onclose = () => {
        if (socketRef.current !== socket) return
        setStatus('closed')
        if (shouldReconnectRef.current) {
          reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS)
        }
      }

      socket.onerror = () => {
        socket.close()
      }
    }

    connect()

    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
      socketRef.current?.close()
    }
  }, [roomId, name, adminToken])

  const vote = useCallback(
    (value: string) => {
      setMyVote(value)
      send({ type: 'vote', value })
    },
    [send],
  )
  const reveal = useCallback(() => send({ type: 'reveal' }), [send])
  const reset = useCallback(() => send({ type: 'reset' }), [send])

  return { status, roomState, participantId, isAdmin, myVote, vote, reveal, reset }
}

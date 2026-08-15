export interface Participant {
  id: string
  name: string
  is_admin: boolean
  has_voted: boolean
  vote: string | null
}

export interface RoomState {
  room_id: string
  revealed: boolean
  fib_series: string[]
  participants: Participant[]
}

export interface WelcomeMessage {
  type: 'welcome'
  participant_id: string
  is_admin: boolean
  fib_series: string[]
}

export interface StateMessage {
  type: 'state'
  room: RoomState
}

export type ServerMessage = WelcomeMessage | StateMessage

export type ClientMessage =
  | { type: 'join'; name: string; admin_token?: string }
  | { type: 'vote'; value: string }
  | { type: 'reveal' }
  | { type: 'reset' }

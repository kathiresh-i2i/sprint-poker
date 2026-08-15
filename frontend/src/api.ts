import { API_BASE_URL } from './config'

export interface CreateRoomResponse {
  room_id: string
  admin_token: string
}

export async function createRoom(): Promise<CreateRoomResponse> {
  const response = await fetch(`${API_BASE_URL}/rooms`, { method: 'POST' })
  if (!response.ok) {
    throw new Error('Failed to create room')
  }
  return response.json()
}

export async function fetchRoom(roomId: string): Promise<{ room_id: string } | null> {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Failed to fetch room')
  }
  return response.json()
}

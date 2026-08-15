const storageKey = (roomId: string): string => `sprint-poker:name:${roomId}`

export function saveParticipantName(roomId: string, name: string): void {
  sessionStorage.setItem(storageKey(roomId), name)
}

export function getParticipantName(roomId: string): string | null {
  return sessionStorage.getItem(storageKey(roomId))
}

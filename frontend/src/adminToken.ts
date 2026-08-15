const storageKey = (roomId: string): string => `sprint-poker:admin-token:${roomId}`

export function saveAdminToken(roomId: string, token: string): void {
  localStorage.setItem(storageKey(roomId), token)
}

export function getAdminToken(roomId: string): string | null {
  return localStorage.getItem(storageKey(roomId))
}

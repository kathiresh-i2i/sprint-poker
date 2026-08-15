const MAX_STORED_TOKENS = 20
const ORDER_KEY = 'sprint-poker:admin-token-order'
const TOKEN_PREFIX = 'sprint-poker:admin-token:'

const storageKey = (roomId: string): string => `${TOKEN_PREFIX}${roomId}`

function readOrder(): string[] {
  try {
    const raw = localStorage.getItem(ORDER_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function writeOrder(order: string[]): void {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order))
}

function pruneUntracked(): void {
  if (localStorage.getItem(ORDER_KEY) !== null) return

  const untracked: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(TOKEN_PREFIX)) {
      untracked.push(key.slice(TOKEN_PREFIX.length))
    }
  }

  const excess = untracked.length - MAX_STORED_TOKENS
  if (excess > 0) {
    for (const roomId of untracked.slice(0, excess)) {
      localStorage.removeItem(storageKey(roomId))
    }
  }
  writeOrder(untracked.slice(Math.max(0, excess)))
}

pruneUntracked()

export function saveAdminToken(roomId: string, token: string): void {
  localStorage.setItem(storageKey(roomId), token)

  const order = readOrder().filter((id) => id !== roomId)
  order.push(roomId)

  while (order.length > MAX_STORED_TOKENS) {
    const oldestRoomId = order.shift()
    if (oldestRoomId) {
      localStorage.removeItem(storageKey(oldestRoomId))
    }
  }

  writeOrder(order)
}

export function getAdminToken(roomId: string): string | null {
  return localStorage.getItem(storageKey(roomId))
}

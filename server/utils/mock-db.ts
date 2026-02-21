export type Role = 'owner' | 'admin' | 'member'
export type UserStatus = 'active' | 'invited' | 'disabled'

export type UserRecord = {
  id: number
  name: string
  email: string
  role: Role
  status: UserStatus
  createdAt: string
}

let users: UserRecord[] = [
  { id: 1, name: 'Ava Lin', email: 'ava@example.com', role: 'owner', status: 'active', createdAt: '2026-01-08T08:00:00.000Z' },
  { id: 2, name: 'Noah Chen', email: 'noah@example.com', role: 'admin', status: 'active', createdAt: '2026-01-09T08:00:00.000Z' },
  { id: 3, name: 'Mia Tsai', email: 'mia@example.com', role: 'member', status: 'invited', createdAt: '2026-01-10T08:00:00.000Z' },
  { id: 4, name: 'Ethan Wu', email: 'ethan@example.com', role: 'member', status: 'active', createdAt: '2026-01-11T08:00:00.000Z' },
  { id: 5, name: 'Lucas Ho', email: 'lucas@example.com', role: 'member', status: 'disabled', createdAt: '2026-01-12T08:00:00.000Z' },
  { id: 6, name: 'Emma Kao', email: 'emma@example.com', role: 'admin', status: 'active', createdAt: '2026-01-13T08:00:00.000Z' },
  { id: 7, name: 'Leo Hsu', email: 'leo@example.com', role: 'member', status: 'invited', createdAt: '2026-01-14T08:00:00.000Z' },
  { id: 8, name: 'Ivy Lin', email: 'ivy@example.com', role: 'member', status: 'active', createdAt: '2026-01-15T08:00:00.000Z' }
]

let idCounter = users.length + 1

export function listUsers() {
  return users
}

export function createUser(input: Omit<UserRecord, 'id' | 'createdAt'>) {
  const record: UserRecord = {
    id: idCounter++,
    createdAt: new Date().toISOString(),
    ...input
  }
  users = [record, ...users]
  return record
}

export function updateUser(id: number, patch: Partial<Omit<UserRecord, 'id' | 'createdAt'>>) {
  const current = users.find(user => user.id === id)
  if (!current) {
    return null
  }
  const updated: UserRecord = { ...current, ...patch }
  users = users.map(user => (user.id === id ? updated : user))
  return updated
}

export function deleteUser(id: number) {
  const existing = users.find(user => user.id === id)
  if (!existing) {
    return null
  }
  users = users.filter(user => user.id !== id)
  return existing
}

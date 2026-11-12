import { GENDERS, type Gender, type User, type UserInput } from '../types/user.ts'
import { request } from './client.ts'

type RawUser = Omit<User, 'id' | 'age' | 'gender' | 'version' | 'created_at' | 'updated_at'> & {
  id: number | string
  age: number | string
  version: number | string
  gender: string
  created_at?: string | null
  updated_at?: string | null
}

/** Normalizes the API shape: numeric strings from MySQL, empty phone, unknown gender. */
function toUser(raw: RawUser): User {
  return {
    ...raw,
    id: Number(raw.id),
    age: Number(raw.age),
    version: Number(raw.version),
    telephone: raw.telephone || null,
    created_at: raw.created_at ?? null,
    updated_at: raw.updated_at ?? null,
    gender: GENDERS.includes(raw.gender as Gender) ? (raw.gender as Gender) : 'other',
  }
}

export async function listUsers(signal?: AbortSignal): Promise<User[]> {
  const data = await request<RawUser[]>('/users', { signal })
  return data.map(toUser)
}

/** GET /users/{id}: 200 or ApiError 404. */
export async function getUser(id: number, signal?: AbortSignal): Promise<User> {
  return toUser(await request<RawUser>(`/users/${id}`, { signal }))
}

export async function createUser(input: UserInput): Promise<User> {
  return toUser(await request<RawUser>('/users', { method: 'POST', body: input }))
}

/**
 * PUT /users/{id} only if the user is still at `version` (If-Match).
 * Throws ApiError 412 when someone else saved first.
 */
export async function updateUser(id: number, input: UserInput, version: number): Promise<User> {
  return toUser(
    await request<RawUser>(`/users/${id}`, { method: 'PUT', body: input, headers: { 'If-Match': `"${version}"` } }),
  )
}

export function deleteUser(id: number): Promise<void> {
  return request<void>(`/users/${id}`, { method: 'DELETE' })
}

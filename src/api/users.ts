import { GENDERS, type Gender, type User, type UserInput, type UserListParams, type UserPage } from '../types/user.ts'
import { ApiError, getErrorMessage, isRecord, requestBody, requestData, requestVoid, type ErrorMessages } from './client.ts'

const INVALID = 'La API devolvió un usuario con un formato no válido.'

function isGender(value: unknown): value is Gender {
  return GENDERS.some((g) => g === value)
}

function toNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN
  if (!Number.isFinite(n)) throw new ApiError(200, INVALID)
  return n
}

function toText(value: unknown): string {
  if (typeof value !== 'string') throw new ApiError(200, INVALID)
  return value
}

function toOptionalText(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null
}

/**
 * Validates and normalizes one user from the API: numeric strings from MySQL,
 * empty phone → null, unknown gender → 'other'. Throws ApiError on a broken shape.
 */
function parseUser(raw: unknown): User {
  if (!isRecord(raw)) throw new ApiError(200, INVALID)
  return {
    id: toNumber(raw.id),
    first_name: toText(raw.first_name),
    last_name: toText(raw.last_name),
    email: toText(raw.email),
    gender: isGender(raw.gender) ? raw.gender : 'other',
    telephone: toOptionalText(raw.telephone),
    age: toNumber(raw.age),
    version: toNumber(raw.version),
    created_at: toOptionalText(raw.created_at),
    updated_at: toOptionalText(raw.updated_at),
  }
}

function parseUserPage(body: unknown): UserPage {
  if (!isRecord(body) || !Array.isArray(body.data) || !isRecord(body.meta)) {
    throw new ApiError(200, 'La API devolvió un listado con un formato no válido.')
  }
  const { next_cursor, total } = body.meta
  return {
    users: body.data.map(parseUser),
    nextCursor: typeof next_cursor === 'string' && next_cursor !== '' ? next_cursor : null,
    total: typeof total === 'number' || typeof total === 'string' ? toNumber(total) : null,
  }
}

/**
 * GET /users with server-side search, filter, sort and keyset pagination.
 * `cursor` = meta.next_cursor of the previous page (null = first page).
 */
export async function listUsers(
  params: UserListParams,
  { cursor = null, withTotal = false, signal }: { cursor?: string | null; withTotal?: boolean; signal?: AbortSignal } = {},
): Promise<UserPage> {
  const query = new URLSearchParams({ sort: params.sort, dir: params.dir, limit: String(params.limit) })
  if (params.q) query.set('q', params.q)
  if (params.gender !== 'all') query.set('gender', params.gender)
  if (cursor) query.set('cursor', cursor)
  if (withTotal) query.set('with_total', '1')

  return parseUserPage(await requestBody(`/users?${query}`, { signal }))
}

/** GET /users/{id}: 200 or ApiError 404. */
export async function getUser(id: number, signal?: AbortSignal): Promise<User> {
  return parseUser(await requestData(`/users/${id}`, { signal }))
}

export async function createUser(input: UserInput): Promise<User> {
  return parseUser(await requestData('/users', { method: 'POST', body: input }))
}

/**
 * PUT /users/{id} only if the user is still at `version` (If-Match).
 * Throws ApiError 412 when someone else saved first.
 */
export async function updateUser(id: number, input: UserInput, version: number): Promise<User> {
  return parseUser(
    await requestData(`/users/${id}`, { method: 'PUT', body: input, headers: { 'If-Match': `"${version}"` } }),
  )
}

export function deleteUser(id: number): Promise<void> {
  return requestVoid(`/users/${id}`, { method: 'DELETE' })
}

const USER_MESSAGES: ErrorMessages = {
  404: 'El usuario ya no existe. Puede haber sido eliminado por otra persona.',
  412: 'Otra persona modificó este usuario mientras lo editabas. Tus cambios siguen en el formulario: revisa y guarda de nuevo para sobrescribir su versión.',
}

/** getErrorMessage() with the users-specific wording. */
export function userErrorMessage(error: unknown): string {
  return getErrorMessage(error, USER_MESSAGES)
}

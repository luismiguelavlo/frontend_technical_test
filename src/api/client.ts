const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

/** A request that takes longer than this fails with a network-style ApiError. */
const TIMEOUT_MS = 15_000

/** Error contract of the API: { status, message, errors }. status 0 = no response (network/timeout). */
export class ApiError extends Error {
  readonly status: number
  readonly errors: Record<string, string>

  constructor(status: number, message: string, errors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
  headers?: Record<string, string>
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toStringRecord(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
}

/**
 * fetch wrapper: JSON in, parsed JSON body out. Non-2xx responses, network
 * failures and timeouts become ApiError; caller aborts are rethrown untouched.
 * Resolves to undefined on 204.
 */
async function send(path: string, { method = 'GET', body, signal, headers }: RequestOptions): Promise<unknown> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS)
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    if (timeout.aborted) throw new ApiError(0, 'La API tardó demasiado en responder.')
    throw new ApiError(0, 'No se pudo conectar con la API.')
  }

  if (response.status === 204) return undefined

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.message === 'string' ? payload.message : ''
    throw new ApiError(response.status, message, toStringRecord(isRecord(payload) ? payload.errors : null))
  }
  if (payload === null) throw new ApiError(response.status, 'La API devolvió una respuesta no válida.')

  return payload
}

/** Whole JSON body (e.g. `{ data, meta }`), unvalidated: parse it before use. */
export function requestBody(path: string, options: RequestOptions = {}): Promise<unknown> {
  return send(path, options)
}

/** The `data` member of a `{ data }` envelope, unvalidated: parse it before use. */
export async function requestData(path: string, options: RequestOptions = {}): Promise<unknown> {
  const payload = await send(path, options)
  if (!isRecord(payload) || !('data' in payload)) throw new ApiError(200, 'La API devolvió una respuesta no válida.')
  return payload.data
}

/** For endpoints whose body is irrelevant (e.g. DELETE → 204). */
export async function requestVoid(path: string, options: RequestOptions = {}): Promise<void> {
  await send(path, options)
}

/** 412: the record changed since it was loaded (optimistic locking). */
export function isConflictError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 412
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** Status → message overrides for one resource (e.g. "El usuario ya no existe"). */
export type ErrorMessages = Partial<Record<number, string>>

const GENERIC_MESSAGES: ErrorMessages = {
  404: 'El recurso solicitado no existe.',
  412: 'El registro cambió mientras lo editabas. Revisa los datos actuales.',
  422: 'Revisa los campos marcados.',
}

/**
 * User-facing message for any error thrown by the request functions:
 * resource overrides, then the server's own message, then a generic one.
 */
export function getErrorMessage(error: unknown, overrides: ErrorMessages = {}): string {
  if (!(error instanceof ApiError)) return 'Ocurrió un error. Intenta de nuevo.'
  if (error.status === 0) return error.message
  return (
    overrides[error.status] ??
    GENERIC_MESSAGES[error.status] ??
    (error.message || `Error del servidor (HTTP ${error.status}). Intenta de nuevo.`)
  )
}

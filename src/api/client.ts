const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')

/** Error contract of the API: { status, message, errors }. */
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

/**
 * fetch wrapper: JSON in/out, unwraps `{ data }` and turns non-2xx responses
 * (and network failures) into ApiError. Aborts are rethrown untouched.
 */
export async function request<T>(
  path: string,
  { method = 'GET', body, signal, headers }: RequestOptions = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError(0, 'No se pudo conectar con la API.')
  }

  if (response.status === 204) return undefined as T

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const { message, errors } = (payload ?? {}) as { message?: string; errors?: Record<string, string> }
    throw new ApiError(response.status, message ?? `Error HTTP ${response.status}`, errors ?? {})
  }

  return (payload as { data: T }).data
}

/** 412: the record changed since it was loaded (optimistic locking). */
export function isConflictError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 412
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** User-facing message for any error thrown by request(). */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return error.message
    if (error.status === 404) return 'El usuario ya no existe. Puede haber sido eliminado por otra persona.'
    if (error.status === 412)
      return 'Otra persona modificó este usuario mientras lo editabas. Se cargaron los datos actuales: revísalos y vuelve a editar.'
    if (error.status === 422) return 'Revisa los campos marcados.'
  }
  return 'Ocurrió un error. Intenta de nuevo.'
}

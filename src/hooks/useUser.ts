import { useEffect, useState } from 'react'
import { isAbortError, isConflictError, isNotFoundError as isNotFound } from '../api/client.ts'
import { deleteUser, getUser, updateUser, userErrorMessage } from '../api/users.ts'
import type { User, UserInput } from '../types/user.ts'

type UserState =
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error'; error: string }
  | { status: 'success'; user: User }

export type UserStatus = UserState['status']

/**
 * Server state for one user (GET /users/{id}): 404 is its own state, not an error.
 * The fetch is aborted when the id changes or the page unmounts, so a stale
 * response never replaces the current user.
 */
export function useUser(id: number) {
  const [state, setState] = useState<UserState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getUser(id, controller.signal)
      .then((user) => setState({ status: 'success', user }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return
        setState(isNotFound(error) ? { status: 'notFound' } : { status: 'error', error: userErrorMessage(error) })
      })

    return () => controller.abort()
  }, [id, reloadKey])

  function reload() {
    setState({ status: 'loading' })
    setReloadKey((key) => key + 1)
  }

  /** Replaces the cached user with the server copy (no skeleton); a 404 shows not-found. */
  async function refresh() {
    try {
      setState({ status: 'success', user: await getUser(id) })
    } catch (error) {
      if (isNotFound(error)) setState({ status: 'notFound' })
    }
  }

  /**
   * Mutation error handling: 404 → someone deleted the user (not-found state);
   * 412 → someone saved first, so load their version before rethrowing.
   */
  async function mutate<T>(run: () => Promise<T>): Promise<T> {
    try {
      return await run()
    } catch (error) {
      if (isNotFound(error)) setState({ status: 'notFound' })
      if (isConflictError(error)) await refresh()
      throw error
    }
  }

  /** PUT guarded by the version the user was loaded with (If-Match). */
  function update(input: UserInput, version: number) {
    return mutate(async () => {
      const user = await updateUser(id, input, version)
      setState({ status: 'success', user })
    })
  }

  function remove() {
    return mutate(() => deleteUser(id))
  }

  return { state, reload, update, remove }
}

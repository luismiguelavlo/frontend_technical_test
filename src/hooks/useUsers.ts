import { useEffect, useState } from 'react'
import { createUser, deleteUser, getUser, listUsers, updateUser } from '../api/users.ts'
import { ApiError, getErrorMessage, isAbortError, isConflictError } from '../api/client.ts'
import type { User, UserInput } from '../types/user.ts'

type ListState =
  | { status: 'loading'; users: User[] }
  | { status: 'error'; users: User[]; error: string }
  | { status: 'success'; users: User[] }

export type ListStatus = ListState['status']

/**
 * Server state for the users list: fetch, reload and local cache updates
 * after mutations (no refetch needed; the API returns the saved entity).
 *
 * Every fetch gets its own AbortController and the previous one is aborted,
 * so a stale response can never overwrite a newer one.
 */
export function useUsers() {
  const [state, setState] = useState<ListState>({ status: 'loading', users: [] })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    listUsers(controller.signal)
      .then((users) => setState({ status: 'success', users }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return
        setState((prev) => ({ status: 'error', users: prev.users, error: getErrorMessage(error) }))
      })

    return () => controller.abort()
  }, [reloadKey])

  function setUsers(change: (users: User[]) => User[]) {
    setState((prev) => ({ ...prev, users: change(prev.users) }))
  }

  function dropUser(id: number) {
    setUsers((users) => users.filter((u) => u.id !== id))
  }

  /** Re-reads one user after a 412 so the row shows (and edits start from) the latest version. */
  async function refreshUser(id: number) {
    try {
      const fresh = await getUser(id)
      setUsers((users) => users.map((u) => (u.id === id ? fresh : u)))
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) dropUser(id)
    }
  }

  /**
   * Runs a mutation on one user. 404 → it is gone, drop it from the cache;
   * 412 → someone saved first, refresh that row before rethrowing.
   */
  async function mutate(id: number, run: () => Promise<void>) {
    try {
      await run()
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) dropUser(id)
      if (isConflictError(error)) await refreshUser(id)
      throw error
    }
  }

  function reload() {
    setState((prev) => ({ status: 'loading', users: prev.users }))
    setReloadKey((key) => key + 1)
  }

  async function create(input: UserInput) {
    const user = await createUser(input)
    setUsers((users) => [...users, user])
  }

  /** PUT guarded by the version the row was loaded with (If-Match). */
  function update(id: number, input: UserInput, version: number) {
    return mutate(id, async () => {
      const user = await updateUser(id, input, version)
      setUsers((users) => users.map((u) => (u.id === id ? user : u)))
    })
  }

  function remove(id: number) {
    return mutate(id, async () => {
      await deleteUser(id)
      dropUser(id)
    })
  }

  return { ...state, reload, create, update, remove }
}

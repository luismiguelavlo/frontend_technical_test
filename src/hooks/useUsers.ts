import { useEffect, useState } from 'react'
import { createUser, deleteUser, getUser, listUsers, updateUser, userErrorMessage } from '../api/users.ts'
import { isAbortError, isConflictError, isNotFoundError } from '../api/client.ts'
import type { User, UserInput, UserListParams } from '../types/user.ts'

type ListState = {
  /** Rows of the current page (kept while the next page loads, to avoid flicker). */
  users: User[]
  nextCursor: string | null
  /** Matches for the current query; counted once per query (first page), then kept. */
  total: number | null
} & ({ status: 'loading' } | { status: 'success' } | { status: 'error'; error: string })

const INITIAL: ListState = { status: 'loading', users: [], nextCursor: null, total: null }

/**
 * Server state for one page of the users list (GET /users): search, filter
 * and sort run in the API; pages are walked with keyset cursors.
 *
 * - `cursors` is a stack: the cursor of every page visited, so "previous" just pops.
 *   Changing the query (params) resets it to the first page.
 * - Every fetch has its own AbortController and the previous one is aborted,
 *   so a stale response (old search, old page) never overwrites a newer one.
 */
export function useUsers(params: UserListParams) {
  const [state, setState] = useState<ListState>(INITIAL)
  const [cursors, setCursors] = useState<(string | null)[]>([null])
  const [reloadKey, setReloadKey] = useState(0)

  // New query → back to page 1 (reset during render, before the effect runs).
  const paramsKey = `${params.q}|${params.gender}|${params.sort}|${params.dir}|${params.limit}`
  const [trackedKey, setTrackedKey] = useState(paramsKey)
  if (trackedKey !== paramsKey) {
    setTrackedKey(paramsKey)
    setCursors([null])
    setState((prev) => ({ ...prev, status: 'loading' }))
  }

  const pageIndex = cursors.length - 1
  const cursor = cursors[pageIndex]
  const { q, gender, sort, dir, limit } = params

  useEffect(() => {
    const controller = new AbortController()
    const firstPage = pageIndex === 0

    listUsers({ q, gender, sort, dir, limit }, { cursor, withTotal: firstPage, signal: controller.signal })
      .then((page) => {
        // The page emptied (e.g. its last user was deleted): step back.
        if (page.users.length === 0 && !firstPage) {
          setCursors((stack) => stack.slice(0, -1))
          return
        }
        setState((prev) => ({
          status: 'success',
          users: page.users,
          nextCursor: page.nextCursor,
          total: page.total ?? prev.total,
        }))
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return
        setState((prev) => ({ ...prev, status: 'error', error: userErrorMessage(error) }))
      })

    return () => controller.abort()
  }, [q, gender, sort, dir, limit, cursor, pageIndex, reloadKey])

  function setLoading() {
    setState((prev) => ({ ...prev, status: 'loading' }))
  }

  function nextPage() {
    if (!state.nextCursor) return
    const next = state.nextCursor
    setLoading()
    setCursors((stack) => [...stack, next])
  }

  function previousPage() {
    if (pageIndex === 0) return
    setLoading()
    setCursors((stack) => stack.slice(0, -1))
  }

  /** Refetches the current page (keeps the rows on screen meanwhile). */
  function reload() {
    setLoading()
    setReloadKey((key) => key + 1)
  }

  function setUsers(change: (users: User[]) => User[]) {
    setState((prev) => ({ ...prev, users: change(prev.users) }))
  }

  function adjustTotal(delta: number) {
    setState((prev) => ({ ...prev, total: prev.total === null ? null : Math.max(0, prev.total + delta) }))
  }

  /** Someone else deleted it: refetch so the page refills, and fix the count. */
  function handleGone() {
    adjustTotal(-1)
    reload()
  }

  /** Re-reads one user after a 412 so the row shows (and edits start from) the latest version. */
  async function refreshUser(id: number): Promise<User | null> {
    try {
      const fresh = await getUser(id)
      setUsers((users) => users.map((u) => (u.id === id ? fresh : u)))
      return fresh
    } catch (error) {
      if (isNotFoundError(error)) handleGone()
      return null
    }
  }

  /**
   * 404 → the user is gone; 412 → someone saved first: refresh that row and hand
   * the fresh copy to `onConflict` (so an open form can retry on its version). Then rethrow.
   */
  async function mutate(id: number, run: () => Promise<void>, onConflict?: (fresh: User) => void) {
    try {
      await run()
    } catch (error) {
      if (isNotFoundError(error)) handleGone()
      if (isConflictError(error)) {
        const fresh = await refreshUser(id)
        if (fresh) onConflict?.(fresh)
      }
      throw error
    }
  }

  /** Where the new user lands depends on sort/filters: refetch the page. */
  async function create(input: UserInput) {
    await createUser(input)
    adjustTotal(1)
    reload()
  }

  /**
   * PUT guarded by the version the row was loaded with (If-Match). The row is
   * replaced at once, then the page is refetched: the edit may change its
   * position (sort) or whether it still matches the search/filter.
   */
  function update(id: number, input: UserInput, version: number, onConflict?: (fresh: User) => void) {
    return mutate(
      id,
      async () => {
        const user = await updateUser(id, input, version)
        setUsers((users) => users.map((u) => (u.id === id ? user : u)))
        reload()
      },
      onConflict,
    )
  }

  function remove(id: number) {
    return mutate(id, async () => {
      await deleteUser(id)
      adjustTotal(-1)
      reload()
    })
  }

  return {
    ...state,
    page: pageIndex + 1,
    hasPrevious: pageIndex > 0,
    hasNext: state.nextCursor !== null,
    nextPage,
    previousPage,
    reload,
    create,
    update,
    remove,
  }
}

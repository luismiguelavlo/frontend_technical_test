import { useState } from 'react'
import { userErrorMessage } from '../../api/users.ts'
import { AppLayout } from '../../components/layout/AppLayout.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { PageHeader } from '../../components/ui/PageHeader.tsx'
import { Pagination } from '../../components/ui/Pagination.tsx'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.ts'
import { useNotify } from '../../hooks/useToasts.ts'
import { useUsers } from '../../hooks/useUsers.ts'
import type { GenderFilter, SortDir, SortKey, User, UserInput } from '../../types/user.ts'
import { PAGE_SIZES } from '../../utils/pagination.ts'
import { DeleteUserDialog } from './DeleteUserDialog.tsx'
import { UserFilters } from './UserFilters.tsx'
import { UserFormDialog } from './UserFormDialog.tsx'
import { UserListEmpty, UserListError, UserListNoResults, UserListSkeleton } from './UserListStates.tsx'
import { UserTable } from './UserTable.tsx'

/** Open form dialog: `user: null` = create, a user = edit. */
interface FormTarget {
  user: User | null
}

export function UsersPage() {
  const notify = useNotify()
  // Query state lives here; search, filter, sort and pagination run in the API.
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<GenderFilter>('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'id', dir: 'asc' })
  const [limit, setLimit] = useState<number>(PAGE_SIZES[0])
  // Typing does not fire a request per keystroke.
  const q = useDebouncedValue(search.trim(), 300)

  const usersQuery = useUsers({ q, gender, sort: sort.key, dir: sort.dir, limit })
  const { status, users, total, reload, create, update, remove } = usersQuery

  const [formTarget, setFormTarget] = useState<FormTarget | null>(null)
  const [toDelete, setToDelete] = useState<User | null>(null)

  const hasQuery = q !== '' || gender !== 'all'
  // `total` is null until the first page of the first query arrives.
  const initialLoad = total === null && status !== 'error'

  /** Same column → flip direction; new column → ascending. */
  function changeSort(key: SortKey) {
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))
  }

  function clearFilters() {
    setSearch('')
    setGender('all')
  }

  function openForm(user: User | null = null) {
    setFormTarget({ user })
  }

  function closeForm() {
    setFormTarget(null)
  }

  /** Errors propagate to the form, which stays open with the user's input. */
  async function handleSave(input: UserInput) {
    const editing = formTarget?.user
    if (editing) {
      // 412: the form now targets the other person's version, so saving again overwrites it knowingly.
      await update(editing.id, input, editing.version, (fresh) => setFormTarget({ user: fresh }))
    } else {
      await create(input)
    }
    notify('success', editing ? 'Usuario actualizado' : 'Usuario creado')
    closeForm()
  }

  async function confirmDelete(user: User) {
    try {
      await remove(user.id)
      notify('success', 'Usuario eliminado')
    } catch (error) {
      notify('error', userErrorMessage(error))
    }
    setToDelete(null)
  }

  function renderResults() {
    if (status === 'error') return <UserListError message={usersQuery.error} onRetry={reload} />
    if (users.length === 0) {
      // While a new query loads, keep the previous "no results" instead of flashing.
      return hasQuery ? <UserListNoResults onClear={clearFilters} /> : <UserListEmpty onCreate={() => openForm()} />
    }

    const loading = status === 'loading'
    return (
      <>
        {/* Previous rows stay visible (dimmed) while the next page or query loads. */}
        <div className={`transition-opacity ${loading ? 'pointer-events-none opacity-50' : ''}`}>
          <UserTable
            users={users}
            sort={sort}
            onSort={changeSort}
            onEdit={openForm}
            onDelete={setToDelete}
          />
        </div>
        <Pagination
          page={usersQuery.page}
          pageSize={limit}
          count={users.length}
          total={total}
          hasPrevious={usersQuery.hasPrevious}
          hasNext={usersQuery.hasNext}
          disabled={loading}
          itemLabel="usuarios"
          onPrevious={usersQuery.previousPage}
          onNext={usersQuery.nextPage}
          onPageSizeChange={setLimit}
        />
      </>
    )
  }

  function renderList() {
    if (initialLoad) return <UserListSkeleton />
    // Nothing stored at all and no query: no filters to show yet.
    if (status === 'success' && total === 0 && !hasQuery) return <UserListEmpty onCreate={() => openForm()} />

    return (
      <>
        {/* Always mounted after the first load, so the search input keeps focus while results update. */}
        <UserFilters search={search} gender={gender} onSearchChange={setSearch} onGenderChange={setGender} />
        {renderResults()}
      </>
    )
  }

  return (
    <AppLayout apiStatus={status}>
      <PageHeader
        title="Usuarios"
        description="Administra el acceso y datos de los usuarios del sistema."
        actions={
          <Button icon="add" onClick={() => openForm()} disabled={initialLoad}>
            Nuevo usuario
          </Button>
        }
      />

      <Card aria-label="Listado de usuarios" aria-busy={status === 'loading'}>
        {renderList()}
      </Card>

      {formTarget && <UserFormDialog user={formTarget.user} onSubmit={handleSave} onClose={closeForm} />}

      {toDelete && (
        <DeleteUserDialog user={toDelete} onConfirm={() => confirmDelete(toDelete)} onCancel={() => setToDelete(null)} />
      )}
    </AppLayout>
  )
}

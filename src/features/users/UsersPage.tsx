import { useState } from 'react'
import { getErrorMessage, isConflictError } from '../../api/client.ts'
import { AppLayout } from '../../components/layout/AppLayout.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { PageHeader } from '../../components/ui/PageHeader.tsx'
import { Pagination } from '../../components/ui/Pagination.tsx'
import { usePagination } from '../../hooks/usePagination.ts'
import type { Notify } from '../../hooks/useToasts.ts'
import { useUsers } from '../../hooks/useUsers.ts'
import type { User, UserInput } from '../../types/user.ts'
import { filterUsers, type GenderFilter } from '../../utils/userFilters.ts'
import { DeleteUserDialog } from './DeleteUserDialog.tsx'
import { UserFilters } from './UserFilters.tsx'
import { UserFormDialog } from './UserFormDialog.tsx'
import { UserListEmpty, UserListError, UserListNoResults, UserListSkeleton } from './UserListStates.tsx'
import { UserTable } from './UserTable.tsx'

/** Open form dialog: `user: null` = create, a user = edit. */
interface FormTarget {
  user: User | null
}

export function UsersPage({ notify }: { notify: Notify }) {
  const usersQuery = useUsers()
  const { status, users, reload, create, update, remove } = usersQuery

  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<GenderFilter>('all')
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null)
  const [toDelete, setToDelete] = useState<User | null>(null)

  // The API returns the full list: filter and paginate client-side.
  const filtered = filterUsers(users, search, gender)
  const pagination = usePagination(filtered)

  function changeSearch(value: string) {
    setSearch(value)
    pagination.resetPage()
  }

  function changeGender(value: GenderFilter) {
    setGender(value)
    pagination.resetPage()
  }

  function clearFilters() {
    changeSearch('')
    setGender('all')
  }

  function openForm(user: User | null = null) {
    setFormTarget({ user })
  }

  function closeForm() {
    setFormTarget(null)
  }

  async function handleSave(input: UserInput) {
    const editing = formTarget?.user
    try {
      if (editing) await update(editing.id, input, editing.version)
      else await create(input)
    } catch (error) {
      // 412: the form was built from an old copy; the row is already refreshed.
      if (!isConflictError(error)) throw error
      notify('error', getErrorMessage(error))
      closeForm()
      return
    }
    notify('success', editing ? 'Usuario actualizado' : 'Usuario creado')
    closeForm()
  }

  async function confirmDelete(user: User) {
    try {
      await remove(user.id)
      notify('success', 'Usuario eliminado')
    } catch (error) {
      notify('error', getErrorMessage(error))
    }
    setToDelete(null)
  }

  function renderList() {
    if (status === 'loading') return <UserListSkeleton />
    if (status === 'error') return <UserListError message={usersQuery.error} onRetry={reload} />
    if (users.length === 0) return <UserListEmpty onCreate={() => openForm()} />

    return (
      <>
        <UserFilters search={search} gender={gender} onSearchChange={changeSearch} onGenderChange={changeGender} />
        {filtered.length === 0 ? (
          <UserListNoResults onClear={clearFilters} />
        ) : (
          <>
            <UserTable users={pagination.pageItems} onEdit={openForm} onDelete={setToDelete} />
            <Pagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              itemLabel="usuarios"
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
            />
          </>
        )}
      </>
    )
  }

  return (
    <AppLayout apiStatus={status}>
      <PageHeader
        title="Usuarios"
        description="Administra el acceso y datos de los usuarios del sistema."
        actions={
          <Button icon="add" onClick={() => openForm()} disabled={status === 'loading'}>
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

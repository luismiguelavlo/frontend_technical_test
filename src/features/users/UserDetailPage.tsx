import { useState } from 'react'
import { getErrorMessage, isConflictError } from '../../api/client.ts'
import { AppLayout } from '../../components/layout/AppLayout.tsx'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Icon } from '../../components/ui/Icon.tsx'
import type { Notify } from '../../hooks/useToasts.ts'
import { useUser, type UserStatus } from '../../hooks/useUser.ts'
import type { ListStatus } from '../../hooks/useUsers.ts'
import type { User, UserInput } from '../../types/user.ts'
import { navigate, paths } from '../../utils/routes.ts'
import { DeleteUserDialog } from './DeleteUserDialog.tsx'
import { UserDetailGrid } from './UserDetailGrid.tsx'
import { UserDetailError, UserDetailNotFound, UserDetailSkeleton } from './UserDetailStates.tsx'
import { UserFormDialog } from './UserFormDialog.tsx'
import { UserPersonalData } from './UserPersonalData.tsx'
import { UserProfileHeader } from './UserProfileHeader.tsx'
import { UserRecordMeta } from './UserRecordMeta.tsx'

/** A 404 still means the API answered. */
const API_STATUS: Record<UserStatus, ListStatus> = {
  loading: 'loading',
  error: 'error',
  notFound: 'success',
  success: 'success',
}

type Dialog = 'edit' | 'delete' | null

interface UserDetailPageProps {
  id: number
  notify: Notify
}

/** GET /users/{id}: profile + edit (PUT) and delete (DELETE) actions. */
export function UserDetailPage({ id, notify }: UserDetailPageProps) {
  const { state, reload, update, remove } = useUser(id)
  const [dialog, setDialog] = useState<Dialog>(null)
  const user = state.status === 'success' ? state.user : null

  async function handleSave(input: UserInput, version: number) {
    try {
      await update(input, version)
    } catch (error) {
      // 412: the form was built from an old copy; the page now shows the current one.
      if (!isConflictError(error)) throw error
      notify('error', getErrorMessage(error))
      setDialog(null)
      return
    }
    notify('success', 'Usuario actualizado')
    setDialog(null)
  }

  async function confirmDelete() {
    try {
      await remove()
      notify('success', 'Usuario eliminado')
      navigate(paths.users())
    } catch (error) {
      notify('error', getErrorMessage(error))
      setDialog(null)
    }
  }

  function renderContent() {
    switch (state.status) {
      case 'loading':
        return <UserDetailSkeleton />
      case 'notFound':
        return <UserDetailNotFound id={id} />
      case 'error':
        return <UserDetailError message={state.error} onRetry={reload} />
      case 'success':
        return <UserDetailContent user={state.user} notify={notify} onEdit={() => setDialog('edit')} />
    }
  }

  return (
    <AppLayout apiStatus={API_STATUS[state.status]}>
      <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
        <div className="flex flex-col gap-space-xs">
          <Breadcrumbs
            items={[
              { label: 'Usuarios', href: paths.users(), icon: 'group' },
              { label: `Usuario #${id}` },
            ]}
          />
          <a
            href={paths.users()}
            className="group inline-flex items-center gap-1.5 self-start text-label-md text-on-surface transition-colors hover:text-primary"
          >
            <Icon name="arrowBack" className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Volver al listado
          </a>
        </div>

        {user && (
          <div className="flex flex-wrap items-center gap-space-sm">
            <Button variant="secondary" icon="edit" onClick={() => setDialog('edit')}>
              Editar usuario
            </Button>
            <Button variant="danger" icon="delete" onClick={() => setDialog('delete')}>
              Eliminar usuario
            </Button>
          </div>
        )}
      </div>

      <div aria-busy={state.status === 'loading'} className="flex flex-col gap-space-lg">
        {renderContent()}
      </div>

      {user && dialog === 'edit' && <UserFormDialog user={user} onSubmit={(input) => handleSave(input, user.version)} onClose={() => setDialog(null)} />}
      {user && dialog === 'delete' && (
        <DeleteUserDialog user={user} onConfirm={confirmDelete} onCancel={() => setDialog(null)} />
      )}
    </AppLayout>
  )
}

interface UserDetailContentProps {
  user: User
  notify: Notify
  onEdit: () => void
}

function UserDetailContent({ user, notify, onEdit }: UserDetailContentProps) {
  return (
    <>
      <UserProfileHeader
        user={user}
        onEmailCopied={() => notify('success', `Email copiado: ${user.email}`)}
        onCopyError={() => notify('error', 'No se pudo copiar al portapapeles.')}
      />
      <UserDetailGrid main={<UserPersonalData user={user} onEdit={onEdit} />} aside={<UserRecordMeta user={user} />} />
    </>
  )
}

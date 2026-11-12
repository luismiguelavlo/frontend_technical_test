import { ConfirmDialog } from '../../components/ui/ConfirmDialog.tsx'
import type { User } from '../../types/user.ts'
import { UserSummary } from './UserSummary.tsx'

interface DeleteUserDialogProps {
  user: User
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function DeleteUserDialog({ user, onConfirm, onCancel }: DeleteUserDialogProps) {
  return (
    <ConfirmDialog
      title={`Eliminar usuario #${user.id}`}
      description="Esta acción no se puede deshacer."
      confirmLabel="Eliminar usuario"
      loadingLabel="Eliminando…"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p>Se eliminará permanentemente el siguiente usuario:</p>
      <UserSummary user={user} />
    </ConfirmDialog>
  )
}

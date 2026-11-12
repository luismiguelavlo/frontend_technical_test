import { Button } from '../../components/ui/Button.tsx'
import { Card } from '../../components/ui/Card.tsx'
import { StatePanel } from '../../components/ui/StatePanel.tsx'
import { navigate, paths } from '../../utils/routes.ts'
import { UserPersonalDataSkeleton } from './UserPersonalData.tsx'
import { UserProfileHeaderSkeleton } from './UserProfileHeader.tsx'
import { UserRecordMetaSkeleton } from './UserRecordMeta.tsx'
import { UserDetailGrid } from './UserDetailGrid.tsx'

/** Whole detail placeholder: hero + data + metadata cards. */
export function UserDetailSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        Cargando usuario…
      </span>
      <UserProfileHeaderSkeleton />
      <UserDetailGrid main={<UserPersonalDataSkeleton />} aside={<UserRecordMetaSkeleton />} />
    </>
  )
}

function BackToListButton() {
  return (
    <Button variant="secondary" icon="arrowBack" onClick={() => navigate(paths.users())}>
      Volver al listado
    </Button>
  )
}

export function UserDetailNotFound({ id }: { id: number }) {
  return (
    <Card>
      <StatePanel
        icon="personOff"
        title={`El usuario #${id} no existe`}
        description="Puede haber sido eliminado o el enlace es incorrecto."
        action={<BackToListButton />}
      />
    </Card>
  )
}

export function UserDetailError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card>
      <StatePanel
        tone="error"
        icon="cloudOff"
        title="No se pudo cargar el usuario"
        description={`Verifica que la API esté disponible. (${message})`}
        action={
          <div className="flex flex-wrap justify-center gap-space-sm">
            <BackToListButton />
            <Button icon="refresh" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        }
      />
    </Card>
  )
}

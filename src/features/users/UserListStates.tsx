import { Button } from '../../components/ui/Button.tsx'
import { PaginationSkeleton } from '../../components/ui/Pagination.tsx'
import { StatePanel } from '../../components/ui/StatePanel.tsx'
import { UserFiltersSkeleton } from './UserFilters.tsx'
import { UserTableSkeleton } from './UserTable.tsx'

/** Whole list placeholder: filters + table rows + pagination. */
export function UserListSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        Cargando usuarios…
      </span>
      <UserFiltersSkeleton />
      <UserTableSkeleton />
      <PaginationSkeleton />
    </>
  )
}

export function UserListError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StatePanel
      tone="error"
      icon="cloudOff"
      title="No se pudieron cargar los usuarios"
      description={`Verifica que la API esté disponible. (${message})`}
      action={
        <Button variant="secondary" icon="refresh" onClick={onRetry}>
          Reintentar
        </Button>
      }
    />
  )
}

export function UserListEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <StatePanel
      icon="group"
      title="Aún no hay usuarios"
      description="Crea el primer usuario para empezar a gestionar el acceso al sistema."
      action={
        <Button icon="add" onClick={onCreate}>
          Crear primer usuario
        </Button>
      }
    />
  )
}

export function UserListNoResults({ onClear }: { onClear: () => void }) {
  return (
    <StatePanel
      icon="search"
      title="Sin resultados"
      description="Ningún usuario coincide con la búsqueda o el filtro seleccionado."
      action={
        <Button variant="secondary" onClick={onClear}>
          Limpiar filtros
        </Button>
      }
    />
  )
}

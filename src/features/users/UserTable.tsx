import { IconButton, IconLink } from '../../components/ui/Button.tsx'
import { DataTable, type Column, type SortState } from '../../components/ui/DataTable.tsx'
import { Skeleton } from '../../components/ui/Skeleton.tsx'
import { fullName, type SortKey, type User } from '../../types/user.ts'
import { paths } from '../../utils/routes.ts'
import { GenderBadge } from './GenderBadge.tsx'
import { UserAvatar } from './UserAvatar.tsx'

interface UserTableProps {
  users: User[]
  loading?: boolean
  /** Server-side sort; omit to render plain headers (e.g. skeleton). */
  sort?: SortState<SortKey>
  onSort?: (key: SortKey) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const noop = () => {}

/** Loading placeholder with the table's exact layout (no rows, no actions). */
export function UserTableSkeleton() {
  return <UserTable users={[]} loading onEdit={noop} onDelete={noop} />
}

/** Picks a width for skeleton row `i`, so placeholder rows don't look identical. */
function vary(i: number, widths: string[]): string {
  return widths[i % widths.length]
}

export function UserTable({ users, loading = false, sort, onSort, onEdit, onDelete }: UserTableProps) {
  const columns: Column<User, SortKey>[] = [
    {
      key: 'id',
      header: 'ID',
      sortKey: 'id',
      className: 'w-16 pl-space-md pr-space-sm',
      cellClassName: 'text-label-sm text-outline',
      cell: (u) => `#${u.id}`,
      skeleton: <Skeleton className="h-3 w-8" />,
    },
    {
      key: 'name',
      header: 'Nombre completo',
      sortKey: 'first_name',
      sortLabel: 'Nombre',
      cell: (u) => (
        <div className="flex items-center gap-space-sm">
          <UserAvatar user={u} />
          <a
            href={paths.userDetail(u.id)}
            className="font-bold whitespace-nowrap underline-offset-2 transition-colors hover:text-primary hover:underline"
          >
            {fullName(u)}
          </a>
        </div>
      ),
      skeleton: (i) => (
        <div className="flex items-center gap-space-sm">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className={`h-3.5 ${vary(i, ['w-36', 'w-44', 'w-32', 'w-40'])}`} />
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortKey: 'email',
      cellClassName: 'text-on-surface-variant',
      cell: (u) => (
        <a href={`mailto:${u.email}`} className="underline-offset-2 transition-colors hover:text-primary hover:underline">
          {u.email}
        </a>
      ),
      skeleton: (i) => <Skeleton className={`h-3 ${vary(i, ['w-48', 'w-40', 'w-52', 'w-44', 'w-36'])}`} />,
    },
    {
      key: 'gender',
      header: 'Género',
      cell: (u) => <GenderBadge gender={u.gender} />,
      skeleton: (i) => <Skeleton className={`h-5 rounded-full ${vary(i, ['w-20', 'w-24', 'w-16'])}`} />,
    },
    {
      key: 'telephone',
      header: 'Teléfono',
      cellClassName: 'text-body-sm whitespace-nowrap',
      cell: (u) =>
        u.telephone ? (
          <span className="font-mono text-on-surface-variant">{u.telephone}</span>
        ) : (
          <span aria-label="Sin teléfono" className="text-outline">
            —
          </span>
        ),
      skeleton: (i) => <Skeleton className={`h-3 ${vary(i, ['w-28', 'w-32', 'w-24'])}`} />,
    },
    {
      key: 'age',
      header: 'Edad',
      sortKey: 'age',
      cellClassName: 'text-label-md whitespace-nowrap',
      cell: (u) => (
        <>
          {u.age} <span className="text-body-sm font-normal text-outline">años</span>
        </>
      ),
      skeleton: <Skeleton className="h-3 w-14" />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'pl-space-sm pr-space-md text-right',
      cell: (u) => (
        <div className="flex items-center justify-end gap-1">
          <IconLink icon="visibility" label={`Ver detalle de ${fullName(u)}`} tone="primary" href={paths.userDetail(u.id)} />
          <IconButton icon="edit" label={`Editar a ${fullName(u)}`} tone="primary" onClick={() => onEdit(u)} />
          <IconButton icon="delete" label={`Eliminar a ${fullName(u)}`} tone="danger" onClick={() => onDelete(u)} />
        </div>
      ),
      skeleton: (
        <div className="flex items-center justify-end gap-1">
          <Skeleton className="size-7" />
          <Skeleton className="size-7" />
          <Skeleton className="size-7" />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={users}
      rowKey={(u) => u.id}
      loading={loading}
      sort={sort}
      onSort={onSort}
    />
  )
}

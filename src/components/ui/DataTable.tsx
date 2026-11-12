import type { Key, ReactNode } from 'react'
import { Icon } from './Icon.tsx'
import { Skeleton } from './Skeleton.tsx'

export interface SortState<K extends string = string> {
  key: K
  dir: 'asc' | 'desc'
}

export interface Column<T, K extends string = string> {
  /** Unique column id. */
  key: string
  header: string
  /** Padding/alignment applied to both <th> and <td>. Defaults to `px-space-md`. */
  className?: string
  /** Extra classes for the <td>. */
  cellClassName?: string
  cell: (row: T) => ReactNode
  /** Makes the header a sort button; the value is passed to `onSort`. */
  sortKey?: K
  /** What the sort actually uses, for the button hint (defaults to the header). */
  sortLabel?: string
  /**
   * Placeholder shown while loading. Defaults to a text bar.
   * A function receives the skeleton row index (to vary widths between rows).
   */
  skeleton?: ReactNode | ((rowIndex: number) => ReactNode)
}

function renderSkeleton<T, K extends string>(col: Column<T, K>, rowIndex: number): ReactNode {
  if (typeof col.skeleton === 'function') return col.skeleton(rowIndex)
  return col.skeleton ?? <Skeleton />
}

interface DataTableProps<T, K extends string> {
  columns: Column<T, K>[]
  rows: T[]
  rowKey: (row: T) => Key
  loading?: boolean
  skeletonRows?: number
  /** Current sort (server-side); highlights the matching column. */
  sort?: SortState<K>
  onSort?: (key: K) => void
}

const SORT_LABELS = { asc: 'ascendente', desc: 'descendente' }

interface SortHeaderProps {
  label: string
  /** Name of what the column sorts by, e.g. "nombre" for a full-name column. */
  hint: string
  active: boolean
  dir: SortState['dir']
  onClick: () => void
}

function SortHeader({ label, hint, active, dir, onClick }: SortHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={
        active
          ? `Ordenado por ${hint.toLowerCase()}, ${SORT_LABELS[dir]}; clic para invertir`
          : `Ordenar por ${hint.toLowerCase()}`
      }
      className={`-mx-1 inline-flex items-center gap-1 rounded px-1 uppercase transition-colors hover:text-on-surface ${
        active ? 'text-primary' : ''
      }`}
    >
      {label}
      <Icon
        name={active ? (dir === 'asc' ? 'arrowUpward' : 'arrowDownward') : 'unfoldMore'}
        className={`size-3.5 ${active ? '' : 'opacity-50'}`}
      />
    </button>
  )
}

/** Generic table with sticky header, row hover and a skeleton loading state. */
export function DataTable<T, K extends string = string>({
  columns,
  rows,
  rowKey,
  loading = false,
  skeletonRows = 10,
  sort,
  onSort,
}: DataTableProps<T, K>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left" aria-busy={loading}>
        <thead className="sticky top-0 z-10 bg-surface-container-high/60 backdrop-blur-sm">
          <tr className="h-10 text-label-xs tracking-wider text-on-surface-variant uppercase">
            {columns.map((col) => {
              const { sortKey } = col
              const active = sortKey !== undefined && sort?.key === sortKey
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={active && sort ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={`py-2 ${col.className ?? 'px-space-md'}`}
                >
                  {sortKey !== undefined && onSort ? (
                    <SortHeader
                      label={col.header}
                      hint={col.sortLabel ?? col.header}
                      active={active}
                      dir={sort?.dir ?? 'asc'}
                      onClick={() => onSort(sortKey)}
                    />
                  ) : (
                    col.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="text-body-md text-on-surface">
          {loading
            ? Array.from({ length: skeletonRows }, (_, i) => (
                <tr key={i} className="h-14">
                  {columns.map((col) => (
                    <td key={col.key} className={`py-space-sm ${col.className ?? 'px-space-md'}`}>
                      {renderSkeleton(col, i)}
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr key={rowKey(row)} className="h-14 transition-colors hover:bg-surface-container-low">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-space-sm ${col.className ?? 'px-space-md'} ${col.cellClassName ?? ''}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}

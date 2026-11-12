import type { Key, ReactNode } from 'react'
import { Skeleton } from './Skeleton.tsx'

export interface Column<T> {
  /** Unique column id. */
  key: string
  header: string
  /** Padding/alignment applied to both <th> and <td>. Defaults to `px-space-md`. */
  className?: string
  /** Extra classes for the <td>. */
  cellClassName?: string
  cell: (row: T) => ReactNode
  /**
   * Placeholder shown while loading. Defaults to a text bar.
   * A function receives the skeleton row index (to vary widths between rows).
   */
  skeleton?: ReactNode | ((rowIndex: number) => ReactNode)
}

function renderSkeleton<T>(col: Column<T>, rowIndex: number): ReactNode {
  if (typeof col.skeleton === 'function') return col.skeleton(rowIndex)
  return col.skeleton ?? <Skeleton />
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => Key
  loading?: boolean
  skeletonRows?: number
}

/** Generic table with sticky header, row hover and a skeleton loading state. */
export function DataTable<T>({ columns, rows, rowKey, loading = false, skeletonRows = 10 }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left" aria-busy={loading}>
        <thead className="sticky top-0 z-10 bg-surface-container-high/60 backdrop-blur-sm">
          <tr className="h-10 text-label-xs tracking-wider text-on-surface-variant uppercase">
            {columns.map((col) => (
              <th key={col.key} scope="col" className={`py-2 ${col.className ?? 'px-space-md'}`}>
                {col.header}
              </th>
            ))}
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

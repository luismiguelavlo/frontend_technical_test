import { IconButton } from './Button.tsx'
import { Select } from './Select.tsx'
import { Skeleton } from './Skeleton.tsx'
import { PAGE_SIZES, getPageItems } from '../../utils/pagination.ts'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  totalPages: number
  /** Plural noun for the count text, e.g. "usuarios". */
  itemLabel?: string
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const fmt = new Intl.NumberFormat('es')

/** Placeholder with the same layout as <Pagination> while data loads. */
export function PaginationSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col items-center justify-between gap-space-md p-space-md sm:flex-row">
      <div className="flex items-center gap-space-md">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-6 w-24" tone="muted" />
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="size-8" />
        ))}
      </div>
    </div>
  )
}

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  itemLabel = 'registros',
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col items-center justify-between gap-space-md p-space-md sm:flex-row">
      <div className="flex items-center gap-space-md">
        <span className="text-body-sm text-on-surface-variant">
          Mostrando <span className="font-semibold text-on-surface">{fmt.format(from)}</span> a{' '}
          <span className="font-semibold text-on-surface">{fmt.format(to)}</span> de{' '}
          <span className="font-semibold text-on-surface">{fmt.format(total)}</span> {itemLabel}
        </span>
        <Select
          size="sm"
          aria-label="Usuarios por página"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} por página
            </option>
          ))}
        </Select>
      </div>

      <nav aria-label="Paginación de resultados" className="inline-flex items-center gap-1">
        <IconButton
          icon="chevronLeft"
          label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
              className={`size-8 rounded text-label-sm transition-colors ${
                item === page
                  ? 'bg-primary font-semibold text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="px-1 text-label-sm text-on-surface-variant">
              …
            </span>
          ),
        )}
        <IconButton
          icon="chevronRight"
          label="Página siguiente"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </nav>
    </div>
  )
}

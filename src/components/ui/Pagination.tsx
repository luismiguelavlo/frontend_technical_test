import { IconButton } from './Button.tsx'
import { Select } from './Select.tsx'
import { Skeleton } from './Skeleton.tsx'
import { PAGE_SIZES } from '../../utils/pagination.ts'

interface PaginationProps {
  /** 1-based page number. */
  page: number
  pageSize: number
  /** Rows on the current page. */
  count: number
  /** Total matches, if known. */
  total: number | null
  hasPrevious: boolean
  hasNext: boolean
  /** Disables the controls (e.g. while a page is loading). */
  disabled?: boolean
  /** Plural noun for the count text, e.g. "usuarios". */
  itemLabel?: string
  onPrevious: () => void
  onNext: () => void
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
        <Skeleton className="size-8" />
        <Skeleton className="h-4 w-16" tone="muted" />
        <Skeleton className="size-8" />
      </div>
    </div>
  )
}

/**
 * Previous/next pagination for cursor (keyset) lists: there are no page
 * numbers to jump to, only the neighbours of the current page.
 */
export function Pagination({
  page,
  pageSize,
  count,
  total,
  hasPrevious,
  hasNext,
  disabled = false,
  itemLabel = 'registros',
  onPrevious,
  onNext,
  onPageSizeChange,
}: PaginationProps) {
  const from = count === 0 ? 0 : (page - 1) * pageSize + 1
  const to = from + count - (count === 0 ? 0 : 1)

  return (
    <div className="flex flex-col items-center justify-between gap-space-md p-space-md sm:flex-row">
      <div className="flex items-center gap-space-md">
        <span aria-live="polite" className="text-body-sm text-on-surface-variant">
          Mostrando <span className="font-semibold text-on-surface">{fmt.format(from)}</span> a{' '}
          <span className="font-semibold text-on-surface">{fmt.format(to)}</span>
          {total !== null && (
            <>
              {' '}
              de <span className="font-semibold text-on-surface">{fmt.format(total)}</span>
            </>
          )}{' '}
          {itemLabel}
        </span>
        <Select
          size="sm"
          aria-label={`${itemLabel} por página`}
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

      <nav aria-label="Paginación de resultados" className="inline-flex items-center gap-space-sm">
        <IconButton
          icon="chevronLeft"
          label="Página anterior"
          disabled={disabled || !hasPrevious}
          onClick={onPrevious}
        />
        <span aria-current="page" className="min-w-16 text-center text-label-sm text-on-surface">
          Página {fmt.format(page)}
        </span>
        <IconButton icon="chevronRight" label="Página siguiente" disabled={disabled || !hasNext} onClick={onNext} />
      </nav>
    </div>
  )
}

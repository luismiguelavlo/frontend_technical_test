import { useState } from 'react'
import { PAGE_SIZES } from '../utils/pagination.ts'

/** Client-side pagination for any list. Changing the page size goes back to page 1. */
export function usePagination<T>(items: T[], initialPageSize: number = PAGE_SIZES[0]) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  // Clamp: filtering or deleting can leave the stored page past the end.
  const current = Math.min(page, totalPages)

  return {
    page: current,
    pageSize,
    totalPages,
    total: items.length,
    pageItems: items.slice((current - 1) * pageSize, current * pageSize),
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size)
      setPage(1)
    },
    resetPage: () => setPage(1),
  }
}

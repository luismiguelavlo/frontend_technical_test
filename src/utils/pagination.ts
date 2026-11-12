export const PAGE_SIZES = [10, 25, 50] as const

type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

/** Page buttons to render, e.g. [1, 2, 3, 4, 'ellipsis-end', 142]. */
export function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 3) return [1, 2, 3, 4, 'ellipsis-end', total]
  if (current >= total - 2) return [1, 'ellipsis-start', total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis-start', current - 1, current, current + 1, 'ellipsis-end', total]
}

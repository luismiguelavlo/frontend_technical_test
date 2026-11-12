import type { ReactNode } from 'react'
import { Skeleton } from './Skeleton.tsx'

/** Label/value grid (<dl>): 1 column on mobile, 2 from `sm`. */
export function DescriptionList({ children, columns = 2 }: { children: ReactNode; columns?: 1 | 2 }) {
  return (
    <dl className={`grid grid-cols-1 gap-x-space-lg gap-y-space-md ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {children}
    </dl>
  )
}

interface DescriptionItemProps {
  label: string
  children: ReactNode
}

export function DescriptionItem({ label, children }: DescriptionItemProps) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-label-xs tracking-wider text-on-surface-variant uppercase">{label}</dt>
      <dd className="break-words text-body-md font-medium text-on-surface">{children}</dd>
    </div>
  )
}

/** Placeholder with the same layout as a <DescriptionItem>. */
export function DescriptionItemSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-1.5">
      <Skeleton className="h-2.5 w-16" tone="muted" />
      <Skeleton className="h-4 w-36" />
    </div>
  )
}

interface SkeletonProps {
  /** Size/shape classes (e.g. `h-3 w-24`, `size-8 rounded-full`). */
  className?: string
  /** `muted` = lighter tone, for secondary lines and pills. */
  tone?: 'default' | 'muted'
}

/** Pulsing placeholder block. */
export function Skeleton({ className = 'h-3 w-24', tone = 'default' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded ${tone === 'muted' ? 'bg-surface-container' : 'bg-surface-variant'} ${className}`}
    />
  )
}

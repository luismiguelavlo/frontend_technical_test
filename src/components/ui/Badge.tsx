import type { HTMLAttributes, ReactNode } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  /** Background/text color classes of the pill. */
  className?: string
  /** Color class of the leading dot. */
  dotClassName?: string
}

/** Rounded pill with a leading status dot. */
export function Badge({ children, className = '', dotClassName = 'bg-outline', ...rest }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-xs ${className}`} {...rest}>
      <span className={`size-1.5 rounded-full ${dotClassName}`} />
      {children}
    </span>
  )
}

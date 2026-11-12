import type { HTMLAttributes, ReactNode } from 'react'
import type { IconName } from './Icon.tsx'
import { IconCircle } from './IconCircle.tsx'

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

/** White rounded surface (renders a <section>). */
export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <section
      className={`flex w-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}

interface CardHeaderProps {
  /** id for the <h2>, so the card can be `aria-labelledby` it. */
  titleId?: string
  title: string
  description?: string
  icon?: IconName
  /** Right-aligned control (button, link…). */
  action?: ReactNode
}

/** Icon badge + title (+ description) + optional action, for content cards. */
export function CardHeader({ titleId, title, description, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-space-md">
      <div className="flex items-center gap-space-sm">
        {icon && <IconCircle icon={icon} tone="neutral" size="sm" shape="square" />}
        <div>
          <h2 id={titleId} className="text-title-md text-on-surface">
            {title}
          </h2>
          {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

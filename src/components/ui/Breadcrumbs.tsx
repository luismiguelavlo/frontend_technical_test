import { Fragment } from 'react'
import { Icon, type IconName } from './Icon.tsx'

export interface Crumb {
  label: string
  /** Omit for the current page (last crumb). */
  href?: string
  icon?: IconName
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex flex-wrap items-center gap-space-xs text-label-sm text-on-surface-variant">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && (
              <li aria-hidden="true" className="text-outline-variant">
                /
              </li>
            )}
            <li>
              {item.href ? (
                <a href={item.href} className="flex items-center gap-1 transition-colors hover:text-primary">
                  {item.icon && <Icon name={item.icon} className="size-4" />}
                  {item.label}
                </a>
              ) : (
                <span aria-current="page" className="font-semibold text-on-surface">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

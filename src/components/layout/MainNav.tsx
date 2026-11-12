export interface NavItem {
  label: string
  href: string
  active?: boolean
}

export function MainNav({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Principal" className="hidden items-center gap-space-xs xl:flex">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-current={item.active ? 'page' : undefined}
          className={`rounded px-space-sm py-space-xs text-label-md transition-colors ${
            item.active
              ? 'bg-surface-container-high text-on-surface'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

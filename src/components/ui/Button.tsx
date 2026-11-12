import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon.tsx'
import { Spinner } from './Spinner.tsx'

type Variant = 'primary' | 'secondary' | 'danger'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary shadow-md hover:bg-primary-container',
  secondary:
    'bg-surface-container-lowest text-on-surface shadow-sm ring-1 ring-outline-variant/60 hover:bg-surface-container-high',
  danger: 'bg-error text-on-error shadow-md hover:bg-on-error-container',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: IconName
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  icon,
  loading = false,
  disabled,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-space-xs rounded px-space-md py-space-sm text-label-md transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Spinner /> : icon && <Icon name={icon} className="size-[18px]" />}
      <span>{children}</span>
    </button>
  )
}

const TONES = {
  default: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low',
  primary: 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high',
  danger: 'text-on-surface-variant hover:text-error hover:bg-error-container',
  inverse: 'text-inverse-on-surface/70 hover:text-inverse-on-surface',
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  label: string
  tone?: keyof typeof TONES
}

export function IconButton({ icon, label, tone = 'default', className = '', ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`rounded p-1.5 transition-colors disabled:opacity-30 ${TONES[tone]} ${className}`}
      {...rest}
    >
      <Icon name={icon} className="size-[18px]" />
    </button>
  )
}

interface IconLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  icon: IconName
  label: string
  tone?: keyof typeof TONES
}

/** IconButton look for navigation (a real link: middle-click / open in new tab work). */
export function IconLink({ icon, label, tone = 'default', className = '', ...rest }: IconLinkProps) {
  return (
    <a aria-label={label} title={label} className={`rounded p-1.5 transition-colors ${TONES[tone]} ${className}`} {...rest}>
      <Icon name={icon} className="size-[18px]" />
    </a>
  )
}

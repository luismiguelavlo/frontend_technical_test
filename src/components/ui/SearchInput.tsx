import type { InputHTMLAttributes } from 'react'
import { Icon } from './Icon.tsx'
import { filledFieldClass } from './styles.ts'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: string
  onValueChange: (value: string) => void
  /** Accessible name (the placeholder is not a label). */
  label: string
}

export function SearchInput({ value, onValueChange, label, className = '', ...rest }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Icon
        name="search"
        className="pointer-events-none absolute left-space-sm top-1/2 size-[18px] -translate-y-1/2 text-on-surface-variant"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        aria-label={label}
        className={`${filledFieldClass()} py-2 pl-9 pr-space-md text-body-md transition-colors`}
        {...rest}
      />
    </div>
  )
}

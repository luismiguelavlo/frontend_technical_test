import type { SelectHTMLAttributes } from 'react'
import { Icon } from './Icon.tsx'
import { filledFieldClass } from './styles.ts'

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md'
  /** Classes for the wrapper (width, alignment...). */
  wrapperClassName?: string
}

/** Filled native select with the design's chevron (toolbars, pagination). */
export function Select({ size = 'md', wrapperClassName = '', className = '', children, ...rest }: SelectProps) {
  const sizing = size === 'sm' ? 'py-1 pl-space-sm pr-6 text-label-xs' : 'py-2 pl-space-md pr-8 text-label-md'

  return (
    <div className={`relative ${wrapperClassName}`}>
      <select className={`${filledFieldClass()} appearance-none shadow-none ${sizing} ${className}`} {...rest}>
        {children}
      </select>
      <Icon
        name="expandMore"
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-on-surface-variant ${
          size === 'sm' ? 'right-1 size-4' : 'right-2 size-5'
        }`}
      />
    </div>
  )
}

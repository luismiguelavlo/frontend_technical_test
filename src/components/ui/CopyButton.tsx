import type { ReactNode } from 'react'
import { Icon } from './Icon.tsx'

interface CopyButtonProps {
  value: string
  /** Accessible name, e.g. "Copiar email". */
  label: string
  /** Visible content; defaults to the value. */
  children?: ReactNode
  onCopied?: () => void
  onError?: () => void
}

/** Inline text that copies `value` to the clipboard on click. */
export function CopyButton({ value, label, children, onCopied, onError }: CopyButtonProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      onCopied?.()
    } catch {
      onError?.()
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      title={label}
      className="group inline-flex min-w-0 items-center gap-1 transition-colors hover:text-primary"
    >
      <span className="truncate">{children ?? value}</span>
      <Icon name="contentCopy" className="size-3.5 transition-transform group-hover:scale-110" />
    </button>
  )
}

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { IconButton } from './Button.tsx'
import type { IconName } from './Icon.tsx'
import { IconCircle } from './IconCircle.tsx'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-3xl',
}

interface ModalProps {
  /** id of the element that names the dialog (usually the title). */
  labelledBy: string
  describedBy?: string
  role?: 'dialog' | 'alertdialog'
  size?: keyof typeof SIZES
  /** When false, Escape and backdrop clicks are ignored (e.g. while saving). */
  dismissible?: boolean
  onClose: () => void
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusableIn(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest('fieldset:disabled'))
}

/**
 * Centered dialog over a blurred backdrop. Render it conditionally to open/close.
 * While open: focus moves inside (unless a child autofocused) and Tab cycles within it,
 * page scroll is locked, Escape closes it (if dismissible); on close, focus returns
 * to the element that opened it.
 */
export function Modal({
  labelledBy,
  describedBy,
  role = 'dialog',
  size = 'lg',
  dismissible = true,
  onClose,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    if (dialog && !dialog.contains(document.activeElement)) (focusableIn(dialog)[0] ?? dialog).focus()

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
      // Deferred so the opener is focusable again (e.g. a re-enabled button). Skipped if the
      // dialog is still in the DOM (StrictMode's dev-only effect re-run).
      requestAnimationFrame(() => {
        if (!dialog?.isConnected && opener?.isConnected) opener.focus()
      })
    }
  }, [])

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      if (dismissible) onClose()
      return
    }
    if (e.key !== 'Tab' || !dialogRef.current) return

    const items = focusableIn(dialogRef.current)
    if (items.length === 0) {
      e.preventDefault()
      return
    }
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex overflow-y-auto p-space-sm md:p-space-lg" onKeyDown={handleKeyDown}>
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm"
        onClick={dismissible ? onClose : undefined}
      />
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`relative m-auto w-full overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl outline-none ${SIZES[size]}`}
      >
        {children}
      </div>
    </div>
  )
}

/** Padded content area. */
export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="space-y-space-md px-space-lg pb-space-lg">{children}</div>
}

/** Bottom action bar; buttons go right (stacked, primary on top, on mobile). */
export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse items-stretch justify-end gap-space-sm border-t border-surface-container-high px-space-lg py-space-md sm:flex-row sm:items-center">
      {children}
    </div>
  )
}

interface ModalHeaderProps {
  titleId: string
  title: string
  description?: string
  icon: IconName
  iconTone?: 'primary' | 'neutral' | 'error'
  /** Omit to hide the close button. */
  onClose?: () => void
  closeDisabled?: boolean
}

/** Icon badge + title + description + close button. */
export function ModalHeader({
  titleId,
  title,
  description,
  icon,
  iconTone = 'primary',
  onClose,
  closeDisabled,
}: ModalHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-space-md px-space-lg pb-space-md pt-space-lg">
      <div className="flex items-start gap-3">
        <IconCircle icon={icon} tone={iconTone} shape="square" />
        <div>
          <h2 id={titleId} className="text-title-md font-bold text-on-surface">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-body-sm text-on-surface-variant">{description}</p>}
        </div>
      </div>
      {onClose && <IconButton icon="close" label="Cerrar" onClick={onClose} disabled={closeDisabled} />}
    </div>
  )
}

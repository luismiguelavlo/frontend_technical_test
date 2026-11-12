import type { ReactNode } from 'react'
import { useEscapeKey } from '../../hooks/useEscapeKey.ts'
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

/** Centered dialog over a blurred backdrop. Render it conditionally to open/close. */
export function Modal({
  labelledBy,
  describedBy,
  role = 'dialog',
  size = 'lg',
  dismissible = true,
  onClose,
  children,
}: ModalProps) {
  useEscapeKey(onClose, dismissible)

  return (
    <div className="fixed inset-0 z-[60] flex overflow-y-auto p-space-sm md:p-space-lg">
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm"
        onClick={dismissible ? onClose : undefined}
      />
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`relative m-auto w-full overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl ${SIZES[size]}`}
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

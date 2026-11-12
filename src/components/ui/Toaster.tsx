import { useEffect, type ReactNode } from 'react'
import { NotifyContext, useToasts, type ToastMessage } from '../../hooks/useToasts.ts'
import { IconButton } from './Button.tsx'
import { Icon } from './Icon.tsx'

const AUTO_DISMISS_MS = 4000

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: number) => void
}

function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const isError = toast.kind === 'error'

  return (
    <div className="pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-start gap-space-sm rounded-lg bg-inverse-surface p-space-md text-inverse-on-surface shadow-xl">
      <Icon
        name={isError ? 'error' : 'checkCircle'}
        className={`size-5 ${isError ? 'text-tertiary-fixed-dim' : 'text-secondary-fixed-dim'}`}
      />
      <p className="flex-1 text-body-md">
        <span className="sr-only">{isError ? 'Error: ' : ''}</span>
        {toast.text}
      </p>
      <IconButton
        icon="close"
        label="Cerrar notificación"
        tone="inverse"
        className="-m-1 p-1"
        onClick={() => onDismiss(toast.id)}
      />
    </div>
  )
}

/**
 * Provides useNotify() and renders the toasts. Lives above the pages so a
 * message survives navigation (e.g. "Usuario eliminado").
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, notify, dismiss } = useToasts()

  return (
    <NotifyContext value={notify}>
      {children}
      {/* Always-mounted live region: screen readers announce toasts added to it. */}
      <div
        role="region"
        aria-label="Notificaciones"
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed right-space-md top-20 z-[70] flex flex-col gap-space-sm"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </NotifyContext>
  )
}

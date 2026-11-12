import { createContext, useContext, useState } from 'react'

export type ToastKind = 'success' | 'error'

export interface ToastMessage {
  id: number
  kind: ToastKind
  text: string
}

export type Notify = (kind: ToastKind, text: string) => void

let nextId = 1

/** Toast list state; owned by <ToastProvider>. */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  function notify(kind: ToastKind, text: string) {
    setToasts((prev) => [...prev, { id: nextId++, kind, text }])
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, notify, dismiss }
}

export const NotifyContext = createContext<Notify | null>(null)

/** Shows a toast from anywhere below <ToastProvider>. */
export function useNotify(): Notify {
  const notify = useContext(NotifyContext)
  if (!notify) throw new Error('useNotify must be used inside <ToastProvider>')
  return notify
}

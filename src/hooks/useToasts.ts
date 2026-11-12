import { useState } from 'react'

export type ToastKind = 'success' | 'error'

export interface ToastMessage {
  id: number
  kind: ToastKind
  text: string
}

let nextId = 1

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

export type Notify = (kind: ToastKind, text: string) => void

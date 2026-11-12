import { useId, useRef, useState, type ReactNode } from 'react'
import { Button } from './Button.tsx'
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal.tsx'

interface ConfirmDialogProps {
  title: string
  description?: string
  children: ReactNode
  confirmLabel: string
  loadingLabel: string
  /** Async action; the dialog shows the loading state until it settles. */
  onConfirm: () => Promise<void>
  onCancel: () => void
}

/** Destructive-action confirmation (same layout as the form dialogs). */
export function ConfirmDialog({
  title,
  description,
  children,
  confirmLabel,
  loadingLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)
  // Synchronous guard: a double click fires twice before `loading` re-renders the button.
  const pending = useRef(false)
  const titleId = useId()
  const bodyId = useId()

  async function confirm() {
    if (pending.current) return
    pending.current = true
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      pending.current = false
      setLoading(false)
    }
  }

  return (
    <Modal
      role="alertdialog"
      size="md"
      labelledBy={titleId}
      describedBy={bodyId}
      dismissible={!loading}
      onClose={onCancel}
    >
      <ModalHeader
        titleId={titleId}
        title={title}
        description={description}
        icon="delete"
        iconTone="error"
        onClose={onCancel}
        closeDisabled={loading}
      />
      <ModalBody>
        <div id={bodyId} className="space-y-space-md text-body-md text-on-surface-variant">
          {children}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onCancel} disabled={loading} autoFocus>
          Cancelar
        </Button>
        <Button variant="danger" icon="delete" onClick={confirm} loading={loading}>
          {loading ? loadingLabel : confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

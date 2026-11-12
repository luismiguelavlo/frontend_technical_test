import { useState, type ReactNode } from 'react'
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

  async function confirm() {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      role="alertdialog"
      size="md"
      labelledBy="confirm-title"
      describedBy="confirm-body"
      dismissible={!loading}
      onClose={onCancel}
    >
      <ModalHeader
        titleId="confirm-title"
        title={title}
        description={description}
        icon="delete"
        iconTone="error"
        onClose={onCancel}
        closeDisabled={loading}
      />
      <ModalBody>
        <div id="confirm-body" className="space-y-space-md text-body-md text-on-surface-variant">
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

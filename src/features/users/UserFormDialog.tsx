import { useId } from 'react'
import { userErrorMessage } from '../../api/users.ts'
import { Alert } from '../../components/ui/Alert.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { SelectField, TextField } from '../../components/ui/FormField.tsx'
import { FormGrid } from '../../components/ui/FormGrid.tsx'
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../../components/ui/Modal.tsx'
import { useForm } from '../../hooks/useForm.ts'
import { GENDERS, GENDER_LABELS, fullName, type User, type UserInput } from '../../types/user.ts'
import { toFormValues, toUserInput, validateUser } from '../../utils/userValidation.ts'

interface UserFormDialogProps {
  /** null = create mode; a user = edit mode (fields pre-filled). */
  user: User | null
  onSubmit: (input: UserInput) => Promise<void>
  onClose: () => void
}

/** Create/edit user dialog (same form for both modes). */
export function UserFormDialog({ user, onSubmit, onClose }: UserFormDialogProps) {
  const { formError, submitting, bind, handleSubmit } = useForm({
    initialValues: toFormValues(user),
    validate: validateUser,
    toPayload: toUserInput,
    onSubmit,
    errorMessage: userErrorMessage,
  })
  const titleId = useId()

  const isEdit = user !== null

  return (
    <Modal labelledBy={titleId} dismissible={!submitting} onClose={onClose}>
      <ModalHeader
        titleId={titleId}
        icon={isEdit ? 'edit' : 'personAdd'}
        iconTone={isEdit ? 'neutral' : 'primary'}
        title={isEdit ? `Editar usuario #${user.id}` : 'Nuevo usuario'}
        description={
          isEdit ? `Modifica los datos de ${fullName(user)}.` : 'Completa los datos para registrar al usuario en el sistema.'
        }
        onClose={onClose}
        closeDisabled={submitting}
      />

      <form noValidate onSubmit={handleSubmit}>
        <fieldset disabled={submitting}>
          <ModalBody>
            {formError && <Alert title={formError.title}>{formError.message}</Alert>}

            <FormGrid>
              <TextField
                {...bind('first_name')}
                label="Nombre"
                icon="badge"
                required
                autoFocus
                autoComplete="given-name"
                placeholder="ej. Valentina"
                maxLength={100}
                hint="Máximo 100 caracteres."
              />
              <TextField
                {...bind('last_name')}
                label="Apellido"
                icon="person"
                required
                autoComplete="family-name"
                placeholder="ej. Silva"
                maxLength={100}
                hint="Máximo 100 caracteres."
              />
              <TextField
                {...bind('email')}
                label="Email"
                icon="mail"
                required
                type="email"
                autoComplete="email"
                placeholder="usuario@dominio.com"
                maxLength={254}
                hint="Debe ser único: no puede estar registrado en otro usuario."
              />
              <TextField
                {...bind('telephone')}
                label="Teléfono"
                icon="call"
                optional
                type="tel"
                autoComplete="tel"
                placeholder="+56 (9) 1234-5678"
                maxLength={20}
                hint="Solo números, +, -, ( ) y espacios."
              />
              <SelectField {...bind('gender')} label="Género" icon="group" required>
                <option value="" disabled>
                  Seleccionar opción…
                </option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {GENDER_LABELS[g]}
                  </option>
                ))}
              </SelectField>
              <TextField
                {...bind('age')}
                label="Edad"
                icon="calendar"
                required
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={3}
                placeholder="ej. 28"
                hint="Número entero entre 1 y 120."
              />
            </FormGrid>
          </ModalBody>
        </fieldset>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" icon={isEdit ? 'check' : 'save'} loading={submitting}>
            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar usuario'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

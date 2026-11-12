import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ApiError, getErrorMessage } from '../api/client.ts'

type Errors<V> = Partial<Record<keyof V, string>>

interface FormError {
  title: string
  message: string
}

interface UseFormOptions<V extends { [K in keyof V]: string }, R> {
  initialValues: V
  /** Client-side rules; return field => message (empty object = valid). */
  validate: (values: V) => Errors<V>
  /** Maps valid values to the request payload. */
  toPayload: (values: V) => R
  onSubmit: (payload: R) => Promise<void>
}

/**
 * Generic form state for API-backed forms:
 * values, per-field errors, submitting flag and a form-level error.
 * API 422 responses (`errors: { field: message }`) are mapped onto the fields.
 */
export function useForm<V extends { [K in keyof V]: string }, R>({
  initialValues,
  validate,
  toPayload,
  onSubmit,
}: UseFormOptions<V, R>) {
  const [values, setValues] = useState<V>(initialValues)
  const [errors, setErrors] = useState<Errors<V>>({})
  const [formError, setFormError] = useState<FormError | null>(null)
  const [submitting, setSubmitting] = useState(false)

  /** Props for a field: id / value / error / onChange (editing clears its error). */
  function bind(field: keyof V & string) {
    return {
      id: field,
      value: values[field],
      error: errors[field],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      },
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const clientErrors = validate(values)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(toPayload(values))
    } catch (error) {
      const isValidation = error instanceof ApiError && error.status === 422
      if (isValidation) setErrors(error.errors as Errors<V>)
      setFormError({
        title: isValidation ? 'Corrige los errores antes de continuar' : 'No se pudieron guardar los cambios',
        message: getErrorMessage(error),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return { formError, submitting, bind, handleSubmit }
}

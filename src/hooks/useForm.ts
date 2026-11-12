import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
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
  /** Error → user-facing message (defaults to the generic getErrorMessage). */
  errorMessage?: (error: unknown) => string
}

/**
 * Generic form state for API-backed forms:
 * values, per-field errors, submitting flag and a form-level error.
 * API 422 responses (`errors: { field: message }`) are mapped onto the fields;
 * errors for fields the form does not have are shown in the form-level alert.
 * After a failed submit, focus moves to the first invalid field.
 */
export function useForm<V extends { [K in keyof V]: string }, R>({
  initialValues,
  validate,
  toPayload,
  onSubmit,
  errorMessage = getErrorMessage,
}: UseFormOptions<V, R>) {
  const [values, setValues] = useState<V>(initialValues)
  const [errors, setErrors] = useState<Errors<V>>({})
  const [formError, setFormError] = useState<FormError | null>(null)
  const [submitting, setSubmitting] = useState(false)
  // Synchronous guard: a fast double submit fires before `submitting` re-renders the form.
  const pending = useRef(false)
  // Field to focus once the form is enabled again (set after a failed submit).
  const [focusTarget, setFocusTarget] = useState<{ field: keyof V } | null>(null)
  const idPrefix = useId()
  const fields = Object.keys(initialValues) as (keyof V & string)[]

  function fieldId(field: keyof V & string) {
    return `${idPrefix}-${field}`
  }

  useEffect(() => {
    if (focusTarget && !submitting) document.getElementById(`${idPrefix}-${String(focusTarget.field)}`)?.focus()
  }, [focusTarget, submitting, idPrefix])

  function showErrors(next: Errors<V>) {
    setErrors(next)
    const first = fields.find((f) => next[f])
    if (first) setFocusTarget({ field: first })
  }

  /** Props for a field: id / value / error / onChange (editing clears its error). */
  function bind(field: keyof V & string) {
    return {
      id: fieldId(field),
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
    if (pending.current) return
    setFormError(null)
    setFocusTarget(null)

    const clientErrors = validate(values)
    if (Object.keys(clientErrors).length > 0) {
      showErrors(clientErrors)
      return
    }

    pending.current = true
    setSubmitting(true)
    try {
      await onSubmit(toPayload(values))
    } catch (error) {
      const isValidation = error instanceof ApiError && error.status === 422
      let message = errorMessage(error)
      if (isValidation) {
        const known: Errors<V> = {}
        const unknown: string[] = []
        for (const [field, text] of Object.entries(error.errors)) {
          if ((fields as string[]).includes(field)) known[field as keyof V] = text
          else unknown.push(text)
        }
        showErrors(known)
        if (unknown.length > 0) message = [message, ...unknown].join(' ')
      }
      setFormError({
        title: isValidation ? 'Corrige los errores antes de continuar' : 'No se pudieron guardar los cambios',
        message,
      })
    } finally {
      pending.current = false
      setSubmitting(false)
    }
  }

  return { formError, submitting, bind, handleSubmit }
}

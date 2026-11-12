import { GENDERS, type FieldErrors, type Gender, type User, type UserInput } from '../types/user.ts'

/** Raw form values (everything is a string while editing). */
export interface UserFormValues {
  first_name: string
  last_name: string
  email: string
  gender: Gender | ''
  telephone: string
  age: string
}

/** User → form values (empty form when creating). Inverse of toUserInput(). */
export function toFormValues(user: User | null): UserFormValues {
  return {
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    email: user?.email ?? '',
    gender: user?.gender ?? '',
    telephone: user?.telephone ?? '',
    age: user ? String(user.age) : '',
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+\-() ]+$/
const INT_RE = /^\d+$/

/** Mirrors the backend rules (UserModel::$validationRules). */
export function validateUser(values: UserFormValues): FieldErrors {
  const errors: FieldErrors = {}
  const firstName = values.first_name.trim()
  const lastName = values.last_name.trim()
  const email = values.email.trim()
  const telephone = values.telephone.trim()
  const age = values.age.trim()

  if (!firstName) errors.first_name = 'El nombre es obligatorio.'
  else if (firstName.length > 100) errors.first_name = 'Máximo 100 caracteres.'

  if (!lastName) errors.last_name = 'El apellido es obligatorio.'
  else if (lastName.length > 100) errors.last_name = 'Máximo 100 caracteres.'

  if (!email) errors.email = 'El email es obligatorio.'
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = 'El email no tiene un formato válido.'

  if (!isGender(values.gender)) errors.gender = 'Selecciona un género.'

  if (telephone) {
    if (telephone.length > 20) errors.telephone = 'Máximo 20 caracteres.'
    else if (!PHONE_RE.test(telephone)) errors.telephone = 'El teléfono solo admite números, +, -, ( ) y espacios.'
  }

  if (!age) errors.age = 'La edad es obligatoria.'
  else if (!INT_RE.test(age)) errors.age = 'La edad solo admite dígitos (sin signos, decimales ni letras).'
  else if (Number(age) < 1 || Number(age) > 120) errors.age = 'La edad debe estar entre 1 y 120.'

  return errors
}

function isGender(value: string): value is Gender {
  return GENDERS.some((g) => g === value)
}

/** Call only after validateUser() returned no errors. */
export function toUserInput(values: UserFormValues): UserInput {
  if (!isGender(values.gender)) throw new Error('toUserInput() called with an unvalidated gender')
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    email: values.email.trim().toLowerCase(),
    gender: values.gender,
    telephone: values.telephone.trim() || null,
    age: Number(values.age),
  }
}

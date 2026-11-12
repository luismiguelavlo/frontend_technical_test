import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon.tsx'
import { outlinedFieldClass } from './styles.ts'

interface FieldShellProps {
  id: string
  label: string
  /** Shows a red asterisk. */
  required?: boolean
  /** Shows an "Opcional" chip. */
  optional?: boolean
  /** Helper text, replaced by the error when there is one. */
  hint?: string
  error?: string
  /** Leading icon inside the control. */
  icon?: IconName
  children: ReactNode
}

function FieldShell({ id, label, required, optional, hint, error, icon, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-label-sm text-on-surface">
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {optional && (
          <span className="rounded bg-surface-container px-1.5 text-[10px] font-semibold text-on-surface-variant uppercase">
            Opcional
          </span>
        )}
      </div>

      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-outline"
          />
        )}
        {children}
      </div>

      {error ? (
        <p id={`${id}-message`} className="flex items-start gap-1 text-body-sm font-medium text-error">
          <Icon name="error" className="mt-px size-3.5" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-message`} className="text-body-sm text-on-surface-variant">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

type ShellOnlyProps = Omit<FieldShellProps, 'children'>

/** Shared control classes + a11y wiring (aria-invalid, aria-describedby → message). */
function controlProps({ id, error, hint, icon, required }: ShellOnlyProps, paddingRight: string) {
  return {
    id,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || hint ? `${id}-message` : undefined,
    className: `${outlinedFieldClass(error)} ${icon ? 'pl-9' : 'pl-space-md'} ${paddingRight}`,
  }
}

type TextFieldProps = ShellOnlyProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'required' | 'className'>

export function TextField({ id, label, required, optional, hint, error, icon, ...input }: TextFieldProps) {
  const shell = { id, label, required, optional, hint, error, icon }

  return (
    <FieldShell {...shell}>
      <input {...input} {...controlProps(shell, error ? 'pr-9' : 'pr-space-md')} />
      {error && (
        <Icon
          name="error"
          className="pointer-events-none absolute right-3 top-1/2 size-[18px] -translate-y-1/2 text-error"
        />
      )}
    </FieldShell>
  )
}

type SelectFieldProps = ShellOnlyProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'required' | 'className'> & { children: ReactNode }

export function SelectField({ id, label, required, optional, hint, error, icon, children, ...select }: SelectFieldProps) {
  const shell = { id, label, required, optional, hint, error, icon }

  return (
    <FieldShell {...shell}>
      <select {...select} {...controlProps(shell, 'cursor-pointer appearance-none pr-10')}>
        {children}
      </select>
      <Icon
        name="expandMore"
        className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-outline"
      />
    </FieldShell>
  )
}

'use client'

// Formulario de contacto con EmailJS. Valida en el navegador, muestra los errores junto a cada
// campo y un resumen enfocable, y anuncia el resultado con una región aria-live.
// La plantilla de EmailJS recibe además `company` y `need`; como la plantilla actual quizá no los
// muestra, también se incluyen al inicio de `message` para que no se pierdan.

import { useId, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { button_classes } from '@/components/ui/button'
import { SITE } from '@/lib/site'

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_kgkm8fv'
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_kwr1f2h'
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'phDB7JUITnLJtt_VB'

const NEEDS = [
  { value: 'Capacitación', label: 'Capacitación' },
  { value: 'Automatización', label: 'Automatización' },
  { value: 'Otro', label: 'Otro' },
] as const

const LIMITS = { name: 120, email: 160, company: 160, message: 2000 }

type FormValues = { name: string; email: string; company: string; need: string; message: string; website: string }
type FieldName = 'name' | 'email' | 'need' | 'message'
type Errors = Partial<Record<FieldName, string>>

const EMPTY: FormValues = { name: '', email: '', company: '', need: '', message: '', website: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: FormValues): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Escribe tu nombre.'
  if (!values.email.trim()) errors.email = 'Escribe tu correo para poder responderte.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Revisa el correo: debe tener la forma nombre@dominio.com.'
  if (!values.need) errors.need = 'Elige el tipo de necesidad.'
  if (values.message.trim().length < 10) errors.message = 'Cuéntanos en al menos 10 caracteres qué necesitas.'
  return errors
}

const label_class = 'block font-semibold text-ink'
const input_class =
  'mt-2 block w-full min-w-0 border-[1.5px] border-field bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-brand-indigo aria-[invalid=true]:border-danger'

export function ContactForm() {
  const form_id = useId()
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const summary_ref = useRef<HTMLDivElement>(null)
  const success_ref = useRef<HTMLDivElement>(null)

  const id = (name: string) => `${form_id}-${name}`

  const update = (name: keyof FormValues, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }))
    if (errors[name as FieldName]) {
      setErrors((previous) => ({ ...previous, [name]: undefined }))
    }
  }

  const handle_submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setStatus('idle')
      requestAnimationFrame(() => summary_ref.current?.focus())
      return
    }
    // Campo trampa: las personas no lo ven; si viene lleno, lo descartamos sin avisar.
    if (values.website) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    const company = values.company.trim()
    const message = [
      `Empresa o institución: ${company || 'No indicada'}`,
      `Tipo de necesidad: ${values.need}`,
      '',
      values.message.trim(),
    ].join('\n')

    try {
      const emailjs = (await import('@emailjs/browser')).default
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: values.name.trim(),
          from_email: values.email.trim(),
          reply_to: values.email.trim(),
          company: company || 'No indicada',
          need: values.need,
          message,
          // Pendiente: confirmar en EmailJS si la plantilla usa {{to_email}}; si no, se puede quitar.
          to_email: SITE.email,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      )
      setStatus('sent')
      setValues(EMPTY)
      requestAnimationFrame(() => success_ref.current?.focus())
    } catch (error) {
      console.error('No se pudo enviar el formulario de contacto', error)
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <div ref={success_ref} tabIndex={-1} role="status" className="rounded-card border border-line bg-surface p-6 sm:p-8">
        <CheckCircle2 size={40} strokeWidth={2} className="text-success" aria-hidden="true" />
        <h2 className="mt-4 text-display-3">Mensaje enviado</h2>
        <p className="mt-3 text-muted">
          Gracias. Te responderemos al correo que indicaste. Si es urgente, escríbenos por{' '}
          <a href={SITE.whatsapp_url} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-brand-indigo">
            WhatsApp
          </a>
          .
        </p>
        <button type="button" onClick={() => setStatus('idle')} className={`${button_classes('secondary')} mt-6`}>
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  const error_entries = Object.entries(errors).filter(([, message]) => Boolean(message)) as Array<[FieldName, string]>
  const field_labels: Record<FieldName, string> = { name: 'Nombre', email: 'Correo', need: 'Tipo de necesidad', message: 'Mensaje' }

  return (
    <form onSubmit={handle_submit} noValidate aria-labelledby={id('titulo')} className="rounded-card border border-line bg-surface p-6 sm:p-8">
      <h2 id={id('titulo')} className="text-display-3">
        Escríbenos
      </h2>
      <p className="mt-2 text-muted">Los campos marcados con * son obligatorios.</p>

      {error_entries.length > 0 && (
        <div ref={summary_ref} tabIndex={-1} role="alert" className="mt-6 border-l-4 border-danger bg-[#FBEDEC] p-4">
          <p className="font-semibold text-danger">Revisa {error_entries.length === 1 ? 'este campo' : 'estos campos'} antes de enviar:</p>
          <ul className="mt-2 list-disc pl-5">
            {error_entries.map(([field, message]) => (
              <li key={field}>
                <a href={`#${id(field)}`} className="link-underline text-ink">
                  {field_labels[field]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-6">
        <div>
          <label htmlFor={id('name')} className={label_class}>
            Nombre y apellido *
          </label>
          <input
            id={id('name')}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? id('name-error') : undefined}
            className={input_class}
          />
          {errors.name && <p id={id('name-error')} className="mt-2 text-sm font-medium text-danger">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor={id('email')} className={label_class}>
            Correo *
          </label>
          <input
            id={id('email')}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email}
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? id('email-error') : undefined}
            className={input_class}
          />
          {errors.email && <p id={id('email-error')} className="mt-2 text-sm font-medium text-danger">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor={id('company')} className={label_class}>
            Empresa o institución
          </label>
          <input
            id={id('company')}
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company}
            value={values.company}
            onChange={(event) => update('company', event.target.value)}
            className={input_class}
          />
        </div>

        <fieldset
          id={id('need')}
          tabIndex={-1}
          aria-invalid={errors.need ? true : undefined}
          aria-describedby={errors.need ? id('need-error') : undefined}
        >
          <legend className={label_class}>¿Qué necesitas? *</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {NEEDS.map((need) => (
              <label key={need.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="need"
                  value={need.value}
                  checked={values.need === need.value}
                  onChange={() => update('need', need.value)}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-field px-5 font-medium text-ink peer-checked:border-brand-indigo peer-checked:bg-brand-indigo peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-brand-indigo">
                  {need.label}
                </span>
              </label>
            ))}
          </div>
          {errors.need && <p id={id('need-error')} className="mt-2 text-sm font-medium text-danger">{errors.need}</p>}
        </fieldset>

        <div>
          <label htmlFor={id('message')} className={label_class}>
            Mensaje *
          </label>
          <p id={id('message-hint')} className="mt-1 text-sm text-muted">
            Qué proceso quieres mejorar o a quién va dirigida la capacitación.
          </p>
          <textarea
            id={id('message')}
            name="message"
            rows={5}
            maxLength={LIMITS.message}
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={`${id('message-hint')}${errors.message ? ` ${id('message-error')}` : ''}`}
            className={`${input_class} resize-y`}
          />
          {errors.message && <p id={id('message-error')} className="mt-2 text-sm font-medium text-danger">{errors.message}</p>}
        </div>

        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={id('website')}>No completes este campo</label>
          <input
            id={id('website')}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => update('website', event.target.value)}
          />
        </div>
      </div>

      <div aria-live="polite" className="mt-6">
        {status === 'failed' && (
          <p className="border-l-4 border-danger bg-[#FBEDEC] p-4 text-ink">
            No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo, o escríbenos a{' '}
            <a href={`mailto:${SITE.email}`} className="link-underline font-semibold text-brand-indigo">
              {SITE.email}
            </a>
            .
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col items-start gap-4">
        <button type="submit" disabled={status === 'sending'} aria-disabled={status === 'sending'} className={`${button_classes('primary', 'lg')} disabled:cursor-wait disabled:opacity-70`}>
          {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
        </button>
        <p className="text-sm text-muted">
          Usamos estos datos solo para responderte.{' '}
          <Link href="/privacidad#contacto" className="link-underline text-brand-indigo">
            Política de privacidad
          </Link>
        </p>
      </div>
    </form>
  )
}

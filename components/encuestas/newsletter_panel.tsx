'use client'

// Suscripción comercial separada de la evaluación. El consentimiento inicia desmarcado.

import { FormEvent, useCallback, useState } from 'react'
import Link from 'next/link'
import { CONSENT_TEXT, CONTACT_EMAIL } from '@/lib/surveys/constants'
import { subscribe_newsletter } from '@/lib/surveys/api'
import { field_class, primary_button_class, secondary_button_class } from '@/lib/surveys/ui_classes'
import { get_public_config } from '@/lib/supabase/client'
import { TurnstileWidget } from '@/components/encuestas/turnstile_widget'

export function NewsletterPanel({
  origin_label,
  on_skip,
  on_done,
}: {
  origin_label: string
  on_skip: () => void
  on_done: (message: string) => void
}) {
  const site_key = get_public_config()?.turnstile_site_key ?? ''
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState('')
  const [has_consent, setHasConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [token, setToken] = useState('')
  const [reset_key, setResetKey] = useState(0)
  const [is_saving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [unsubscribe_url, setUnsubscribeUrl] = useState('')
  const on_token = useCallback((value: string) => setToken(value), [])

  const handle_submit = async (event: FormEvent) => {
    event.preventDefault()
    if (is_saving) return
    if (!has_consent) {
      setError('Marca la casilla de consentimiento si deseas recibir información.')
      return
    }
    if (site_key && !token) {
      setError('Confirma que no eres un sistema automatizado.')
      return
    }
    setIsSaving(true)
    setError('')
    const result = await subscribe_newsletter({
      email,
      name,
      interests,
      origin_label,
      honeypot,
      turnstile_token: token,
    })
    setIsSaving(false)
    setResetKey((current) => current + 1)
    setToken('')
    if (!result.ok) {
      setError(result.message)
      return
    }
    if (result.unsubscribe_token) {
      const url = `${window.location.origin}/encuestas/baja?token=${result.unsubscribe_token}`
      setUnsubscribeUrl(url)
      return
    }
    on_done('Este correo ya estaba registrado. Si perdiste el enlace de baja, escribe a nexoiaec@gmail.com.')
  }

  if (unsubscribe_url) {
    return (
      <div className="space-y-4" role="status">
        <h2 className="text-2xl font-bold text-white">Suscripción registrada</h2>
        <p className="text-gray-300">Guarda este enlace para cancelar la suscripción cuando quieras. No lo compartas.</p>
        <p className="break-all rounded-xl bg-dark-900/70 p-3 text-sm text-primary-200">{unsubscribe_url}</p>
        <button type="button" className={primary_button_class} onClick={() => on_done('Registramos tu interés. Puedes cancelar la suscripción con el enlace que guardaste.')}>
          Finalizar
        </button>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={handle_submit} noValidate>
      <div>
        <h2 className="text-2xl font-bold text-white">¿Te gustaría continuar aprendiendo con NexoIA?</h2>
        <p className="mt-3 text-gray-300">
          En NexoIA desarrollamos capacitaciones prácticas en Inteligencia Artificial, automatización, análisis de datos y agentes inteligentes. Si deseas conocer nuestras próximas actividades, puedes suscribirte voluntariamente.
        </p>
      </div>
      <label className="block space-y-2 text-sm text-gray-300">
        Nombre (opcional)
        <input className={field_class} value={name} autoComplete="name" maxLength={120} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="block space-y-2 text-sm text-gray-300">
        Correo electrónico
        <input className={field_class} type="email" required value={email} autoComplete="email" maxLength={254} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="block space-y-2 text-sm text-gray-300">
        Áreas de interés (opcional)
        <textarea className={`${field_class} min-h-24`} value={interests} maxLength={500} onChange={(event) => setInterests(event.target.value)} />
      </label>
      <label className="flex items-start gap-3 text-sm text-gray-200">
        <input type="checkbox" className="mt-1" checked={has_consent} onChange={(event) => setHasConsent(event.target.checked)} />
        <span>{CONSENT_TEXT}</span>
      </label>
      <p className="text-sm text-gray-400">
        Consulta la <Link href="/privacidad" className="text-primary-300 underline">política de privacidad</Link>. Contacto: {CONTACT_EMAIL}.
      </p>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="newsletter-hp">No completar</label>
        <input id="newsletter-hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>
      {site_key && <TurnstileWidget site_key={site_key} reset_key={reset_key} on_token={on_token} />}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className={primary_button_class} disabled={is_saving} aria-busy={is_saving}>
          {is_saving ? 'Guardando…' : 'Suscribirme'}
        </button>
        <button type="button" className={secondary_button_class} onClick={on_skip}>Omitir</button>
      </div>
    </form>
  )
}

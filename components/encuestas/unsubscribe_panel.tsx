'use client'

// La baja se confirma con un botón para que un lector automático de correos no cancele el registro al abrirlo.

import { FormEvent, useCallback, useState } from 'react'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/surveys/constants'
import { unsubscribe_newsletter } from '@/lib/surveys/api'
import { card_class, primary_button_class } from '@/lib/surveys/ui_classes'
import { get_public_config } from '@/lib/supabase/client'
import { PublicShell } from '@/components/encuestas/public_shell'
import { TurnstileWidget } from '@/components/encuestas/turnstile_widget'

export function UnsubscribePanel({ token }: { token: string }) {
  const site_key = get_public_config()?.turnstile_site_key ?? ''
  const [honeypot, setHoneypot] = useState('')
  const [turnstile_token, setTurnstileToken] = useState('')
  const [reset_key, setResetKey] = useState(0)
  const [is_saving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const on_token = useCallback((value: string) => setTurnstileToken(value), [])

  const handle_submit = async (event: FormEvent) => {
    event.preventDefault()
    if (is_saving) return
    if (site_key && !turnstile_token) {
      setError('Confirma que no eres un sistema automatizado.')
      return
    }
    setIsSaving(true)
    setError('')
    const result = await unsubscribe_newsletter({ token, honeypot, turnstile_token })
    setIsSaving(false)
    setResetKey((current) => current + 1)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setMessage(result.message)
  }

  return (
    <PublicShell>
      <form onSubmit={handle_submit} className={`${card_class} space-y-5`}>
        <h1 className="text-3xl font-bold text-white">Cancelar suscripción</h1>
        <p className="text-gray-300">
          Si confirmas, NexoIA dejará de usar este correo para informar sobre futuras capacitaciones. También puedes escribir a {CONTACT_EMAIL}.
        </p>
        {!token && <p className="text-red-300">El enlace no incluye un código de cancelación.</p>}
        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="baja-hp">No completar</label>
          <input id="baja-hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
        </div>
        {site_key && <TurnstileWidget site_key={site_key} reset_key={reset_key} on_token={on_token} />}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        {message && <p role="status" className="text-teal-300">{message}</p>}
        <button type="submit" className={primary_button_class} disabled={is_saving || !token} aria-busy={is_saving}>
          {is_saving ? 'Procesando…' : 'Confirmar cancelación'}
        </button>
        <p><Link href="/" className="text-primary-300">Volver al inicio</Link></p>
      </form>
    </PublicShell>
  )
}

'use client'

// Inicio de sesión del panel. No autoriza por sí solo: la cuenta debe existir en admin_users.

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { read_admin_session, request_password_reset, sign_in_admin } from '@/lib/admin/session'
import { field_class, primary_button_class, secondary_button_class } from '@/lib/surveys/ui_classes'
import { PublicShell } from '@/components/encuestas/public_shell'

export default function AccesoPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [is_saving, setIsSaving] = useState(false)
  const [is_admin, setIsAdmin] = useState(false)

  useEffect(() => {
    read_admin_session().then((session) => setIsAdmin(session.state === 'admin'))
  }, [])

  const handle_submit = async (event: FormEvent) => {
    event.preventDefault()
    if (is_saving) return
    setIsSaving(true)
    setError('')
    setNotice('')
    const result = await sign_in_admin({ email, password })
    setIsSaving(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setIsAdmin(true)
  }

  return (
    <PublicShell>
      <form onSubmit={handle_submit} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-bold text-white">Acceso de administración</h1>
        <p className="text-gray-300">Solo las cuentas registradas en admin_users pueden ver resultados o crear encuestas.</p>
        {is_admin && (
          <div className="space-y-3">
            <p className="text-teal-300">Sesión activa.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/encuestas" className={primary_button_class}>Ver resultados</Link>
              <Link href="/admin/capacitaciones" className={secondary_button_class}>Capacitaciones</Link>
            </div>
          </div>
        )}
        <label className="block space-y-2 text-sm text-gray-300">Correo
          <input className={field_class} type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="block space-y-2 text-sm text-gray-300">Contraseña
          <input className={field_class} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        {notice && <p role="status" className="text-sm text-teal-300">{notice}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={primary_button_class} disabled={is_saving} aria-busy={is_saving}>
            {is_saving ? 'Ingresando…' : 'Ingresar'}
          </button>
          <button
            type="button"
            className={secondary_button_class}
            onClick={() => {
              request_password_reset({ email }).then((result) => {
                if (result.ok) setNotice(result.message)
                else setError(result.message)
              })
            }}
          >
            Olvidé mi contraseña
          </button>
        </div>
      </form>
    </PublicShell>
  )
}

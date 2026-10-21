'use client'

// Bloquea la interfaz si no hay una sesión de administrador. La protección de datos está en RLS.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { read_admin_session, sign_out_admin, type AdminSession } from '@/lib/admin/session'
import { card_class, secondary_button_class } from '@/lib/surveys/ui_classes'
import { PublicShell } from '@/components/encuestas/public_shell'

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | 'loading'>('loading')

  useEffect(() => {
    let is_active = true
    read_admin_session().then((result) => {
      if (is_active) setSession(result)
    })
    return () => {
      is_active = false
    }
  }, [])

  if (session === 'loading') {
    return <PublicShell width="wide"><p className="text-gray-200">Comprobando acceso…</p></PublicShell>
  }
  if (session.state === 'admin') return <>{children}</>
  if (session.state === 'missing_config') {
    return (
      <PublicShell width="wide">
        <div className={card_class}>
          <p className="text-gray-100">Falta la configuración pública de Supabase. Revisa las instrucciones del módulo antes de entrar al panel.</p>
        </div>
      </PublicShell>
    )
  }

  return (
    <PublicShell width="wide">
      <div className={`${card_class} space-y-4`}>
        <h1 className="text-2xl font-bold text-white">Acceso de administración</h1>
        <p className="text-gray-300">
          {session.state === 'forbidden'
            ? 'Esta cuenta no está autorizada para administrar encuestas.'
            : 'Inicia sesión con una cuenta autorizada para ver resultados o crear capacitaciones.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/acceso" className={secondary_button_class}>Ir al acceso</Link>
          {session.state === 'forbidden' && (
            <button
              type="button"
              className={secondary_button_class}
              onClick={() => {
                sign_out_admin().then(() => setSession({ state: 'anonymous' }))
              }}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </PublicShell>
  )
}

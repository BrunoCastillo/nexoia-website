'use client'

// Lista las evaluaciones activas. Las nuevas aparecen aquí sin volver a desplegar el sitio.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetch_active_directory } from '@/lib/surveys/api'
import { card_class, primary_button_class } from '@/lib/surveys/ui_classes'
import { PublicShell } from '@/components/encuestas/public_shell'
import { CONTACT_EMAIL, FIRST_SURVEY_SLUG } from '@/lib/surveys/constants'

export function SurveyDirectory() {
  const [state, setState] = useState<'loading' | 'ready' | 'missing_config' | 'error'>('loading')
  const [surveys, setSurveys] = useState<Array<{ id: string; slug: string; title: string; description: string | null; estimated_minutes: string | null }>>([])

  useEffect(() => {
    let is_active = true
    fetch_active_directory().then((result) => {
      if (!is_active) return
      if (!result.ok) {
        setState(result.code === 'missing_config' ? 'missing_config' : 'error')
        return
      }
      setSurveys(result.surveys)
      setState('ready')
    })
    return () => {
      is_active = false
    }
  }, [])

  return (
    <PublicShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Evaluaciones de capacitación</h1>
        <p className="text-gray-300">Elige la capacitación que deseas evaluar. La participación es voluntaria. Cada evaluación indica qué datos te pide y para qué.</p>
        {state === 'loading' && <p className="text-gray-300">Cargando evaluaciones…</p>}
        {state === 'missing_config' && (
          <div className={card_class}>
            <p className="text-gray-200">La conexión con la base de datos todavía no está configurada. Mientras tanto puedes abrir la evaluación de IA aplicada a las finanzas cuando el proyecto de Supabase esté activo.</p>
            <Link href={`/encuestas/${FIRST_SURVEY_SLUG}`} className={`${primary_button_class} mt-4`}>Abrir evaluación inicial</Link>
          </div>
        )}
        {state === 'error' && <p className="text-red-300">No se pudieron cargar las evaluaciones. Escribe a {CONTACT_EMAIL} si el problema continúa.</p>}
        {state === 'ready' && surveys.length === 0 && <p className="text-gray-300">No hay evaluaciones abiertas en este momento.</p>}
        {state === 'ready' && surveys.map((survey) => (
          <article key={survey.id} className={card_class}>
            <h2 className="text-xl font-semibold text-white">{survey.title}</h2>
            {survey.description && <p className="mt-2 text-gray-300">{survey.description}</p>}
            <p className="mt-2 text-sm text-gray-400">{survey.estimated_minutes ?? '4 a 6 minutos'}</p>
            <Link href={survey.slug === FIRST_SURVEY_SLUG ? `/encuestas/${survey.slug}` : `/encuestas?curso=${encodeURIComponent(survey.slug)}`} className={`${primary_button_class} mt-4`}>
              Responder
            </Link>
          </article>
        ))}
      </div>
    </PublicShell>
  )
}

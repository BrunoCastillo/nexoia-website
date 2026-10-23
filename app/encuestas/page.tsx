'use client'

// Ruta genérica: /encuestas?curso=identificador sirve para cualquier encuesta sin reconstruir el sitio.

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { GoogleFormPanel } from '@/components/encuestas/google_form_panel'
import { SurveyDirectory } from '@/components/encuestas/survey_directory'
import { SurveyExperience } from '@/components/encuestas/survey_experience'
import { FIRST_SURVEY_SLUG } from '@/lib/surveys/constants'

function EncuestasRouter() {
  const slug = useSearchParams().get('curso')?.trim() ?? ''
  if (!slug) return <SurveyDirectory />
  if (slug === FIRST_SURVEY_SLUG) return <GoogleFormPanel />
  return <SurveyExperience slug={slug} />
}

export default function EncuestasPage() {
  return (
    <Suspense fallback={<p className="min-h-screen bg-dark-900 pt-32 text-center text-white">Cargando evaluación…</p>}>
      <EncuestasRouter />
    </Suspense>
  )
}

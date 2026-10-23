// Construye los enlaces públicos sin depender de una ruta nueva por cada encuesta.

import { FIRST_SURVEY_SLUG } from '@/lib/surveys/constants'
import type { SurveyRecord } from '@/lib/surveys/types'
import { get_public_config } from '@/lib/supabase/client'
import { today_in_ecuador } from '@/lib/surveys/text'

export function site_origin(): string {
  const configured = get_public_config()?.site_url
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return 'https://nexoiaec.vercel.app'
}

export function build_public_survey_url(slug: string): string {
  const origin = site_origin()
  if (slug === FIRST_SURVEY_SLUG) return `${origin}/encuestas/${slug}`
  return `${origin}/encuestas?curso=${encodeURIComponent(slug)}`
}

export function build_generic_survey_url(slug: string): string {
  return `${site_origin()}/encuestas?curso=${encodeURIComponent(slug)}`
}

export function availability_message(survey: SurveyRecord): string | null {
  const today = today_in_ecuador()
  if (survey.status === 'closed') return 'Esta evaluación ya no recibe respuestas.'
  if (survey.status !== 'active') return 'Esta evaluación no está disponible.'
  if (survey.starts_on && today < survey.starts_on) return 'Esta evaluación aún no comienza.'
  if (survey.ends_on && today > survey.ends_on) return 'El periodo de esta evaluación ya finalizó.'
  return null
}

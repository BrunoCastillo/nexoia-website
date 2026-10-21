// Lectura pública del cuestionario y envío hacia las Edge Functions. No escribe directo en tablas sensibles.

import { CONSENT_TEXT, CONSENT_VERSION } from '@/lib/surveys/constants'
import type { AnswerPayloadItem, OptionRecord, QuestionRecord, SurveyBundle, SurveyRecord } from '@/lib/surveys/types'
import { get_public_config, get_supabase_browser } from '@/lib/supabase/client'
import { is_uuid } from '@/lib/surveys/text'

const SURVEY_COLUMNS = 'id,slug,title,description,disclaimer,institution,organization,duration_label,modality,session_count,instructor_name,status,estimated_minutes,starts_on,ends_on'
const QUESTION_COLUMNS = 'id,survey_id,section_key,section_title,prompt,help_text,question_type,position,is_required,metric_key,max_length'
const OPTION_COLUMNS = 'id,question_id,label,position,allows_free_text'

type FunctionResult = {
  ok?: boolean
  message?: string
  duplicate?: boolean
  state?: string
  unsubscribe_token?: string
}

async function post_function(input: {
  name: string
  body: Record<string, unknown>
}): Promise<{ ok: true; data: FunctionResult } | { ok: false; message: string }> {
  const config = get_public_config()
  if (!config) return { ok: false, message: 'Falta la configuración de Supabase.' }

  try {
    const response = await fetch(`${config.url}/functions/v1/${input.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.anon_key,
        Authorization: `Bearer ${config.anon_key}`,
      },
      body: JSON.stringify(input.body),
    })
    const data = (await response.json().catch(() => ({}))) as FunctionResult
    if (!response.ok || data.ok === false) {
      return { ok: false, message: data.message || 'No se pudo completar el envío.' }
    }
    return { ok: true, data }
  } catch {
    return { ok: false, message: 'No hay conexión con el servicio de encuestas.' }
  }
}

export async function fetch_public_survey(slug: string): Promise<
  | { ok: true; bundle: SurveyBundle }
  | { ok: false; code: 'missing_config' | 'not_found' | 'error'; message: string }
> {
  const client = get_supabase_browser()
  if (!client) {
    return { ok: false, code: 'missing_config', message: 'Falta conectar Supabase para cargar la evaluación.' }
  }

  const { data: survey, error } = await client
    .from('surveys')
    .select(SURVEY_COLUMNS)
    .eq('slug', slug)
    .maybeSingle()

  if (error) return { ok: false, code: 'error', message: 'No se pudo cargar la evaluación.' }
  if (!survey) return { ok: false, code: 'not_found', message: 'No encontramos una evaluación con ese enlace.' }

  const { data: questions, error: question_error } = await client
    .from('survey_questions')
    .select(QUESTION_COLUMNS)
    .eq('survey_id', survey.id)
    .order('position', { ascending: true })

  if (question_error || !questions) return { ok: false, code: 'error', message: 'No se pudieron cargar las preguntas.' }

  const question_ids = questions.map((question) => question.id)
  let options: OptionRecord[] = []
  if (question_ids.length > 0) {
    const { data, error: option_error } = await client
      .from('survey_options')
      .select(OPTION_COLUMNS)
      .in('question_id', question_ids)
      .order('position', { ascending: true })
    if (option_error || !data) return { ok: false, code: 'error', message: 'No se pudieron cargar las opciones.' }
    options = data as OptionRecord[]
  }

  return {
    ok: true,
    bundle: {
      survey: survey as SurveyRecord,
      questions: questions as QuestionRecord[],
      options,
    },
  }
}

export async function fetch_active_directory(): Promise<
  | { ok: true; surveys: Pick<SurveyRecord, 'id' | 'slug' | 'title' | 'description' | 'estimated_minutes'>[] }
  | { ok: false; code: 'missing_config' | 'error'; message: string }
> {
  const client = get_supabase_browser()
  if (!client) return { ok: false, code: 'missing_config', message: 'Falta conectar Supabase.' }
  const { data, error } = await client
    .from('surveys')
    .select('id,slug,title,description,estimated_minutes,status')
    .eq('status', 'active')
    .order('title', { ascending: true })
  if (error || !data) return { ok: false, code: 'error', message: 'No se pudieron listar las evaluaciones.' }
  return { ok: true, surveys: data }
}

export async function submit_survey(input: {
  slug: string
  client_token: string
  answers: AnswerPayloadItem[]
  honeypot: string
  turnstile_token: string
}): Promise<{ ok: true; duplicate: boolean } | { ok: false; message: string }> {
  if (!is_uuid(input.client_token)) return { ok: false, message: 'No se pudo preparar el envío. Recarga la página.' }
  const result = await post_function({
    name: 'submit-survey',
    body: {
      slug: input.slug,
      client_token: input.client_token,
      answers: input.answers,
      nexoia_hp: input.honeypot,
      turnstile_token: input.turnstile_token,
    },
  })
  if (!result.ok) return result
  return { ok: true, duplicate: Boolean(result.data.duplicate) }
}

export async function subscribe_newsletter(input: {
  email: string
  name: string
  interests: string
  origin_label: string
  honeypot: string
  turnstile_token: string
}): Promise<{ ok: true; state: string; unsubscribe_token?: string } | { ok: false; message: string }> {
  const result = await post_function({
    name: 'subscribe-newsletter',
    body: {
      email: input.email,
      name: input.name,
      interests: input.interests,
      origin_label: input.origin_label,
      consent_granted: true,
      consent_text: CONSENT_TEXT,
      consent_version: CONSENT_VERSION,
      nexoia_hp: input.honeypot,
      turnstile_token: input.turnstile_token,
    },
  })
  if (!result.ok) return result
  return {
    ok: true,
    state: result.data.state ?? 'created',
    unsubscribe_token: result.data.unsubscribe_token,
  }
}

export async function unsubscribe_newsletter(input: {
  token: string
  honeypot: string
  turnstile_token: string
}): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  const result = await post_function({
    name: 'unsubscribe-newsletter',
    body: {
      token: input.token,
      nexoia_hp: input.honeypot,
      turnstile_token: input.turnstile_token,
    },
  })
  if (!result.ok) return result
  return { ok: true, message: result.data.message || 'Si el enlace es válido, la suscripción quedó cancelada.' }
}

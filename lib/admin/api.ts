// Operaciones del administrador autenticado. RLS impide que una sesión anónima lea o escriba estos datos.

import type { SupabaseClient } from '@supabase/supabase-js'
import { get_supabase_browser } from '@/lib/supabase/client'
import { as_number, create_id, sanitize_text, to_slug } from '@/lib/surveys/text'
import type {
  OptionRecord,
  QuestionDraft,
  QuestionRecord,
  ResponseRecord,
  StoredAnswer,
  SubscriberRecord,
  SurveyDraft,
  SurveyRecord,
  SurveyStatus,
} from '@/lib/surveys/types'

const SURVEY_COLUMNS = 'id,slug,title,description,disclaimer,institution,organization,duration_label,modality,session_count,instructor_name,status,estimated_minutes,starts_on,ends_on'
const QUESTION_COLUMNS = 'id,survey_id,section_key,section_title,prompt,help_text,question_type,position,is_required,metric_key,max_length'

function require_client(): SupabaseClient | null {
  return get_supabase_browser()
}

export function map_admin_error(message: string): string {
  if (message.includes('VALIDACION:')) {
    return message.split('VALIDACION:').pop()?.trim() || 'No se pudo guardar el cambio.'
  }
  if (message.toLowerCase().includes('row-level security') || message.toLowerCase().includes('permission')) {
    return 'No tienes permiso para realizar esta acción.'
  }
  if (message.includes('surveys_slug') || message.includes('slug')) {
    return 'El identificador público solo puede usar minúsculas, números y guiones.'
  }
  if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
    return 'Ya existe un registro con esos datos.'
  }
  return 'No se pudo completar la operación. Revisa los datos e inténtalo nuevamente.'
}

async function fetch_all_rows<T>(input: {
  load_page: (range: { from: number; to: number }) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
}): Promise<{ ok: true; rows: T[] } | { ok: false; message: string }> {
  const rows: T[] = []
  const page_size = 1000
  for (let page = 0; page < 50; page += 1) {
    const from = page * page_size
    const result = await input.load_page({ from, to: from + page_size - 1 })
    if (result.error) return { ok: false, message: map_admin_error(result.error.message) }
    const batch = result.data ?? []
    rows.push(...batch)
    if (batch.length < page_size) return { ok: true, rows }
  }
  return { ok: true, rows }
}

function nullable(value: string, max_length: number): string | null {
  const clean = sanitize_text(value, max_length)
  return clean ? clean : null
}

export function validate_survey_draft(draft: SurveyDraft): string | null {
  if (sanitize_text(draft.title, 180).length < 3) return 'Escribe un nombre de al menos 3 caracteres.'
  if (draft.status !== 'draft' && draft.questions.length === 0) {
    return 'Agrega al menos una pregunta antes de activar o cerrar la encuesta.'
  }
  const slug = to_slug(draft.slug || draft.title)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3) {
    return 'El identificador público debe tener letras o números, separados por guiones.'
  }
  if (draft.questions.length > 40) return 'Una encuesta puede tener hasta 40 preguntas.'
  if (draft.starts_on && draft.ends_on && draft.starts_on > draft.ends_on) {
    return 'La fecha de inicio no puede ser posterior a la fecha de cierre.'
  }
  if (draft.session_count.trim() && !/^\d+$/.test(draft.session_count.trim())) {
    return 'El número de sesiones debe ser un entero.'
  }

  const metric_keys = new Set<string>()
  for (const question of draft.questions) {
    if (sanitize_text(question.prompt, 500).length < 3) return 'Cada pregunta necesita un enunciado.'
    if (!/^[a-z0-9_-]{1,40}$/.test(question.section_key)) return 'La clave de sección no es válida.'
    if (sanitize_text(question.section_title, 120).length < 3) return 'Cada sección necesita un título.'
    const metric_key = question.metric_key.trim()
    if (metric_key) {
      if (!/^[a-z0-9_]{2,40}$/.test(metric_key)) return 'El identificador de indicador solo admite minúsculas, números y guion bajo.'
      if (metric_keys.has(metric_key)) return 'Hay dos preguntas con el mismo identificador de indicador.'
      metric_keys.add(metric_key)
    }
    if (question.question_type === 'single_choice' || question.question_type === 'multiple_choice') {
      const labels = question.options.map((option) => sanitize_text(option.label, 300)).filter(Boolean)
      if (labels.length < 2) return 'Las preguntas de opción necesitan al menos dos alternativas.'
      if (new Set(labels.map((label) => label.toLowerCase())).size !== labels.length) {
        return 'No repitas el mismo texto en las opciones de una pregunta.'
      }
      if (question.options.filter((option) => option.allows_free_text).length > 1) {
        return 'Solo una opción puede pedir un texto adicional.'
      }
    }
  }
  return null
}

export async function fetch_admin_surveys(): Promise<
  | { ok: true; surveys: Array<SurveyRecord & { response_count: number | null }> }
  | { ok: false; message: string }
> {
  const client = require_client()
  if (!client) return { ok: false, message: 'Falta la configuración de Supabase.' }
  const { data, error } = await client.from('surveys').select(`${SURVEY_COLUMNS},created_at`).order('created_at', { ascending: false })
  if (error || !data) return { ok: false, message: error ? map_admin_error(error.message) : 'No se pudieron cargar las capacitaciones.' }

  const surveys = await Promise.all((data as SurveyRecord[]).map(async (survey) => {
    const { count, error: count_error } = await client
      .from('survey_responses')
      .select('id', { count: 'exact', head: true })
      .eq('survey_id', survey.id)
    return { ...survey, response_count: count_error ? null : count ?? 0 }
  }))
  return { ok: true, surveys }
}

export async function fetch_editor_bundle(survey_id: string): Promise<
  | { ok: true; survey: SurveyRecord; questions: QuestionRecord[]; options: OptionRecord[]; response_count: number | null }
  | { ok: false; message: string }
> {
  const client = require_client()
  if (!client) return { ok: false, message: 'Falta la configuración de Supabase.' }
  const { data: survey, error } = await client.from('surveys').select(SURVEY_COLUMNS).eq('id', survey_id).maybeSingle()
  if (error || !survey) return { ok: false, message: 'No se encontró la capacitación.' }

  const { data: questions, error: question_error } = await client
    .from('survey_questions')
    .select(QUESTION_COLUMNS)
    .eq('survey_id', survey_id)
    .order('position', { ascending: true })
  if (question_error || !questions) return { ok: false, message: 'No se pudieron cargar las preguntas.' }

  const ids = questions.map((question) => question.id)
  let options: OptionRecord[] = []
  if (ids.length > 0) {
    const { data, error: option_error } = await client
      .from('survey_options')
      .select('id,question_id,label,position,allows_free_text')
      .in('question_id', ids)
      .order('position', { ascending: true })
    if (option_error || !data) return { ok: false, message: 'No se pudieron cargar las opciones.' }
    options = data as OptionRecord[]
  }

  const { count, error: count_error } = await client
    .from('survey_responses')
    .select('id', { count: 'exact', head: true })
    .eq('survey_id', survey_id)

  return {
    ok: true,
    survey: survey as SurveyRecord,
    questions: questions as QuestionRecord[],
    options,
    response_count: count_error ? null : count ?? 0,
  }
}

function survey_payload(draft: SurveyDraft, status: SurveyStatus) {
  return {
    slug: to_slug(draft.slug || draft.title),
    title: sanitize_text(draft.title, 180),
    description: nullable(draft.description, 2000),
    disclaimer: nullable(draft.disclaimer, 2000),
    institution: nullable(draft.institution, 180),
    organization: nullable(draft.organization, 180),
    duration_label: nullable(draft.duration_label, 80),
    modality: nullable(draft.modality, 80),
    session_count: draft.session_count.trim() ? Number(draft.session_count.trim()) : null,
    instructor_name: nullable(draft.instructor_name, 160),
    estimated_minutes: nullable(draft.estimated_minutes, 40),
    starts_on: draft.starts_on || null,
    ends_on: draft.ends_on || null,
    status,
  }
}

function question_rows(survey_id: string, questions: QuestionDraft[]) {
  return questions.map((question, index) => ({
    id: question.id,
    survey_id,
    section_key: question.section_key,
    section_title: sanitize_text(question.section_title, 120),
    prompt: sanitize_text(question.prompt, 500),
    help_text: nullable(question.help_text, 400),
    question_type: question.question_type,
    position: index + 1,
    is_required: question.is_required,
    metric_key: question.metric_key.trim() || null,
    max_length: question.question_type === 'open_text' ? 1000 : null,
  }))
}

function option_rows(questions: QuestionDraft[]) {
  return questions.flatMap((question) => {
    if (question.question_type !== 'single_choice' && question.question_type !== 'multiple_choice') return []
    return question.options
      .map((option) => ({ ...option, label: sanitize_text(option.label, 300) }))
      .filter((option) => option.label)
      .map((option, index) => ({
        id: option.id,
        question_id: question.id,
        label: option.label,
        position: index + 1,
        allows_free_text: option.allows_free_text,
      }))
  })
}

async function replace_questions(client: SupabaseClient, survey_id: string, questions: QuestionDraft[]) {
  const { data: existing, error: existing_error } = await client.from('survey_questions').select('id').eq('survey_id', survey_id)
  if (existing_error) return existing_error.message
  const ids = (existing ?? []).map((question) => question.id as string)
  if (ids.length > 0) {
    const { error: option_error } = await client.from('survey_options').delete().in('question_id', ids)
    if (option_error) return option_error.message
    const { error: question_error } = await client.from('survey_questions').delete().eq('survey_id', survey_id)
    if (question_error) return question_error.message
  }
  const { error: insert_error } = await client.from('survey_questions').insert(question_rows(survey_id, questions))
  if (insert_error) return insert_error.message
  const options = option_rows(questions)
  if (options.length > 0) {
    const { error: option_insert_error } = await client.from('survey_options').insert(options)
    if (option_insert_error) return option_insert_error.message
  }
  return null
}

export async function save_survey(input: {
  draft: SurveyDraft
  status: SurveyStatus
}): Promise<{ ok: true; survey_id: string } | { ok: false; message: string }> {
  const client = require_client()
  if (!client) return { ok: false, message: 'Falta la configuración de Supabase.' }
  const validation = validate_survey_draft({ ...input.draft, status: input.status })
  if (validation) return { ok: false, message: validation }
  if (input.status === 'active' && input.draft.questions.length === 0) {
    return { ok: false, message: 'Agrega preguntas antes de activar la encuesta.' }
  }

  const payload = survey_payload(input.draft, input.status)
  let survey_id = input.draft.id

  if (!survey_id) {
    const { data, error } = await client.from('surveys').insert(payload).select('id').single()
    if (error || !data) return { ok: false, message: error ? map_admin_error(error.message) : 'No se pudo crear la capacitación.' }
    survey_id = data.id as string
    const replace_error = await replace_questions(client, survey_id, input.draft.questions)
    if (replace_error) return { ok: false, message: map_admin_error(replace_error) }
    return { ok: true, survey_id }
  }

  const { count, error: count_error } = await client
    .from('survey_responses')
    .select('id', { count: 'exact', head: true })
    .eq('survey_id', survey_id)
  if (count_error) return { ok: false, message: 'No se pudo comprobar si la encuesta ya tiene respuestas.' }
  const is_locked = (count ?? 0) > 0

  const { slug: locked_slug, ...survey_without_slug } = payload
  void locked_slug
  const { error: update_error } = await client
    .from('surveys')
    .update(is_locked ? survey_without_slug : payload)
    .eq('id', survey_id)
  if (update_error) return { ok: false, message: map_admin_error(update_error.message) }

  if (is_locked) {
    for (const question of input.draft.questions) {
      const { error } = await client
        .from('survey_questions')
        .update({
          prompt: sanitize_text(question.prompt, 500),
          help_text: nullable(question.help_text, 400),
          section_title: sanitize_text(question.section_title, 120),
        })
        .eq('id', question.id)
        .eq('survey_id', survey_id)
      if (error) return { ok: false, message: map_admin_error(error.message) }
    }
    return { ok: true, survey_id }
  }

  const replace_error = await replace_questions(client, survey_id, input.draft.questions)
  if (replace_error) return { ok: false, message: map_admin_error(replace_error) }
  return { ok: true, survey_id }
}

export async function duplicate_survey(input: {
  source_id: string
  slug: string
  title: string
}): Promise<{ ok: true; survey_id: string } | { ok: false; message: string }> {
  const loaded = await fetch_editor_bundle(input.source_id)
  if (!loaded.ok) return loaded
  const questions: QuestionDraft[] = loaded.questions.map((question) => ({
    id: create_id(),
    section_key: question.section_key,
    section_title: question.section_title,
    prompt: question.prompt,
    help_text: question.help_text ?? '',
    question_type: question.question_type,
    is_required: question.is_required,
    metric_key: question.metric_key ?? '',
    options: loaded.options
      .filter((option) => option.question_id === question.id)
      .sort((left, right) => left.position - right.position)
      .map((option) => ({
        id: create_id(),
        label: option.label,
        allows_free_text: option.allows_free_text,
      })),
  }))
  const source = loaded.survey
  return save_survey({
    status: 'draft',
    draft: {
      id: null,
      slug: input.slug,
      title: input.title,
      description: source.description ?? '',
      disclaimer: source.disclaimer ?? '',
      institution: source.institution ?? '',
      organization: source.organization ?? '',
      duration_label: source.duration_label ?? '',
      modality: source.modality ?? '',
      session_count: source.session_count === null ? '' : String(source.session_count),
      instructor_name: source.instructor_name ?? '',
      estimated_minutes: source.estimated_minutes ?? '',
      starts_on: '',
      ends_on: '',
      status: 'draft',
      questions,
    },
  })
}

export async function delete_survey(survey_id: string): Promise<{ ok: boolean; message: string }> {
  const client = require_client()
  if (!client) return { ok: false, message: 'Falta la configuración de Supabase.' }
  const { count, error: count_error } = await client
    .from('survey_responses')
    .select('id', { count: 'exact', head: true })
    .eq('survey_id', survey_id)
  if (count_error) return { ok: false, message: 'No se pudo comprobar las evaluaciones existentes.' }
  if ((count ?? 0) > 0) return { ok: false, message: 'No se puede eliminar una capacitación que ya tiene evaluaciones.' }

  const { data: questions } = await client.from('survey_questions').select('id').eq('survey_id', survey_id)
  const ids = (questions ?? []).map((question) => question.id as string)
  if (ids.length > 0) {
    const { error } = await client.from('survey_options').delete().in('question_id', ids)
    if (error) return { ok: false, message: map_admin_error(error.message) }
    const { error: question_error } = await client.from('survey_questions').delete().eq('survey_id', survey_id)
    if (question_error) return { ok: false, message: map_admin_error(question_error.message) }
  }
  const { error } = await client.from('surveys').delete().eq('id', survey_id)
  if (error) return { ok: false, message: map_admin_error(error.message) }
  return { ok: true, message: 'Capacitación eliminada.' }
}

export async function fetch_dashboard_data(survey_id: string): Promise<
  | {
      ok: true
      survey: SurveyRecord
      questions: QuestionRecord[]
      options: OptionRecord[]
      responses: ResponseRecord[]
      answers: StoredAnswer[]
      subscribers: SubscriberRecord[]
    }
  | { ok: false; message: string }
> {
  const client = require_client()
  if (!client) return { ok: false, message: 'Falta la configuración de Supabase.' }
  const bundle = await fetch_editor_bundle(survey_id)
  if (!bundle.ok) return bundle

  const responses = await fetch_all_rows<ResponseRecord>({
    load_page: ({ from, to }) => client
      .from('survey_responses')
      .select('id,survey_id,submitted_at')
      .eq('survey_id', survey_id)
      .order('submitted_at', { ascending: true })
      .range(from, to),
  })
  if (!responses.ok) return responses

  const response_ids = responses.rows.map((response) => response.id)
  const answers: StoredAnswer[] = []
  for (let index = 0; index < response_ids.length; index += 40) {
    const chunk = response_ids.slice(index, index + 40)
    const loaded = await fetch_all_rows<{
      id: string
      response_id: string
      question_id: string
      numeric_value: number | string | null
      text_value: string | null
      option_id: string | null
    }>({
      load_page: ({ from, to }) => client
        .from('survey_answers')
        .select('id,response_id,question_id,numeric_value,text_value,option_id')
        .in('response_id', chunk)
        .range(from, to),
    })
    if (!loaded.ok) return loaded
    answers.push(...loaded.rows.map((row) => ({ ...row, numeric_value: as_number(row.numeric_value) })))
  }

  const subscribers = await fetch_all_rows<SubscriberRecord>({
    load_page: ({ from, to }) => client
      .from('newsletter_subscribers')
      .select('id,email,name,interests,consent_version,consented_at,origin_label,unsubscribed_at')
      .order('consented_at', { ascending: false })
      .range(from, to),
  })
  if (!subscribers.ok) return subscribers

  return {
    ok: true,
    survey: bundle.survey,
    questions: bundle.questions,
    options: bundle.options,
    responses: responses.rows,
    answers,
    subscribers: subscribers.rows,
  }
}

export async function mark_subscriber_unsubscribed(id: string): Promise<{ ok: boolean; message: string }> {
  const client = require_client()
  if (!client) return { ok: false, message: 'Falta la configuración de Supabase.' }
  const { error } = await client
    .from('newsletter_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: map_admin_error(error.message) }
  return { ok: true, message: 'Suscripción cancelada.' }
}

export async function delete_subscriber(id: string): Promise<{ ok: boolean; message: string }> {
  const client = require_client()
  if (!client) return { ok: false, message: 'Falta la configuración de Supabase.' }
  const { error } = await client.from('newsletter_subscribers').delete().eq('id', id)
  if (error) return { ok: false, message: map_admin_error(error.message) }
  return { ok: true, message: 'Registro eliminado.' }
}

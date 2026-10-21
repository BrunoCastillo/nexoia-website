// Recibe una evaluación anónima, aplica controles antiabuso y la guarda con la función privilegiada.

import { UUID_PATTERN } from '../_shared/constants.ts'
import { create_service_client, is_honeypot_tripped, take_rate_limit, verify_turnstile } from '../_shared/guards.ts'
import { cors_for, json_response, public_message, read_json } from '../_shared/http.ts'

function sanitize_text(value: string, max_length: number): string {
  return value.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max_length)
}

function sanitize_answers(value: unknown): { ok: true; answers: Record<string, unknown>[] } | { ok: false; message: string } {
  if (!Array.isArray(value) || value.length > 40) {
    return { ok: false, message: 'La evaluación no tiene un formato válido.' }
  }
  const answers: Record<string, unknown>[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { ok: false, message: 'La evaluación no tiene un formato válido.' }
    }
    const record = item as Record<string, unknown>
    if (typeof record.question_id !== 'string' || !UUID_PATTERN.test(record.question_id)) {
      return { ok: false, message: 'Hay una pregunta no reconocida.' }
    }
    const next: Record<string, unknown> = { question_id: record.question_id }
    if (typeof record.numeric_value === 'number' && Number.isFinite(record.numeric_value)) {
      next.numeric_value = record.numeric_value
    }
    if (typeof record.text_value === 'string') next.text_value = sanitize_text(record.text_value, 1000)
    if (Array.isArray(record.option_ids)) {
      next.option_ids = record.option_ids
        .filter((id): id is string => typeof id === 'string' && UUID_PATTERN.test(id))
        .slice(0, 30)
    }
    answers.push(next)
  }
  return { ok: true, answers }
}

Deno.serve(async (request) => {
  const cors = cors_for(request)
  if (request.method === 'OPTIONS') return new Response(null, { status: cors.allowed ? 204 : 403, headers: cors.headers })
  if (request.method !== 'POST' || !cors.allowed) {
    return json_response(403, { ok: false, message: 'Origen no permitido.' }, cors.headers)
  }

  const body = await read_json(request)
  if (!body.ok) return json_response(400, { ok: false, message: body.message }, cors.headers)
  if (is_honeypot_tripped(body.value.nexoia_hp)) {
    return json_response(400, { ok: false, message: 'No se pudo enviar el formulario. Inténtalo nuevamente.' }, cors.headers)
  }

  const slug = typeof body.value.slug === 'string' ? body.value.slug.trim() : ''
  const client_token = typeof body.value.client_token === 'string' ? body.value.client_token : ''
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !UUID_PATTERN.test(client_token)) {
    return json_response(400, { ok: false, message: 'La solicitud de evaluación no es válida.' }, cors.headers)
  }

  const answers = sanitize_answers(body.value.answers)
  if (!answers.ok) return json_response(400, { ok: false, message: answers.message }, cors.headers)

  const turnstile = await verify_turnstile(request, body.value.turnstile_token)
  if (!turnstile.ok) return json_response(400, turnstile, cors.headers)

  const client = create_service_client()
  if (!client) return json_response(500, { ok: false, message: 'El servicio de encuestas no está configurado.' }, cors.headers)

  const limited = await take_rate_limit({ client, request, action: 'submit_survey', limit: 8, headers: cors.headers })
  if (limited) return limited

  const { data, error } = await client.rpc('insert_survey_submission', {
    p_slug: slug,
    p_client_token: client_token,
    p_answers: answers.answers,
  })
  if (error || !data || data.ok !== true) {
    return json_response(400, {
      ok: false,
      message: public_message(data?.message, 'No se pudo guardar la evaluación.'),
    }, cors.headers)
  }

  return json_response(200, { ok: true, duplicate: Boolean(data.duplicate) }, cors.headers)
})

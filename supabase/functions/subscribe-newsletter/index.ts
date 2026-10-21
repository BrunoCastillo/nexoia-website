// Registra una suscripción voluntaria sin relacionarla con las respuestas de la evaluación.

import { CONSENT_TEXT, CONSENT_VERSION } from '../_shared/constants.ts'
import { create_service_client, is_honeypot_tripped, take_rate_limit, verify_turnstile } from '../_shared/guards.ts'
import { cors_for, json_response, public_message, read_json } from '../_shared/http.ts'

function clean(value: unknown, max_length: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max_length)
}

function create_token(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((item) => item.toString(16).padStart(2, '0')).join('')
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
    return json_response(400, { ok: false, message: 'No se pudo registrar la suscripción.' }, cors.headers)
  }
  if (body.value.consent_granted !== true || clean(body.value.consent_text, 800) !== CONSENT_TEXT || body.value.consent_version !== CONSENT_VERSION) {
    return json_response(400, { ok: false, message: 'La suscripción requiere el consentimiento informado.' }, cors.headers)
  }

  const turnstile = await verify_turnstile(request, body.value.turnstile_token)
  if (!turnstile.ok) return json_response(400, turnstile, cors.headers)

  const client = create_service_client()
  if (!client) return json_response(500, { ok: false, message: 'El servicio de suscripción no está configurado.' }, cors.headers)
  const limited = await take_rate_limit({ client, request, action: 'subscribe', limit: 5, headers: cors.headers })
  if (limited) return limited

  const token = create_token()
  const { data, error } = await client.rpc('register_newsletter_subscription', {
    p_email: clean(body.value.email, 254),
    p_name: clean(body.value.name, 120),
    p_interests: clean(body.value.interests, 500),
    p_consent: true,
    p_consent_text: CONSENT_TEXT,
    p_consent_version: CONSENT_VERSION,
    p_origin_label: clean(body.value.origin_label, 200),
    p_unsubscribe_token: token,
  })

  if (error || !data || data.ok !== true) {
    return json_response(400, { ok: false, message: public_message(data?.message, 'No se pudo registrar la suscripción.') }, cors.headers)
  }

  const state = typeof data.state === 'string' ? data.state : 'created'
  return json_response(200, {
    ok: true,
    state,
    unsubscribe_token: state === 'created' || state === 'restored' ? token : undefined,
  }, cors.headers)
})

// Cancela una suscripción con un token. No indica si ese token existía.

import { create_service_client, is_honeypot_tripped, take_rate_limit, verify_turnstile } from '../_shared/guards.ts'
import { cors_for, json_response, read_json } from '../_shared/http.ts'

const SUCCESS = 'Si el enlace es válido, la suscripción quedó cancelada.'

Deno.serve(async (request) => {
  const cors = cors_for(request)
  if (request.method === 'OPTIONS') return new Response(null, { status: cors.allowed ? 204 : 403, headers: cors.headers })
  if (request.method !== 'POST' || !cors.allowed) {
    return json_response(403, { ok: false, message: 'Origen no permitido.' }, cors.headers)
  }

  const body = await read_json(request)
  if (!body.ok) return json_response(400, { ok: false, message: body.message }, cors.headers)
  if (is_honeypot_tripped(body.value.nexoia_hp)) {
    return json_response(400, { ok: false, message: 'No se pudo procesar la solicitud.' }, cors.headers)
  }

  const turnstile = await verify_turnstile(request, body.value.turnstile_token)
  if (!turnstile.ok) return json_response(400, turnstile, cors.headers)

  const client = create_service_client()
  if (!client) return json_response(500, { ok: false, message: 'El servicio de suscripción no está configurado.' }, cors.headers)
  const limited = await take_rate_limit({ client, request, action: 'unsubscribe', limit: 10, headers: cors.headers })
  if (limited) return limited

  const token = typeof body.value.token === 'string' ? body.value.token.trim() : ''
  if (/^[0-9a-f]{32,128}$/.test(token)) {
    await client.rpc('cancel_newsletter_subscription', { p_token: token })
  }

  return json_response(200, { ok: true, message: SUCCESS }, cors.headers)
})
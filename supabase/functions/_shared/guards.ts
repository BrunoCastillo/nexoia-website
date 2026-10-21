// Controles compartidos: honeypot, Turnstile, límite de frecuencia y cliente privilegiado.

import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'
import { json_response } from './http.ts'

export function is_honeypot_tripped(value: unknown): boolean {
  return value !== undefined && value !== null && value !== ''
}

export function client_address(request: Request): string {
  return request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'desconocido'
}

export async function client_hash(request: Request, action: string): Promise<string> {
  const salt = Deno.env.get('RATE_LIMIT_SALT') ?? 'nexoia-cambia-este-valor'
  const agent = (request.headers.get('user-agent') ?? '').slice(0, 180)
  const bytes = new TextEncoder().encode(`${salt}|${action}|${client_address(request)}|${agent}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((item) => item.toString(16).padStart(2, '0')).join('')
}

export function create_service_client(): SupabaseClient | null {
  const url = Deno.env.get('SUPABASE_URL') ?? ''
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export async function verify_turnstile(request: Request, token: unknown): Promise<{ ok: true } | { ok: false; message: string }> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY') ?? ''
  if (!secret) return { ok: true }
  if (typeof token !== 'string' || token.length < 10 || token.length > 2048) {
    return { ok: false, message: 'Confirma que no eres un sistema automatizado.' }
  }

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  const ip = client_address(request)
  if (ip !== 'desconocido') body.set('remoteip', ip)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    const result = await response.json() as { success?: boolean }
    if (!result.success) return { ok: false, message: 'No pudimos verificar el envío. Recarga la página e inténtalo nuevamente.' }
    return { ok: true }
  } catch {
    return { ok: false, message: 'No pudimos verificar el envío. Inténtalo nuevamente.' }
  }
}

export async function take_rate_limit(input: {
  client: SupabaseClient
  request: Request
  action: 'submit_survey' | 'subscribe' | 'unsubscribe'
  limit: number
  headers: Record<string, string>
}): Promise<Response | null> {
  const hash = await client_hash(input.request, input.action)
  const { data, error } = await input.client.rpc('consume_public_rate_limit', {
    p_action: input.action,
    p_client_hash: hash,
    p_limit: input.limit,
    p_window_seconds: 3600,
  })
  if (error || data !== true) {
    return json_response(429, { ok: false, message: 'Demasiados envíos. Espera un momento e inténtalo nuevamente.' }, input.headers)
  }
  return null
}

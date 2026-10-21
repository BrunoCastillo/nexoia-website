// Resuelve CORS y el cuerpo JSON de las funciones públicas.

const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:5000',
  'http://localhost:8080',
  'https://nexoia-website.vercel.app',
]

export function cors_for(request: Request): { allowed: boolean; headers: Record<string, string> } {
  const origin = request.headers.get('origin') ?? ''
  const extra = (Deno.env.get('ALLOWED_ORIGIN') ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const allow_previews = Deno.env.get('ALLOW_VERCEL_PREVIEWS') === 'true'
  const is_allowed = new Set([...DEFAULT_ORIGINS, ...extra]).has(origin)
    || (allow_previews && origin.startsWith('https://') && origin.endsWith('.vercel.app'))

  return {
    allowed: is_allowed,
    headers: {
      'Access-Control-Allow-Origin': is_allowed ? origin : DEFAULT_ORIGINS[4],
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  }
}

export function json_response(status: number, body: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export async function read_json(request: Request): Promise<
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; message: string }
> {
  const raw = await request.text()
  if (raw.length > 50000) return { ok: false, message: 'La solicitud es demasiado grande.' }
  try {
    const value = JSON.parse(raw) as unknown
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { ok: false, message: 'La solicitud no es válida.' }
    }
    return { ok: true, value: value as Record<string, unknown> }
  } catch {
    return { ok: false, message: 'La solicitud no es válida.' }
  }
}

export function public_message(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 180) return fallback
  if (/sql|stack|password|token|key|function/i.test(value)) return fallback
  return value
}

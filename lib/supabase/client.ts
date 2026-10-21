// Cliente público de Supabase. Solo usa la clave anónima; la clave privada no entra al navegador.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type PublicConfig = {
  url: string
  anon_key: string
  turnstile_site_key: string
  site_url: string
}

let browser_client: SupabaseClient | null = null

export function get_public_config(): PublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anon_key) return null
  return {
    url,
    anon_key,
    turnstile_site_key: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '',
    site_url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://nexoia-website.vercel.app').replace(/\/$/, ''),
  }
}

export function get_supabase_browser(): SupabaseClient | null {
  const config = get_public_config()
  if (!config || typeof window === 'undefined') return null
  if (!browser_client) {
    browser_client = createClient(config.url, config.anon_key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return browser_client
}

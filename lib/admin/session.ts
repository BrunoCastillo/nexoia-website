// Sesión del panel. La autorización real la confirman las políticas RLS, no solo esta pantalla.

import { get_public_config, get_supabase_browser } from '@/lib/supabase/client'
import { normalize_email } from '@/lib/surveys/text'

export type AdminSession =
  | { state: 'missing_config' }
  | { state: 'anonymous' }
  | { state: 'forbidden'; email: string }
  | { state: 'admin'; email: string; user_id: string }

export async function read_admin_session(): Promise<AdminSession> {
  if (!get_public_config()) return { state: 'missing_config' }
  const client = get_supabase_browser()
  if (!client) return { state: 'missing_config' }

  const { data: session_data, error } = await client.auth.getSession()
  if (error || !session_data.session?.user) return { state: 'anonymous' }

  const user = session_data.session.user
  const { data, error: admin_error } = await client
    .from('admin_users')
    .select('user_id,email,is_active')
    .eq('user_id', user.id)
    .maybeSingle()

  if (admin_error || !data?.is_active) {
    return { state: 'forbidden', email: user.email ?? '' }
  }

  return { state: 'admin', email: data.email || user.email || '', user_id: user.id }
}

export async function sign_in_admin(input: {
  email: string
  password: string
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const client = get_supabase_browser()
  if (!client) return { ok: false, message: 'Falta la configuración de Supabase.' }
  const email = normalize_email(input.email)
  if (!email || input.password.length < 6) {
    return { ok: false, message: 'Ingresa el correo y la contraseña del administrador.' }
  }

  const { data, error } = await client.auth.signInWithPassword({ email, password: input.password })
  if (error || !data.user) return { ok: false, message: 'Correo o contraseña incorrectos.' }

  const { data: admin_row, error: admin_error } = await client
    .from('admin_users')
    .select('user_id,is_active')
    .eq('user_id', data.user.id)
    .maybeSingle()

  if (admin_error || !admin_row?.is_active) {
    await client.auth.signOut()
    return { ok: false, message: 'Esta cuenta no está autorizada para administrar encuestas.' }
  }

  return { ok: true }
}

export async function sign_out_admin(): Promise<void> {
  const client = get_supabase_browser()
  if (!client) return
  await client.auth.signOut()
}

export async function request_password_reset(input: {
  email: string
}): Promise<{ ok: boolean; message: string }> {
  const client = get_supabase_browser()
  const email = normalize_email(input.email)
  if (!client || !email) return { ok: false, message: 'Ingresa un correo válido.' }
  const redirect_to = `${window.location.origin}/admin/acceso`
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: redirect_to })
  if (error) {
    return { ok: false, message: 'No se pudo enviar la recuperación. Revisa la configuración de Auth en Supabase.' }
  }
  return { ok: true, message: 'Si el correo está registrado, recibirás un enlace para restablecer la contraseña.' }
}

// Enlace de la evaluación pública. La respuesta se guarda en Google Forms, sin Supabase.
// NEXT_PUBLIC_GOOGLE_FORM_URL permite cambiar el formulario desde Vercel sin tocar el código.

const DEFAULT_GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSc7KeFcvpMV8mm7LzMbEiucul63-CPl-D4Xii5RVPkPOJPloQ/viewform'

const configured_url = (process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ?? '').trim()

export const GOOGLE_FORM_VIEW_URL = configured_url || DEFAULT_GOOGLE_FORM_URL

export function to_google_form_embed_url(view_url: string): string {
  if (!view_url) return ''
  try {
    const url = new URL(view_url)
    const is_google_form = url.hostname === 'docs.google.com' && url.pathname.includes('/forms/')
    if (!is_google_form) return ''
    url.searchParams.set('embedded', 'true')
    return url.toString()
  } catch {
    return ''
  }
}

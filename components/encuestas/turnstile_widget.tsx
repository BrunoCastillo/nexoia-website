'use client'

// Carga Cloudflare Turnstile solo cuando existe una clave pública de sitio.

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string
      remove: (widget_id: string) => void
    }
  }
}

export function TurnstileWidget({
  site_key,
  reset_key,
  on_token,
}: {
  site_key: string
  reset_key: number
  on_token: (token: string) => void
}) {
  const container_ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let is_active = true
    let widget_id = ''

    const render_widget = () => {
      if (!is_active || !container_ref.current || !window.turnstile) return
      if (widget_id) window.turnstile.remove(widget_id)
      widget_id = window.turnstile.render(container_ref.current, {
        sitekey: site_key,
        callback: (token: string) => on_token(token),
        'expired-callback': () => on_token(''),
        'error-callback': () => on_token(''),
      })
    }

    if (window.turnstile) {
      render_widget()
    } else {
      const existing = document.querySelector<HTMLScriptElement>('script[data-nexoia-turnstile="true"]')
      const script = existing ?? document.createElement('script')
      script.addEventListener('load', render_widget, { once: true })
      if (!existing) {
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        script.async = true
        script.dataset.nexoiaTurnstile = 'true'
        document.head.appendChild(script)
      }
    }

    return () => {
      is_active = false
      if (widget_id && window.turnstile) window.turnstile.remove(widget_id)
    }
  }, [on_token, reset_key, site_key])

  return <div ref={container_ref} className="min-h-[65px]" />
}

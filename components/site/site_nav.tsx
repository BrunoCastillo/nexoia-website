'use client'

// Navegación principal. En escritorio es una lista de enlaces; en móvil, un panel que se abre
// con un botón con aria-expanded, se cierra con Escape y al cambiar de página.

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS, SITE } from '@/lib/site'
import { button_classes } from '@/components/ui/button'

function is_current(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav() {
  const pathname = usePathname() ?? '/'
  const [is_open, setIsOpen] = useState(false)
  const button_ref = useRef<HTMLButtonElement>(null)

  const close = useCallback((return_focus: boolean) => {
    setIsOpen(false)
    if (return_focus) button_ref.current?.focus()
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!is_open) return
    const on_key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true)
    }
    document.addEventListener('keydown', on_key)
    return () => document.removeEventListener('keydown', on_key)
  }, [is_open, close])

  return (
    <>
      <nav aria-label="Principal" className="hidden lg:block">
        <ul className="flex items-center gap-7 text-base font-medium">
          {NAV_ITEMS.map((item) => {
            const current = is_current(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={`py-2 underline-offset-[6px] hover:underline ${current ? 'underline decoration-brand-yellow decoration-[3px]' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
          <li>
            <a href={SITE.calendly_url} target="_blank" rel="noopener noreferrer" className={button_classes('primary')}>
              Agendar diagnóstico
              <span className="sr-only"> de 30 minutos (se abre en una pestaña nueva)</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="lg:hidden">
        <button
          ref={button_ref}
          type="button"
          aria-expanded={is_open}
          aria-controls="menu-movil"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-white/70 px-4 font-semibold text-white"
        >
          {is_open ? <X size={20} strokeWidth={2} aria-hidden="true" /> : <Menu size={20} strokeWidth={2} aria-hidden="true" />}
          <span>{is_open ? 'Cerrar' : 'Menú'}</span>
        </button>
      </div>

      <div
        id="menu-movil"
        hidden={!is_open}
        className="absolute inset-x-0 top-full border-t border-white/15 bg-brand-indigo pb-8 lg:hidden"
      >
        <nav aria-label="Principal" className="mx-auto max-w-page px-4 sm:px-6">
          <ul className="divide-y divide-white/15">
            {NAV_ITEMS.map((item) => {
              const current = is_current(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? 'page' : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`flex min-h-[56px] items-center font-display text-2xl font-bold ${current ? 'text-brand-yellow' : 'text-white'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-6 flex flex-col items-start gap-4">
            <a href={SITE.calendly_url} target="_blank" rel="noopener noreferrer" className={button_classes('primary', 'lg')}>
              Agendar diagnóstico de 30 min
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
            <a href={SITE.whatsapp_url} target="_blank" rel="noopener noreferrer" className="link-underline font-medium text-white">
              o escríbenos por WhatsApp
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}

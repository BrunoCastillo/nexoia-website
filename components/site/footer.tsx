// Pie de página sobre el campo índigo: navegación, evaluaciones de cursos, privacidad y contacto real.

import Link from 'next/link'
import { Instagram, Mail, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { NAV_ITEMS, SITE } from '@/lib/site'
import { Logo } from './logo'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-indigo border-t border-white/15 bg-brand-indigo text-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-on-indigo">
              Capacitación en inteligencia artificial y automatizaciones a medida para empresas e instituciones de Ecuador. Desde Cuenca.
            </p>
          </div>

          <nav aria-labelledby="pie-sitio">
            <h2 id="pie-sitio" className="font-display text-lg font-bold">
              Sitio
            </h2>
            <ul className="mt-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-[40px] items-center text-on-indigo hover:text-white hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="pie-cursos">
            <h2 id="pie-cursos" className="font-display text-lg font-bold">
              Participantes
            </h2>
            <ul className="mt-3 space-y-1">
              <li>
                <Link href="/encuestas" className="inline-flex min-h-[40px] items-center text-on-indigo hover:text-white hover:underline">
                  Evaluaciones de cursos
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="inline-flex min-h-[40px] items-center text-on-indigo hover:text-white hover:underline">
                  Privacidad
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-lg font-bold">Contacto</h2>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={`mailto:${SITE.email}`} className="inline-flex min-h-[40px] items-center gap-2 text-on-indigo hover:text-white hover:underline">
                  <Mail size={18} strokeWidth={2} aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.whatsapp_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-2 text-on-indigo hover:text-white hover:underline">
                  <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                  WhatsApp <span className="whitespace-nowrap">{SITE.whatsapp_display}</span>
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
              <li>
                <a href={SITE.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-2 text-on-indigo hover:text-white hover:underline">
                  <Instagram size={18} strokeWidth={2} aria-hidden="true" />
                  Instagram {SITE.instagram_handle}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-white/15 pt-6 text-sm text-on-indigo">
          © {year} NexoIA. {SITE.city}.
        </p>
      </Container>
    </footer>
  )
}

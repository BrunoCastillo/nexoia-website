// Cierre de página con el único CTA del sitio y la alternativa de WhatsApp en texto.

import { ButtonLink } from './button'
import { Container } from './container'
import { MarkerUnderline } from './marker_underline'
import { PRIMARY_CTA_LABEL, SITE } from '@/lib/site'

export function CtaBanner({
  title = 'Conversemos 30 minutos sobre tu proceso',
  text = 'En el diagnóstico revisamos qué quieres resolver, con qué herramientas trabajas hoy y si la IA tiene sentido ahí. Si lo tiene, te enviamos una propuesta.',
}: {
  title?: string
  text?: string
}) {
  return (
    <section aria-labelledby="cierre-titulo" className="border-t border-line bg-surface">
      <Container className="py-section">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-prose">
            <h2 id="cierre-titulo" className="text-display-2">
              {title}
            </h2>
            <MarkerUnderline className="mt-3 h-4 w-40" />
            <p className="mt-5 text-lead text-muted">{text}</p>
          </div>
          <CtaActions />
        </div>
      </Container>
    </section>
  )
}

export function CtaActions({ on_indigo = false }: { on_indigo?: boolean }) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <ButtonLink href={SITE.calendly_url} size="lg">
        {PRIMARY_CTA_LABEL}
      </ButtonLink>
      <a
        href={SITE.whatsapp_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`link-underline font-medium ${on_indigo ? 'text-white' : 'text-brand-indigo'}`}
      >
        o escríbenos por WhatsApp
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    </div>
  )
}

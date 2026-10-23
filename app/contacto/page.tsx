import type { Metadata } from 'next'
import { CalendarCheck, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react'
import { PageHero } from '@/components/ui/page_hero'
import { Section } from '@/components/ui/section'
import { ButtonLink } from '@/components/ui/button'
import { ContactForm } from '@/components/site/contact_form'
import { PRIMARY_CTA_LABEL, SITE, page_metadata } from '@/lib/site'

export const metadata: Metadata = page_metadata({
  title: 'Contacto',
  description:
    'Agenda un diagnóstico de 30 minutos, escríbenos por WhatsApp o déjanos un mensaje. NexoIA, Cuenca, Ecuador.',
  path: '/contacto',
})

const faqs = [
  {
    question: '¿Cuánto cuesta un proyecto o un curso?',
    answer:
      'Depende del alcance. Después del diagnóstico te enviamos una propuesta por escrito con entregables, plazo y costo. No trabajamos con planes mensuales cerrados.',
  },
  {
    question: '¿Las capacitaciones son presenciales?',
    answer:
      'El programa Inteligencia Artificial Aplicada a las Finanzas es presencial. Para un curso in-company acordamos contigo el formato, la duración y los temas en el diagnóstico.',
  },
  {
    question: '¿Qué necesitamos tener listo para empezar?',
    answer:
      'Una persona que conozca bien el proceso y ejemplos de los archivos, mensajes o reportes con los que trabajan hoy. Los accesos a las herramientas se piden recién en la implementación.',
  },
]

export default function ContactoPage() {
  return (
    <>
      <PageHero
        title="Contacto"
        lead="La forma más rápida es agendar el diagnóstico de 30 minutos. Si prefieres, escríbenos por WhatsApp o déjanos un mensaje aquí."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <ContactForm />

          <aside aria-labelledby="otras-vias" className="space-y-8">
            <div className="rounded-card bg-brand-indigo p-6 text-white on-indigo sm:p-8">
              <CalendarCheck size={32} strokeWidth={2} className="text-brand-yellow" aria-hidden="true" />
              <h2 className="mt-4 text-display-3">Diagnóstico de 30 minutos</h2>
              <p className="mt-3 text-on-indigo">Eliges el horario en el calendario y conversamos sobre tu proceso.</p>
              <ButtonLink href={SITE.calendly_url} className="mt-6">
                {PRIMARY_CTA_LABEL}
              </ButtonLink>
            </div>

            <div>
              <h2 id="otras-vias" className="font-display text-xl font-bold">
                Otras vías
              </h2>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3">
                  <MessageCircle size={22} strokeWidth={2} className="mt-0.5 shrink-0 text-brand-indigo" aria-hidden="true" />
                  <a href={SITE.whatsapp_url} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">
                    WhatsApp {SITE.whatsapp_display}
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={22} strokeWidth={2} className="mt-0.5 shrink-0 text-brand-indigo" aria-hidden="true" />
                  <a href={`mailto:${SITE.email}`} className="link-underline font-medium">
                    {SITE.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram size={22} strokeWidth={2} className="mt-0.5 shrink-0 text-brand-indigo" aria-hidden="true" />
                  <a href={SITE.instagram_url} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">
                    Instagram {SITE.instagram_handle}
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={22} strokeWidth={2} className="mt-0.5 shrink-0 text-brand-indigo" aria-hidden="true" />
                  <span className="font-medium">Cuenca, Azuay, Ecuador</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="surface" bordered labelledby="preguntas-titulo">
        <h2 id="preguntas-titulo" className="text-display-2">
          Preguntas frecuentes
        </h2>
        <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-xl font-bold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span aria-hidden="true" className="mt-1 font-sans text-2xl leading-none text-brand-indigo group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-prose text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  )
}

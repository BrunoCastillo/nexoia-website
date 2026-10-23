import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart3, CalendarCheck, FileSpreadsheet, MessageCircle, Send } from 'lucide-react'
import { PageHero } from '@/components/ui/page_hero'
import { Section, SectionHeading } from '@/components/ui/section'
import { CtaActions, CtaBanner } from '@/components/ui/cta_banner'
import { Tag } from '@/components/ui/card'
import { ProcessSteps } from '@/components/site/process_steps'
import { AUTOMATION_SERVICES, PROJECTS, TRAINING } from '@/lib/content'
import { page_metadata } from '@/lib/site'

export const metadata: Metadata = page_metadata({
  title: 'Servicios',
  description:
    'Automatización e IA a medida (agentes de WhatsApp, agendamiento, publicación en redes, reportes y agentes de Excel) y capacitación en IA para equipos de empresas e instituciones de Ecuador.',
  path: '/servicios',
})

const icons = [MessageCircle, CalendarCheck, Send, BarChart3, FileSpreadsheet]

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        title="Servicios"
        lead="Dos líneas de trabajo que se complementan: automatizaciones e IA hechas a la medida de tus procesos, y capacitación para que tu equipo las use con criterio."
      >
        <CtaActions on_indigo />
      </PageHero>

      <Section labelledby="automatizacion-titulo">
        <SectionHeading
          id="automatizacion-titulo"
          title="Automatización e IA a medida"
          lead="Soluciones sobre herramientas que tu equipo ya usa. Cada una se diseña después del diagnóstico, con tus datos y tus reglas."
        />
        <ul className="grid gap-x-10 md:grid-cols-2">
          {AUTOMATION_SERVICES.map((service, index) => {
            const Icon = icons[index]
            const project = PROJECTS.find((item) => item.id === service.project)
            return (
              <li key={service.title} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-t border-line py-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-card bg-brand-mist text-brand-indigo">
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold">{service.title}</h3>
                  <p className="mt-2 text-muted">{service.text}</p>
                  {project && (
                    <p className="mt-3 text-sm">
                      <Link href={`/proyectos#${project.id}`} className="link-underline font-semibold text-brand-indigo">
                        Proyecto relacionado: {project.title}
                      </Link>
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section tone="surface" bordered labelledby="capacitacion-titulo">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div className="max-w-prose">
            <h2 id="capacitacion-titulo" className="text-display-2">
              Capacitación en IA aplicada
            </h2>
            <p className="mt-4 text-lead text-muted">
              Formación presencial con prácticas sobre casos de trabajo. Se ofrece como programa abierto o in-company, adaptado al área y a
              los procesos de tu institución.
            </p>
            <p className="mt-6">
              <Link href="/capacitacion" className="link-underline font-semibold text-brand-indigo">
                Ver el temario completo
              </Link>
            </p>
          </div>
          <div className="rounded-card border border-line bg-paper p-6 sm:p-8">
            <h3 className="text-display-3">{TRAINING.title}</h3>
            <p className="mt-2 text-muted">Dictado para {TRAINING.institutions}.</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Datos del programa">
              <li><Tag>{TRAINING.hours}</Tag></li>
              <li><Tag>{TRAINING.sessions}</Tag></li>
              <li><Tag>{TRAINING.modality}</Tag></li>
            </ul>
          </div>
        </div>
      </Section>

      <Section bordered labelledby="cotizacion-titulo">
        <SectionHeading
          id="cotizacion-titulo"
          title="Cómo cotizamos"
          lead="No publicamos precios fijos. Cada proyecto o curso se cotiza después del diagnóstico, cuando conocemos el proceso, el volumen de trabajo y las herramientas que ya usas."
        />
        <ProcessSteps />
      </Section>

      <CtaBanner title="Cuéntanos qué proceso quieres mejorar" />
    </>
  )
}

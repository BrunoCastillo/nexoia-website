import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/page_hero'
import { Section, SectionHeading } from '@/components/ui/section'
import { CtaActions } from '@/components/ui/cta_banner'
import { MarkerUnderline } from '@/components/ui/marker_underline'
import { TRAINING } from '@/lib/content'
import { page_metadata } from '@/lib/site'

export const metadata: Metadata = page_metadata({
  title: 'Capacitación',
  description:
    'Programa presencial Inteligencia Artificial Aplicada a las Finanzas (32 horas, 11 sesiones) dictado para Universidad de Cuenca y ETAPA EP, y formato in-company a medida.',
  path: '/capacitacion',
})

const facts = [
  { label: 'Dictado para', value: TRAINING.institutions },
  { label: 'Duración', value: TRAINING.hours },
  { label: 'Sesiones', value: '11' },
  { label: 'Modalidad', value: TRAINING.modality },
]

export default function CapacitacionPage() {
  return (
    <>
      <PageHero
        title={TRAINING.title}
        lead="Un programa para que los equipos financieros entiendan qué puede y qué no puede hacer la IA, y la apliquen con datos, prácticas y validación de resultados."
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-white/20 bg-white/20">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-brand-indigo p-5 sm:p-6">
                <dt className="text-sm text-on-indigo">{fact.label}</dt>
                <dd className="mt-1 font-display text-xl font-bold leading-tight sm:text-2xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <CtaActions on_indigo />
      </PageHero>

      <Section labelledby="temario-titulo">
        <SectionHeading id="temario-titulo" title="Temario" lead="Los seis temas oficiales del programa." />
        <ol className="grid gap-x-10 md:grid-cols-2">
          {TRAINING.topics.map((topic, index) => (
            <li key={topic} className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-3 border-t border-line py-6">
              <span className="font-display text-3xl font-extrabold text-brand-indigo" aria-hidden="true">
                {index + 1}
              </span>
              <p className="font-display text-xl font-bold leading-snug">
                <span className="sr-only">Tema {index + 1}: </span>
                {topic}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="surface" bordered labelledby="practicas-titulo">
        <SectionHeading
          id="practicas-titulo"
          title="Prácticas"
          lead="Cada tema se trabaja con ejercicios en Excel, Google Colab y asistentes de IA. Estas son las prácticas del programa."
        />
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {TRAINING.practices.map((practice) => (
            <li key={practice} className="flex items-start gap-3 border-t border-line py-4">
              <span aria-hidden="true" className="mt-[0.6rem] h-2.5 w-2.5 shrink-0 bg-brand-yellow" />
              <span className="font-medium">{practice}</span>
            </li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="incompany-titulo" className="on-indigo bg-brand-indigo text-white">
        <div className="mx-auto w-full max-w-page px-4 py-section sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div className="max-w-prose">
              <h2 id="incompany-titulo" className="text-display-2">
                Formato in-company
              </h2>
              <MarkerUnderline className="mt-3 h-4 w-40" />
              <p className="mt-5 text-lead text-on-indigo">
                Llevamos el programa a tu empresa o institución y lo adaptamos a tu equipo: duración, temas, prácticas con casos de tu área
                y el nivel de partida de los participantes. Lo definimos juntos en el diagnóstico.
              </p>
            </div>
            <CtaActions on_indigo />
          </div>
        </div>
      </section>

      <Section labelledby="evaluacion-titulo">
        <h2 id="evaluacion-titulo" className="text-display-3">
          ¿Participaste en el programa?
        </h2>
        <p className="mt-3 max-w-prose text-muted">
          Tu opinión nos ayuda a mejorar las próximas ediciones.{' '}
          <Link href="/encuestas/ia-finanzas-2026" className="link-underline font-semibold text-brand-indigo">
            Responder la evaluación del curso
          </Link>
        </p>
      </Section>

    </>
  )
}

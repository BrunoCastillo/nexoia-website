import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Section, SectionHeading } from '@/components/ui/section'
import { Tag } from '@/components/ui/card'
import { CtaActions, CtaBanner } from '@/components/ui/cta_banner'
import { HeroBoard } from '@/components/site/hero_board'
import { ProcessSteps } from '@/components/site/process_steps'
import { Monogram } from '@/components/site/monogram'
import { TRAINING } from '@/lib/content'
import { SITE, page_metadata } from '@/lib/site'

export const metadata: Metadata = {
  ...page_metadata({
    title: 'Capacitación en IA y automatización en Ecuador',
    description: SITE.description,
    path: '/',
  }),
  title: { absolute: 'NexoIA | Capacitación en IA y automatización en Ecuador' },
}

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="inicio-titulo" className="on-indigo bg-brand-indigo text-white">
        <Container className="pb-20 pt-8 sm:pb-24 sm:pt-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
            <div>
              <h1 id="inicio-titulo" className="text-display-1">
                Tu equipo, usando IA con criterio.
              </h1>
              <p className="mt-6 max-w-prose text-lead text-on-indigo">
                Capacitación presencial y automatizaciones a medida para empresas e instituciones de Ecuador. Trabajamos desde Cuenca, con
                tus procesos y tus herramientas.
              </p>
              <div className="mt-9">
                <CtaActions on_indigo />
              </div>
            </div>
            <HeroBoard />
          </div>
        </Container>
      </section>

      <section aria-label="Instituciones capacitadas" className="border-b border-line bg-paper">
        <Container className="flex flex-wrap items-baseline gap-x-8 gap-y-2 py-7">
          <p className="font-semibold text-muted">Capacitamos a equipos de</p>
          <p className="font-display text-2xl font-bold">Universidad de Cuenca</p>
          <p className="font-display text-2xl font-bold">ETAPA EP</p>
        </Container>
      </section>

      <Section labelledby="servicios-titulo">
        <SectionHeading id="servicios-titulo" title="Dos formas de trabajar con nosotros" />
        <div className="grid gap-6 md:grid-cols-2">
          <article aria-labelledby="linea-capacitacion" className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6 sm:p-8">
            <div>
              <Tag tone="indigo">Capacitación</Tag>
            </div>
            <h3 id="linea-capacitacion" className="text-display-3">
              Capacitación en IA aplicada
            </h3>
            <p className="text-muted">
              Programas presenciales con prácticas sobre casos de trabajo. El primero, {TRAINING.title}, abarca presupuesto, ingresos,
              anomalías, informes y agentes de análisis.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Datos del programa">
              <li>
                <Tag>{TRAINING.hours}</Tag>
              </li>
              <li>
                <Tag>{TRAINING.sessions}</Tag>
              </li>
              <li>
                <Tag>{TRAINING.modality}</Tag>
              </li>
            </ul>
            <p className="mt-auto pt-2">
              <Link href="/capacitacion" className="link-underline font-semibold text-brand-indigo">
                Ver el programa y el formato <span className="whitespace-nowrap">in-company</span>
              </Link>
            </p>
          </article>

          <article aria-labelledby="linea-automatizacion" className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6 sm:p-8">
            <div>
              <Tag tone="mist">Automatización</Tag>
            </div>
            <h3 id="linea-automatizacion" className="text-display-3">
              Automatización e IA a medida
            </h3>
            <p className="text-muted">
              Agentes de WhatsApp, agendamiento con Google Calendar y Gmail, publicación en redes, reportes, dashboards y agentes que
              analizan tus Excel. Al entregar, capacitamos a quien los va a usar.
            </p>
            <p className="mt-auto pt-2">
              <Link href="/servicios" className="link-underline font-semibold text-brand-indigo">
                Ver servicios
              </Link>
              <span className="text-muted"> o </span>
              <Link href="/proyectos" className="link-underline font-semibold text-brand-indigo">
                ver proyectos
              </Link>
            </p>
          </article>
        </div>
      </Section>

      <Section tone="surface" bordered labelledby="proceso-titulo">
        <SectionHeading
          id="proceso-titulo"
          title="Cómo trabajamos"
          lead="El mismo camino para un curso o una automatización: primero entender, después construir y al final dejar a tu equipo usándolo."
        />
        <ProcessSteps />
      </Section>

      <section aria-labelledby="quien-titulo" className="on-indigo bg-brand-indigo text-white">
        <Container className="py-section">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
            <Monogram size="lg" />
            <div className="max-w-prose">
              <h2 id="quien-titulo" className="text-display-2">
                Quién está detrás
              </h2>
              <p className="mt-4 text-lead text-on-indigo">
                Bruno Castillo, ingeniero de sistemas con másteres en Inteligencia Artificial y en Gerencia de Proyectos. Más de 15 años en
                tecnología, banca y medios de pago. Da las clases y construye las automatizaciones, desde Cuenca.
              </p>
              <p className="mt-6">
                <Link href="/sobre-nosotros" className="link-underline font-semibold text-white">
                  Conocer su trayectoria
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  )
}

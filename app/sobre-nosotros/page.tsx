import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/page_hero'
import { Section, SectionHeading } from '@/components/ui/section'
import { CtaBanner } from '@/components/ui/cta_banner'
import { Monogram } from '@/components/site/monogram'
import { FOUNDER } from '@/lib/content'
import { SITE, page_metadata } from '@/lib/site'

export const metadata: Metadata = page_metadata({
  title: 'Nosotros',
  description:
    'NexoIA es el proyecto de Bruno Castillo, ingeniero de sistemas con másteres en Inteligencia Artificial y Gerencia de Proyectos, con más de 15 años en tecnología. Cuenca, Ecuador.',
  path: '/sobre-nosotros',
})

export default function SobreNosotrosPage() {
  return (
    <>
      <PageHero
        title="Quién está detrás de NexoIA"
        lead="NexoIA nace en Cuenca para acercar la inteligencia artificial a empresas e instituciones de Ecuador con dos cosas a la vez: formación seria y soluciones que se usan todos los días."
      />

      <Section labelledby="fundador-titulo">
        <div className="grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
          <Monogram size="lg" />
          <div className="max-w-prose">
            <h2 id="fundador-titulo" className="text-display-2">
              {FOUNDER.name}
            </h2>
            <p className="mt-2 text-lead text-muted">
              {FOUNDER.role}. {SITE.city}.
            </p>
            <p className="mt-6">
              {FOUNDER.full_name} da las capacitaciones y construye las automatizaciones de NexoIA. Combina la formación técnica en
              inteligencia artificial con la experiencia de gestionar proyectos tecnológicos en banca y medios de pago, donde los
              resultados tienen que ser verificables.
            </p>
            <ul className="mt-6 space-y-2">
              {FOUNDER.credentials.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[0.6rem] h-2.5 w-2.5 shrink-0 bg-brand-yellow" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="surface" bordered labelledby="trayectoria-titulo">
        <SectionHeading id="trayectoria-titulo" title="Trayectoria" />
        <dl className="grid gap-x-10 md:grid-cols-2">
          {FOUNDER.experience.map((item) => (
            <div key={item.org} className="border-t border-line py-6">
              <dt className="font-display text-xl font-bold">{item.org}</dt>
              <dd className="mt-2 text-muted">{item.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section bordered labelledby="enfoque-titulo">
        <SectionHeading id="enfoque-titulo" title="Cómo entendemos el trabajo" />
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl font-bold">Criterio antes que herramienta</h3>
            <p className="mt-2 text-muted">Empezamos por el proceso y por lo que tu equipo necesita decidir. La herramienta viene después.</p>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Resultados que se pueden revisar</h3>
            <p className="mt-2 text-muted">Cada respuesta de la IA se valida. En los cursos, el pensamiento crítico es un tema en sí mismo.</p>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Tu equipo, autónomo</h3>
            <p className="mt-2 text-muted">Entregamos la solución junto con la capacitación para usarla y ajustarla sin depender de nosotros.</p>
          </div>
        </div>
      </Section>

      <CtaBanner />
    </>
  )
}

import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/page_hero'
import { Section } from '@/components/ui/section'
import { CtaBanner } from '@/components/ui/cta_banner'
import { ProjectCard } from '@/components/site/project_card'
import { PROJECTS } from '@/lib/content'
import { page_metadata } from '@/lib/site'

export const metadata: Metadata = page_metadata({
  title: 'Proyectos',
  description:
    'Automatizaciones y agentes de IA construidos por NexoIA: agendamiento por WhatsApp, publicación diaria en Instagram, control presupuestario y dashboards en Excel.',
  path: '/proyectos',
})

export default function ProyectosPage() {
  return (
    <>
      <PageHero
        title="Proyectos"
        lead="Lo que hemos construido, contado tal cual: el problema, qué hicimos, con qué herramientas y en qué estado está. Sin cifras que no podamos respaldar."
      />
      <Section labelledby="proyectos-lista">
        <h2 id="proyectos-lista" className="sr-only">
          Fichas de proyectos
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>
      <CtaBanner title="¿Tienes un proceso parecido?" />
    </>
  )
}

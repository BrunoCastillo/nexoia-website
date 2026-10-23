// Ficha de proyecto: problema, qué construimos, herramientas y estado o uso. Sin métricas.

import { Tag } from '@/components/ui/card'
import type { Project } from '@/lib/content'

export function ProjectCard({ project }: { project: Project }) {
  const heading_id = `proyecto-${project.id}`
  return (
    <article id={project.id} aria-labelledby={heading_id} className="scroll-mt-8 rounded-card border border-line bg-surface p-6 sm:p-8">
      <h3 id={heading_id} className="text-display-3">
        {project.title}
      </h3>
      <dl className="mt-6 grid gap-5">
        <div>
          <dt className="font-semibold">Problema</dt>
          <dd className="mt-1 text-muted">{project.problem}</dd>
        </div>
        <div>
          <dt className="font-semibold">Qué construimos</dt>
          <dd className="mt-1 text-muted">{project.built}</dd>
        </div>
        <div>
          <dt className="font-semibold">Herramientas</dt>
          <dd className="mt-2">
            <ul className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <li key={tool}>
                  <Tag tone="mist">{tool}</Tag>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="border-t border-line pt-4">
          <dt className="font-semibold">{project.status_label}</dt>
          <dd className="mt-1 text-muted">{project.status}</dd>
        </div>
      </dl>
    </article>
  )
}

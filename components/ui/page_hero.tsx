// Encabezado de las páginas interiores sobre el campo índigo. El texto nunca arranca oculto.

import { Container } from './container'

export function PageHero({
  title,
  lead,
  children,
  aside,
}: {
  title: string
  lead: string
  children?: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <section className="on-indigo bg-brand-indigo text-white">
      <Container className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className={aside ? 'grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center' : ''}>
          <div className="max-w-3xl">
            <h1 className="text-display-1">{title}</h1>
            <p className="mt-6 max-w-prose text-lead text-on-indigo">{lead}</p>
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside}
        </div>
      </Container>
    </section>
  )
}

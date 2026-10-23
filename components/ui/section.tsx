// Sección con ritmo vertical común. `tone="indigo"` es el campo de marca (texto blanco encima).

import { Container } from './container'

const tones = {
  paper: 'bg-paper text-ink',
  surface: 'bg-surface text-ink',
  indigo: 'on-indigo bg-brand-indigo text-white',
} as const

export function Section({
  children,
  tone = 'paper',
  width = 'page',
  id,
  labelledby,
  className = '',
  bordered = false,
}: {
  children: React.ReactNode
  tone?: keyof typeof tones
  width?: 'page' | 'narrow' | 'wide'
  id?: string
  labelledby?: string
  className?: string
  bordered?: boolean
}) {
  return (
    <section id={id} aria-labelledby={labelledby} className={`${tones[tone]} ${bordered ? 'border-t border-line' : ''}`}>
      <Container width={width} className={`py-section ${className}`}>
        {children}
      </Container>
    </section>
  )
}

export function SectionHeading({
  id,
  title,
  lead,
  tone = 'paper',
}: {
  id: string
  title: string
  lead?: string
  tone?: 'paper' | 'surface' | 'indigo'
}) {
  return (
    <div className="mb-10 max-w-prose sm:mb-12">
      <h2 id={id} className="text-display-2">
        {title}
      </h2>
      {lead && <p className={`mt-4 text-lead ${tone === 'indigo' ? 'text-on-indigo' : 'text-muted'}`}>{lead}</p>}
    </div>
  )
}

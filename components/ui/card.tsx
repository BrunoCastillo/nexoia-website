// Tarjeta plana: radio de 16 px, borde de 1 px, sin sombras ni degradados.

export function Card({
  children,
  as: Tag = 'div',
  className = '',
  labelledby,
}: {
  children: React.ReactNode
  as?: 'div' | 'article' | 'li' | 'section'
  className?: string
  labelledby?: string
}) {
  return (
    <Tag aria-labelledby={labelledby} className={`rounded-card border border-line bg-surface p-6 sm:p-8 ${className}`}>
      {children}
    </Tag>
  )
}

// Etiqueta corta dentro de tarjetas (duración, modalidad, herramientas).
export function Tag({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'indigo' | 'mist' }) {
  const tones = {
    plain: 'border border-line bg-paper text-ink',
    indigo: 'bg-brand-indigo text-white',
    mist: 'bg-brand-mist text-ink',
  }
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${tones[tone]}`}>{children}</span>
}

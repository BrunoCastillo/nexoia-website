// Ancho de lectura y márgenes laterales comunes a todas las páginas.

const widths = {
  page: 'max-w-page',
  narrow: 'max-w-3xl',
  wide: 'max-w-6xl',
} as const

export function Container({
  children,
  width = 'page',
  className = '',
}: {
  children: React.ReactNode
  width?: keyof typeof widths
  className?: string
}) {
  return <div className={`mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8 ${widths[width]} ${className}`}>{children}</div>
}

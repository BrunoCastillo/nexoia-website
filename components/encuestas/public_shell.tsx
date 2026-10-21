// Marco visual de las páginas públicas del módulo, alineado con el fondo del sitio.

export function PublicShell({
  children,
  width = 'narrow',
}: {
  children: React.ReactNode
  width?: 'narrow' | 'wide'
}) {
  const max_width = width === 'wide' ? 'max-w-6xl' : 'max-w-3xl'
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <section className="pt-28 pb-16">
        <div className={`mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8 ${max_width}`}>
          {children}
        </div>
      </section>
    </div>
  )
}

// Marco visual de las páginas de encuestas, privacidad y administración: campo índigo
// continuo con el header del sitio.

export function PublicShell({
  children,
  width = 'narrow',
}: {
  children: React.ReactNode
  width?: 'narrow' | 'wide'
}) {
  const max_width = width === 'wide' ? 'max-w-6xl' : 'max-w-3xl'
  return (
    <div className="on-indigo min-h-[70vh] bg-brand-indigo text-white">
      <section className="pb-20 pt-10 sm:pt-14">
        <div className={`mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8 ${max_width}`}>
          {children}
        </div>
      </section>
    </div>
  )
}

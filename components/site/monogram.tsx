// Monograma "BC" mientras no haya foto real de Bruno.

export function Monogram({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const sizes = { md: 'h-28 w-28 text-5xl', lg: 'h-40 w-40 text-7xl' }
  return (
    <div
      role="img"
      aria-label="Monograma de Bruno Castillo"
      className={`flex shrink-0 items-center justify-center rounded-card bg-brand-yellow font-display font-extrabold tracking-[-0.04em] text-brand-indigo ${sizes[size]}`}
    >
      BC
    </div>
  )
}

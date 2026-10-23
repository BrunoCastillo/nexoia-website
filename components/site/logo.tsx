// Logotipo de texto: "nexo" + "IA". El "IA" va en amarillo sobre índigo y en índigo sobre claro.

import Link from 'next/link'

export function Logo({ tone = 'indigo', className = '' }: { tone?: 'indigo' | 'light'; className?: string }) {
  const base = tone === 'indigo' ? 'text-white' : 'text-ink'
  const accent = tone === 'indigo' ? 'text-brand-yellow' : 'text-brand-indigo'
  return (
    <Link href="/" className={`font-display text-[1.65rem] font-extrabold leading-none tracking-[-0.02em] ${base} ${className}`}>
      nexo<span className={accent}>IA</span>
      <span className="sr-only">, ir al inicio</span>
    </Link>
  )
}

// Botones y enlaces con forma de píldora: el único elemento redondeado del sitio.
// `primary` es el amarillo marcador con texto oscuro; nunca lleva texto blanco.

import Link from 'next/link'

const base =
  'inline-flex min-h-[48px] shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors duration-150'

const variants = {
  primary: 'bg-brand-yellow text-ink hover:bg-brand-yellow-deep',
  secondary: 'border-2 border-ink text-ink hover:bg-ink hover:text-white',
  'secondary-on-indigo': 'border-2 border-white text-white hover:bg-white hover:text-brand-indigo',
} as const

const sizes = {
  md: '',
  lg: 'px-7 py-4 text-[1.0625rem]',
} as const

type ButtonVariant = keyof typeof variants

export function button_classes(variant: ButtonVariant = 'primary', size: keyof typeof sizes = 'md') {
  return `${base} ${variants[variant]} ${sizes[size]}`
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  href: string
  children: React.ReactNode
  variant?: ButtonVariant
  size?: keyof typeof sizes
  className?: string
}) {
  const classes = `${button_classes(variant, size)} ${className}`
  const is_external = /^https?:\/\//.test(href)
  if (is_external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

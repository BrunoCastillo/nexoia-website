'use client'

// Navegación interna del panel. No se muestra en el menú público.

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { sign_out_admin } from '@/lib/admin/session'
import { secondary_button_class } from '@/lib/surveys/ui_classes'

const links = [
  { href: '/admin/encuestas', label: 'Resultados' },
  { href: '/admin/capacitaciones', label: 'Capacitaciones' },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav aria-label="Administración" className="mb-6 flex flex-wrap gap-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? 'page' : undefined}
          className={pathname === link.href ? secondary_button_class : 'inline-flex items-center rounded-xl px-4 py-3 text-gray-300'}
        >
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        className={secondary_button_class}
        onClick={() => {
          sign_out_admin().then(() => router.push('/admin/acceso'))
        }}
      >
        Cerrar sesión
      </button>
    </nav>
  )
}

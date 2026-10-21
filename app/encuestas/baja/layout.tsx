import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancelar suscripción | NEXOIA',
  robots: { index: false, follow: false },
}

export default function BajaLayout({ children }: { children: React.ReactNode }) {
  return children
}

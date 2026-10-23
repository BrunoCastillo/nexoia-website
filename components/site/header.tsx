// Cabecera sobre el campo índigo. La navegación interactiva vive en SiteNav (cliente).

import { Container } from '@/components/ui/container'
import { Logo } from './logo'
import { SiteNav } from './site_nav'

export function SiteHeader() {
  return (
    <header className="on-indigo relative z-40 bg-brand-indigo text-white">
      <Container>
        <div className="flex min-h-[76px] items-center justify-between gap-6 py-4">
          <Logo />
          <SiteNav />
        </div>
      </Container>
    </header>
  )
}

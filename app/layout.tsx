import type { Metadata, Viewport } from 'next'
import './globals.css'
import { font_display, font_sans } from './fonts'
import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'NexoIA | Capacitación en IA y automatización en Ecuador',
    template: '%s | NexoIA',
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: 'Bruno Castillo' }],
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    siteName: SITE.name,
    title: 'NexoIA | Capacitación en IA y automatización en Ecuador',
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexoIA | Capacitación en IA y automatización en Ecuador',
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#23205C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-EC" className={`${font_sans.variable} ${font_display.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only z-50 rounded-full bg-brand-yellow px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}

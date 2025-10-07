import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar, Footer } from '@/components/layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NEXOIA | Soluciones con Inteligencia Artificial',
  description: 'Impulsando la innovación con tecnología. Servicios accesibles de automatización, chatbots, generación de contenido y consultoría tecnológica.',
  keywords: 'inteligencia artificial, IA, automatización, chatbots, generación de contenido, consultoría tecnológica, innovación',
  authors: [{ name: 'NEXOIA' }],
  openGraph: {
    title: 'NEXOIA | Soluciones con Inteligencia Artificial',
    description: 'Impulsando la innovación con tecnología. Servicios accesibles para todos.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXOIA | Soluciones con Inteligencia Artificial',
    description: 'Impulsando la innovación con tecnología. Servicios accesibles para todos.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

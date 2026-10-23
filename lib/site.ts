// Datos de contacto y navegación del sitio. Cambiar aquí actualiza el header, el footer y los CTA.

export const SITE = {
  name: 'NexoIA',
  url: 'https://nexoiaec.vercel.app',
  description:
    'Capacitación presencial en inteligencia artificial y automatizaciones a medida para empresas e instituciones de Ecuador. Desde Cuenca.',
  email: 'nexoiaec@gmail.com',
  whatsapp_number: '593995048253',
  whatsapp_display: '+593 99 504 8253',
  whatsapp_url: 'https://wa.me/593995048253',
  calendly_url: 'https://calendly.com/brunocastillo4427/consulta-nexoia',
  instagram_url: 'https://instagram.com/nexoiaec',
  instagram_handle: '@nexoiaec',
  city: 'Cuenca, Ecuador',
} as const

export const PRIMARY_CTA_LABEL = 'Agendar diagnóstico de 30 min'

export const NAV_ITEMS = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/capacitacion', label: 'Capacitación' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/sobre-nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
] as const



const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'NexoIA: tu equipo, usando IA con criterio.',
}

// Metadata de cada página pública: título, descripción, canonical y Open Graph propios.
export function page_metadata({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website' as const,
      locale: 'es_EC',
      siteName: SITE.name,
      url: path,
      title: `${title} | ${SITE.name}`,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${title} | ${SITE.name}`,
      description,
      images: [OG_IMAGE.url],
    },
  }
}

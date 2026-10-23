import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

const routes: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1 },
  { path: '/capacitacion', priority: 0.9 },
  { path: '/servicios', priority: 0.9 },
  { path: '/proyectos', priority: 0.8 },
  { path: '/sobre-nosotros', priority: 0.7 },
  { path: '/contacto', priority: 0.8 },
  { path: '/encuestas/ia-finanzas-2026', priority: 0.3 },
  { path: '/privacidad', priority: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE.url}${route.path === '/' ? '' : route.path}`,
    changeFrequency: 'monthly',
    priority: route.priority,
  }))
}

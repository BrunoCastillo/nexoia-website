// Fuentes autoalojadas desde los paquetes de Fontsource: el build no depende de Google Fonts.

import localFont from 'next/font/local'

export const font_sans = localFont({
  src: '../node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2',
  weight: '300 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
})

export const font_display = localFont({
  src: '../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-display',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
})

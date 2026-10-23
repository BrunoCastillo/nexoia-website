import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

// Imagen para redes sociales (1200 x 630), generada en el build con las fuentes de la marca.

export const alt = 'NexoIA: tu equipo, usando IA con criterio. Capacitación y automatización para empresas e instituciones de Ecuador.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function font(path: string) {
  return readFile(join(process.cwd(), 'node_modules', path))
}

export default async function OpengraphImage() {
  const [display, body] = await Promise.all([
    font('@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff'),
    font('@fontsource/figtree/files/figtree-latin-500-normal.woff'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#23205C',
          color: '#FFFFFF',
          padding: '72px 80px',
          fontFamily: 'Figtree',
        }}
      >
        <div style={{ display: 'flex', fontFamily: 'Bricolage', fontSize: 44, letterSpacing: '-0.02em' }}>
          nexo<span style={{ color: '#F2C230' }}>IA</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Bricolage', fontSize: 84, lineHeight: 1.02, letterSpacing: '-0.03em', maxWidth: 900 }}>
            Tu equipo, usando IA con criterio.
          </div>
          <svg width="420" height="28" viewBox="0 0 420 28" style={{ marginTop: 14 }}>
            <path d="M6 18 C 110 8, 260 6, 414 14" fill="none" stroke="#F2C230" strokeWidth="10" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#E6E4F5' }}>
          Capacitación en IA y automatización para empresas e instituciones de Ecuador. Desde Cuenca.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Bricolage', data: display, weight: 800, style: 'normal' },
        { name: 'Figtree', data: body, weight: 500, style: 'normal' },
      ],
    },
  )
}

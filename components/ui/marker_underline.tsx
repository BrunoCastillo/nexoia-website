// Trazos de marcador amarillo en SVG. Se usan con mesura: anotan, no decoran.
// `animated` dibuja el trazo una sola vez con stroke-dashoffset; con prefers-reduced-motion
// el trazo aparece ya dibujado (ver .marker-stroke-animated en globals.css).

type MarkerProps = {
  className?: string
  animated?: boolean
  stroke_width?: number
}

export function MarkerUnderline({ className = '', animated = false, stroke_width = 7 }: MarkerProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 240 24" preserveAspectRatio="none" className={`block ${className}`}>
      <path
        d="M4 15 C 60 7, 150 5, 236 12"
        fill="none"
        stroke="#F2C230"
        strokeWidth={stroke_width}
        strokeLinecap="round"
        className={`marker-stroke ${animated ? 'marker-stroke-animated' : ''}`}
        style={{ ['--marker-length' as string]: 260 }}
      />
    </svg>
  )
}

export function MarkerCircle({ className = '', animated = false, stroke_width = 4 }: MarkerProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 400 80" preserveAspectRatio="none" className={`pointer-events-none block ${className}`}>
      <path
        d="M30 18 C 120 4, 300 2, 382 22 C 404 34, 392 62, 330 70 C 230 80, 90 78, 28 64 C 2 56, 4 30, 52 14"
        fill="none"
        stroke="#F2C230"
        strokeWidth={stroke_width}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={`marker-stroke ${animated ? 'marker-stroke-animated' : ''}`}
        style={{ ['--marker-length' as string]: 1000 }}
      />
    </svg>
  )
}

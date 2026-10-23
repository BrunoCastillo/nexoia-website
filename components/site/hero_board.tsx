// "Pizarra" del inicio: el temario oficial del programa, anotado con el trazo de marcador.
// Ocupa el lugar de una foto mientras no haya fotos reales de las sesiones.

import Link from 'next/link'
import { MarkerCircle } from '@/components/ui/marker_underline'
import { TRAINING } from '@/lib/content'

const HIGHLIGHT_INDEX = 3

export function HeroBoard() {
  return (
    <figure className="relative min-w-0 rounded-card bg-paper p-6 text-ink sm:p-8">
      <figcaption>
        <p className="font-display text-xl font-bold leading-tight sm:text-2xl">{TRAINING.title}</p>
        <p className="mt-1 text-sm text-muted">
          Temario del programa para {TRAINING.institutions}
        </p>
      </figcaption>

      <ol className="mt-6 space-y-1">
        {TRAINING.topics.map((topic, index) => {
          const is_highlight = index === HIGHLIGHT_INDEX
          return (
            <li key={topic} className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-2 py-2 border-b border-line last:border-b-0">
              <span className="font-display text-lg font-extrabold text-brand-indigo" aria-hidden="true">
                {index + 1}
              </span>
              <span className={`relative text-[0.98rem] leading-snug ${is_highlight ? 'font-semibold' : ''}`}>
                <span className="sr-only">Tema {index + 1}: </span>
                {topic}
                {is_highlight && (
                  <MarkerCircle animated className="absolute -left-3 -top-2.5 h-[calc(100%+1.25rem)] w-[calc(100%+1.25rem)]" />
                )}
              </span>
            </li>
          )
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <svg aria-hidden="true" viewBox="0 0 40 24" className="h-5 w-8 shrink-0">
            <path d="M3 4 C 10 18, 22 20, 36 12" fill="none" stroke="#23205C" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M28 8 L 36 12 L 29 17" fill="none" stroke="#23205C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          11 prácticas con Excel y Google Colab
        </p>
        <Link href="/capacitacion" className="link-underline text-sm font-semibold text-brand-indigo">
          Ver el programa
        </Link>
      </div>
    </figure>
  )
}
